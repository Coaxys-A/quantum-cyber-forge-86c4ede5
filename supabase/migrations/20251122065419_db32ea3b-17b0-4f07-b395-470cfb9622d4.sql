-- SEO Brain Tables
CREATE TABLE IF NOT EXISTS public.seo_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  page_type TEXT,
  language TEXT DEFAULT 'en',
  seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100),
  metadata JSONB DEFAULT '{}',
  issues JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  extracted_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES public.seo_audits(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_fix_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES public.seo_audits(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  fix_type TEXT NOT NULL,
  before_value JSONB,
  after_value JSONB,
  applied_by UUID,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  metadata_score INTEGER,
  content_score INTEGER,
  technical_score INTEGER,
  performance_score INTEGER,
  accessibility_score INTEGER,
  scored_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_scan_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  scan_type TEXT NOT NULL,
  urls_scanned INTEGER DEFAULT 0,
  issues_found INTEGER DEFAULT 0,
  duration_ms INTEGER,
  status TEXT DEFAULT 'running',
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Infrastructure Monitoring Tables
CREATE TABLE IF NOT EXISTS public.system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  unit TEXT,
  labels JSONB DEFAULT '{}',
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.api_latency (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  response_time_ms INTEGER NOT NULL,
  status_code INTEGER,
  tenant_id UUID,
  user_id UUID,
  error_message TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.service_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  last_check TIMESTAMP WITH TIME ZONE DEFAULT now(),
  response_time_ms INTEGER,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.deployment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  version TEXT,
  status TEXT NOT NULL,
  environment TEXT DEFAULT 'production',
  deployed_by UUID,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  logs TEXT,
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.incident_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  affected_services TEXT[],
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  root_cause TEXT,
  resolution TEXT,
  created_by UUID,
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.alert_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  source TEXT,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.ssl_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL UNIQUE,
  issuer TEXT,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  days_remaining INTEGER,
  status TEXT NOT NULL,
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.backup_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_type TEXT NOT NULL,
  status TEXT NOT NULL,
  size_bytes BIGINT,
  location TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.cloud_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  region TEXT NOT NULL,
  service TEXT NOT NULL,
  status TEXT NOT NULL,
  latency_ms INTEGER,
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.seo_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_fix_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_scan_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_latency ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ssl_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cloud_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies for SEO tables
CREATE POLICY "Users can view own tenant SEO audits" ON public.seo_audits
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.tenant_id = seo_audits.tenant_id AND profiles.id = auth.uid())
  );

CREATE POLICY "Admins can manage SEO audits" ON public.seo_audits
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      JOIN public.user_roles ON user_roles.user_id = profiles.id
      WHERE profiles.tenant_id = seo_audits.tenant_id 
      AND profiles.id = auth.uid() 
      AND user_roles.role IN ('ADMIN', 'OPS')
    )
  );

CREATE POLICY "Hypervisor can manage all SEO data" ON public.seo_audits
  FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

CREATE POLICY "Users can view own tenant SEO recommendations" ON public.seo_recommendations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.tenant_id = seo_recommendations.tenant_id AND profiles.id = auth.uid())
  );

CREATE POLICY "Admins can manage SEO recommendations" ON public.seo_recommendations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      JOIN public.user_roles ON user_roles.user_id = profiles.id
      WHERE profiles.tenant_id = seo_recommendations.tenant_id 
      AND profiles.id = auth.uid() 
      AND user_roles.role IN ('ADMIN', 'OPS')
    )
  );

CREATE POLICY "Hypervisor can manage all SEO recommendations" ON public.seo_recommendations
  FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- RLS Policies for Infrastructure tables
CREATE POLICY "Admins can view system metrics" ON public.system_metrics
  FOR SELECT USING (public.has_role(auth.uid(), 'ADMIN') OR public.has_role(auth.uid(), 'HYPERVISOR'));

CREATE POLICY "Hypervisor can manage all metrics" ON public.system_metrics
  FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

CREATE POLICY "Admins can view API latency" ON public.api_latency
  FOR SELECT USING (public.has_role(auth.uid(), 'ADMIN') OR public.has_role(auth.uid(), 'HYPERVISOR'));

CREATE POLICY "Admins can view service health" ON public.service_health
  FOR SELECT USING (public.has_role(auth.uid(), 'ADMIN') OR public.has_role(auth.uid(), 'HYPERVISOR'));

CREATE POLICY "Hypervisor can manage service health" ON public.service_health
  FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

CREATE POLICY "Admins can view deployments" ON public.deployment_logs
  FOR SELECT USING (public.has_role(auth.uid(), 'ADMIN') OR public.has_role(auth.uid(), 'HYPERVISOR'));

CREATE POLICY "Admins can view incidents" ON public.incident_reports
  FOR SELECT USING (public.has_role(auth.uid(), 'ADMIN') OR public.has_role(auth.uid(), 'HYPERVISOR'));

CREATE POLICY "Hypervisor can manage incidents" ON public.incident_reports
  FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

CREATE POLICY "Admins can view alerts" ON public.alert_events
  FOR SELECT USING (public.has_role(auth.uid(), 'ADMIN') OR public.has_role(auth.uid(), 'HYPERVISOR'));

-- Indexes for performance
CREATE INDEX idx_seo_audits_tenant ON public.seo_audits(tenant_id);
CREATE INDEX idx_seo_audits_url ON public.seo_audits(url);
CREATE INDEX idx_seo_audits_scanned_at ON public.seo_audits(scanned_at DESC);
CREATE INDEX idx_system_metrics_type ON public.system_metrics(metric_type, recorded_at DESC);
CREATE INDEX idx_api_latency_endpoint ON public.api_latency(endpoint, recorded_at DESC);
CREATE INDEX idx_service_health_name ON public.service_health(service_name);
CREATE INDEX idx_alert_events_triggered ON public.alert_events(triggered_at DESC);

-- Triggers for updated_at
CREATE TRIGGER update_seo_audits_updated_at BEFORE UPDATE ON public.seo_audits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_health_updated_at BEFORE UPDATE ON public.service_health
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();