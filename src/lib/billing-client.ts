import { supabase } from '@/integrations/supabase/client';

export interface Plan {
  id: string;
  name: string;
  tier: string;
  price_monthly: number;
  price_yearly: number;
  usdt_price_monthly: number | null;
  usdt_price_yearly: number | null;
  limits: Record<string, any>;
  features: string[];
}

export interface Subscription {
  id: string;
  tenant_id: string;
  plan_id: string;
  status: string;
  billing_cycle: 'monthly' | 'yearly';
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at: string | null;
  stripe_subscription_id: string | null;
  plan: Plan;
}

export interface CryptoPayment {
  id: string;
  address: string;
  network: string;
  currency: string;
  amount_usd: number;
  amount_token: number;
  status: 'PENDING' | 'CONFIRMED' | 'EXPIRED' | 'CANCELLED';
  tx_hash: string | null;
  expires_at: string;
  plan_id: string;
  billing_cycle: 'monthly' | 'yearly';
}

export interface StripeCheckoutResponse {
  url: string;
  session_id: string;
}

export interface CryptoPaymentRequest {
  plan_id: string;
  billing_cycle: 'monthly' | 'yearly';
  network: 'TRON' | 'ETHEREUM' | 'BSC';
}

export const billingClient = {
  // Get all available plans
  async getPlans(): Promise<Plan[]> {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('price_monthly', { ascending: true });

    if (error) throw error;
    return (data || []) as Plan[];
  },

  // Get current subscription
  async getCurrentSubscription(): Promise<Subscription | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile?.tenant_id) throw new Error('No tenant found');

    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plan:plans(*)
      `)
      .eq('tenant_id', profile.tenant_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as any;
  },

  // Create Stripe checkout session
  async createStripeCheckout(planId: string, billingCycle: 'monthly' | 'yearly'): Promise<StripeCheckoutResponse> {
    const response = await fetch('/api/billing/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      },
      body: JSON.stringify({ plan_id: planId, billing_cycle: billingCycle })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    return response.json();
  },

  // Create customer portal session
  async createCustomerPortal(): Promise<{ url: string }> {
    const response = await fetch('/api/billing/stripe/portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create portal session');
    }

    return response.json();
  },

  // Create crypto payment
  async createCryptoPayment(request: CryptoPaymentRequest): Promise<CryptoPayment> {
    const { data, error } = await supabase.functions.invoke('crypto-payment', {
      body: { action: 'create', ...request }
    });

    if (error) throw error;
    return data;
  },

  // Check crypto payment status
  async checkCryptoPayment(paymentId: string): Promise<CryptoPayment> {
    const { data, error } = await supabase.functions.invoke('crypto-payment', {
      body: { action: 'check', payment_id: paymentId }
    });

    if (error) throw error;
    return data;
  },

  // Get usage statistics
  async getUsageStats(): Promise<Record<string, number>> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile?.tenant_id) throw new Error('No tenant found');

    const { data, error } = await supabase
      .from('usage_events')
      .select('type, quantity')
      .eq('tenant_id', profile.tenant_id)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    // Aggregate by type
    const stats: Record<string, number> = {};
    data?.forEach(event => {
      stats[event.type] = (stats[event.type] || 0) + event.quantity;
    });

    return stats;
  },

  // Get invoices
  async getInvoices() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile?.tenant_id) throw new Error('No tenant found');

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('tenant_id', profile.tenant_id)
      .single();

    if (!subscription) return [];

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('subscription_id', subscription.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

// Usage tracking helper
export async function recordUsage(type: string, quantity: number = 1, metadata: Record<string, any> = {}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', user.id)
    .single();

  if (!profile?.tenant_id) return;

  await supabase
    .from('usage_events')
    .insert({
      tenant_id: profile.tenant_id,
      type,
      quantity,
      metadata
    });
}
