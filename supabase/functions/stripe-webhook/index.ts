import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    
    // Parse Stripe event
    const event = JSON.parse(body);
    
    console.log('[STRIPE WEBHOOK]', event.type, event.id);

    // Log webhook event
    await supabaseClient.from('billing_webhook_events').insert({
      event_id: event.id,
      event_type: event.type,
      payload: event,
      processed_at: new Date().toISOString()
    });

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const tenantId = session.metadata?.tenant_id;
        const planId = session.metadata?.plan_id;
        const userId = session.metadata?.user_id;
        
        if (tenantId && planId) {
          // Create or update subscription
          await supabaseClient.from('subscriptions').upsert({
            tenant_id: tenantId,
            plan_id: planId,
            billing_owner_id: userId,
            stripe_subscription_id: session.subscription,
            status: 'active',
            billing_cycle: session.metadata?.billing_cycle || 'monthly',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });
          
          console.log('[CHECKOUT COMPLETED]', tenantId, planId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await supabaseClient.from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);
        
        console.log('[SUBSCRIPTION UPDATED]', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await supabaseClient.from('subscriptions')
          .update({
            status: 'canceled',
            cancel_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);
        
        console.log('[SUBSCRIPTION DELETED]', subscription.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const { data: subscription } = await supabaseClient
          .from('subscriptions')
          .select('id')
          .eq('stripe_subscription_id', invoice.subscription)
          .single();
        
        if (subscription) {
          await supabaseClient.from('invoices').insert({
            subscription_id: subscription.id,
            stripe_invoice_id: invoice.id,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: 'paid',
            paid_at: new Date(invoice.status_transitions.paid_at * 1000).toISOString()
          });
          
          console.log('[INVOICE PAID]', invoice.id);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const { data: subscription } = await supabaseClient
          .from('subscriptions')
          .select('id')
          .eq('stripe_subscription_id', invoice.subscription)
          .single();
        
        if (subscription) {
          await supabaseClient.from('invoices').insert({
            subscription_id: subscription.id,
            stripe_invoice_id: invoice.id,
            amount: invoice.amount_due,
            currency: invoice.currency,
            status: 'failed'
          });
          
          console.log('[INVOICE FAILED]', invoice.id);
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error: any) {
    console.error('[WEBHOOK ERROR]', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
