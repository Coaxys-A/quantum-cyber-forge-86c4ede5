-- Phase Omega: Complete System Finalization

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.apt_runs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.apt_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.devsecops_scans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.devsecops_findings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alert_events;

-- Create email logs table
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_email_logs_recipient ON public.email_logs(recipient);
CREATE INDEX idx_email_logs_created_at ON public.email_logs(created_at);

-- Enable RLS on email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hypervisor can view email logs" ON public.email_logs
  FOR SELECT USING (has_role(auth.uid(), 'HYPERVISOR'));

-- Create system events table for real-time notifications
CREATE TABLE IF NOT EXISTS public.system_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id),
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT,
  metadata JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_system_events_tenant ON public.system_events(tenant_id);
CREATE INDEX idx_system_events_created_at ON public.system_events(created_at);
CREATE INDEX idx_system_events_read ON public.system_events(read);

ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tenant events" ON public.system_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.tenant_id = system_events.tenant_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can update own tenant events" ON public.system_events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.tenant_id = system_events.tenant_id
      AND profiles.id = auth.uid()
    )
  );

-- Add realtime for system events
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_events;

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  action TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT now(),
  UNIQUE(identifier, action, window_start)
);

CREATE INDEX idx_rate_limits_identifier ON public.rate_limits(identifier, action);
CREATE INDEX idx_rate_limits_window ON public.rate_limits(window_start);

-- Function to check rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_identifier TEXT,
  p_action TEXT,
  p_max_attempts INTEGER,
  p_window_seconds INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
  v_window_start TIMESTAMPTZ;
BEGIN
  v_window_start := now() - (p_window_seconds || ' seconds')::INTERVAL;
  
  SELECT COALESCE(SUM(count), 0) INTO v_count
  FROM public.rate_limits
  WHERE identifier = p_identifier
    AND action = p_action
    AND window_start >= v_window_start;
  
  IF v_count >= p_max_attempts THEN
    RETURN false;
  END IF;
  
  INSERT INTO public.rate_limits (identifier, action, count, window_start)
  VALUES (p_identifier, p_action, 1, now())
  ON CONFLICT (identifier, action, window_start)
  DO UPDATE SET count = public.rate_limits.count + 1;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Cleanup old rate limit records
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits() RETURNS void AS $$
BEGIN
  DELETE FROM public.rate_limits
  WHERE window_start < now() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add session tracking
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  device_fingerprint TEXT,
  ip_address TEXT,
  user_agent TEXT,
  location TEXT,
  last_activity TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_last_activity ON public.user_sessions(last_activity);

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Hypervisor can view all sessions" ON public.user_sessions
  FOR ALL USING (has_role(auth.uid(), 'HYPERVISOR'));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_apt_runs_status ON public.apt_runs(status);
CREATE INDEX IF NOT EXISTS idx_apt_runs_created_at ON public.apt_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_devsecops_scans_status ON public.devsecops_scans(status);
CREATE INDEX IF NOT EXISTS idx_devsecops_findings_severity ON public.devsecops_findings(severity);
CREATE INDEX IF NOT EXISTS idx_usage_events_type ON public.usage_events(type);
CREATE INDEX IF NOT EXISTS idx_usage_events_created_at ON public.usage_events(created_at DESC);

-- Add function to get tenant usage summary
CREATE OR REPLACE FUNCTION get_tenant_usage_summary(p_tenant_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'ai_requests', COALESCE(SUM(CASE WHEN type = 'AI_REQUEST' THEN quantity ELSE 0 END), 0),
    'simulations', COALESCE(SUM(CASE WHEN type = 'APT_SIMULATION' THEN quantity ELSE 0 END), 0),
    'scans', COALESCE(SUM(CASE WHEN type = 'DEVSECOPS_SCAN' THEN quantity ELSE 0 END), 0),
    'projects', COALESCE(SUM(CASE WHEN type = 'PROJECT_CREATED' THEN quantity ELSE 0 END), 0)
  ) INTO v_result
  FROM public.usage_events
  WHERE tenant_id = p_tenant_id
    AND created_at >= date_trunc('month', now());
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;