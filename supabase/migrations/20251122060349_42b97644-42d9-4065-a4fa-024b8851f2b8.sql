-- Create crypto_payments table
CREATE TABLE IF NOT EXISTS public.crypto_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  network TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USDT',
  amount_usd NUMERIC(10, 2) NOT NULL,
  amount_token NUMERIC(18, 6) NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'EXPIRED', 'CANCELLED')),
  tx_hash TEXT,
  plan_id UUID NOT NULL REFERENCES public.plans(id),
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  expires_at TIMESTAMPTZ NOT NULL,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create usage_events table
CREATE TABLE IF NOT EXISTS public.usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create billing_webhook_events table for idempotency
CREATE TABLE IF NOT EXISTS public.billing_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT now(),
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add stripe_customer_id to tenants if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tenants' 
    AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE public.tenants ADD COLUMN stripe_customer_id TEXT;
  END IF;
END $$;

-- Add billing_cycle to subscriptions if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'subscriptions' 
    AND column_name = 'billing_cycle'
  ) THEN
    ALTER TABLE public.subscriptions ADD COLUMN billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly'));
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_crypto_payments_tenant ON public.crypto_payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crypto_payments_status ON public.crypto_payments(status);
CREATE INDEX IF NOT EXISTS idx_usage_events_tenant ON public.usage_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_type ON public.usage_events(type);
CREATE INDEX IF NOT EXISTS idx_usage_events_created ON public.usage_events(created_at);

-- Enable RLS
ALTER TABLE public.crypto_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for crypto_payments
CREATE POLICY "Users can view own tenant crypto payments"
ON public.crypto_payments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.tenant_id = crypto_payments.tenant_id
    AND profiles.id = auth.uid()
  )
);

CREATE POLICY "Admins can manage crypto payments"
ON public.crypto_payments FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    JOIN public.user_roles ON user_roles.user_id = profiles.id
    WHERE profiles.tenant_id = crypto_payments.tenant_id
    AND profiles.id = auth.uid()
    AND user_roles.role IN ('ADMIN', 'BILLING_OWNER')
  )
);

CREATE POLICY "Hypervisor can manage all crypto payments"
ON public.crypto_payments FOR ALL
USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- RLS policies for usage_events
CREATE POLICY "Users can view own tenant usage"
ON public.usage_events FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.tenant_id = usage_events.tenant_id
    AND profiles.id = auth.uid()
  )
);

CREATE POLICY "Hypervisor can view all usage"
ON public.usage_events FOR SELECT
USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- RLS policies for billing_webhook_events
CREATE POLICY "Only hypervisor can view webhook events"
ON public.billing_webhook_events FOR SELECT
USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Trigger for updated_at
CREATE TRIGGER update_crypto_payments_updated_at
BEFORE UPDATE ON public.crypto_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();