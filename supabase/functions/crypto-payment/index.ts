import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile?.tenant_id) {
      throw new Error('No tenant found');
    }

    const { action, plan_id, billing_cycle, network, payment_id } = await req.json();

    if (action === 'create') {
      // Get plan details
      const { data: plan } = await supabaseClient
        .from('plans')
        .select('*')
        .eq('id', plan_id)
        .single();

      if (!plan) {
        throw new Error('Plan not found');
      }

      const amount = billing_cycle === 'yearly' 
        ? (plan.usdt_price_yearly || plan.price_yearly)
        : (plan.usdt_price_monthly || plan.price_monthly);

      // Generate unique payment address (in production, use real crypto payment gateway)
      const paymentAddress = `T${Math.random().toString(36).substring(2, 15)}DEMO`;
      
      // Create payment record
      const { data: payment, error } = await supabaseClient
        .from('crypto_payments')
        .insert({
          tenant_id: profile.tenant_id,
          plan_id,
          billing_cycle,
          network: network || 'TRON',
          currency: 'USDT',
          amount_usd: amount,
          amount_token: amount,
          address: paymentAddress,
          status: 'PENDING',
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(payment), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else if (action === 'check') {
      // Check payment status
      const { data: payment } = await supabaseClient
        .from('crypto_payments')
        .select('*')
        .eq('id', payment_id)
        .eq('tenant_id', profile.tenant_id)
        .single();

      if (!payment) {
        throw new Error('Payment not found');
      }

      // In production, verify blockchain transaction here
      // For demo, auto-confirm after 30 seconds
      const age = Date.now() - new Date(payment.created_at).getTime();
      if (age > 30000 && payment.status === 'PENDING') {
        // Update to confirmed
        const { data: updated } = await supabaseClient
          .from('crypto_payments')
          .update({
            status: 'CONFIRMED',
            confirmed_at: new Date().toISOString(),
            tx_hash: `0x${Math.random().toString(16).substring(2)}`
          })
          .eq('id', payment_id)
          .select()
          .single();

        // Create/update subscription
        await supabaseClient.from('subscriptions').upsert({
          tenant_id: profile.tenant_id,
          plan_id: payment.plan_id,
          billing_owner_id: user.id,
          status: 'active',
          billing_cycle: payment.billing_cycle,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + (payment.billing_cycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString()
        });

        return new Response(JSON.stringify(updated), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify(payment), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    throw new Error('Invalid action');
  } catch (error: any) {
    console.error('[CRYPTO PAYMENT ERROR]', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
