-- APT Simulator Tables

-- Threat actor profiles
CREATE TABLE IF NOT EXISTS public.apt_actor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  aliases TEXT[] DEFAULT '{}',
  origin_country TEXT,
  motivation TEXT,
  sophistication_level TEXT NOT NULL CHECK (sophistication_level IN ('low', 'medium', 'high', 'nation_state')),
  primary_targets TEXT[] DEFAULT '{}',
  common_ttps JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- APT scenarios (templates)
CREATE TABLE IF NOT EXISTS public.apt_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  actor_profile_id UUID REFERENCES public.apt_actor_profiles(id),
  attack_vector TEXT NOT NULL,
  target_components TEXT[] DEFAULT '{}',
  objectives TEXT[] DEFAULT '{}',
  stealth_mode BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- APT simulation runs
CREATE TABLE IF NOT EXISTS public.apt_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES public.apt_scenarios(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'stopped')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  progress_percent INTEGER DEFAULT 0,
  current_stage TEXT,
  results JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- APT events (kill chain progression)
CREATE TABLE IF NOT EXISTS public.apt_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES public.apt_runs(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT now(),
  stage TEXT NOT NULL,
  tactic TEXT NOT NULL,
  technique TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  impact_score INTEGER,
  detection_probability NUMERIC(5,2),
  narrative TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- APT detection logs
CREATE TABLE IF NOT EXISTS public.apt_detection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES public.apt_runs(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.apt_events(id),
  detected_at TIMESTAMPTZ DEFAULT now(),
  detection_type TEXT NOT NULL,
  confidence_score NUMERIC(5,2),
  alert_severity TEXT NOT NULL CHECK (alert_severity IN ('low', 'medium', 'high', 'critical')),
  blue_team_response TEXT,
  blocked BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- DevSecOps Tables

-- DevSecOps scans
CREATE TABLE IF NOT EXISTS public.devsecops_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  scan_types TEXT[] NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('repository', 'container', 'infrastructure', 'pipeline')),
  target_identifier TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
  progress_percent INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  config JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- DevSecOps findings
CREATE TABLE IF NOT EXISTS public.devsecops_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID NOT NULL REFERENCES public.devsecops_scans(id) ON DELETE CASCADE,
  finding_type TEXT NOT NULL CHECK (finding_type IN ('vulnerability', 'secret', 'misconfiguration', 'code_smell', 'compliance')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  line_number INTEGER,
  cwe_id TEXT,
  cvss_score NUMERIC(3,1),
  exploit_available BOOLEAN DEFAULT false,
  remediation TEXT,
  code_snippet TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'triaged', 'false_positive', 'accepted', 'fixed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- DevSecOps SBOM
CREATE TABLE IF NOT EXISTS public.devsecops_sbom (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID NOT NULL REFERENCES public.devsecops_scans(id) ON DELETE CASCADE,
  format TEXT NOT NULL CHECK (format IN ('cyclonedx', 'spdx')),
  version TEXT NOT NULL,
  components JSONB NOT NULL DEFAULT '[]',
  dependencies JSONB DEFAULT '{}',
  vulnerabilities JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- DevSecOps pipelines
CREATE TABLE IF NOT EXISTS public.devsecops_pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  pipeline_yaml TEXT NOT NULL,
  triggers JSONB DEFAULT '[]',
  failure_threshold JSONB DEFAULT '{}',
  last_run_id UUID,
  enabled BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- DevSecOps pipeline runs
CREATE TABLE IF NOT EXISTS public.devsecops_pipeline_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID NOT NULL REFERENCES public.devsecops_pipelines(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'passed', 'failed', 'cancelled')),
  triggered_by TEXT,
  trigger_metadata JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  logs TEXT,
  scan_ids UUID[] DEFAULT '{}',
  findings_summary JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.apt_actor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apt_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apt_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apt_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apt_detection_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devsecops_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devsecops_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devsecops_sbom ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devsecops_pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devsecops_pipeline_runs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- APT Actor Profiles (public read)
CREATE POLICY "Anyone can view actor profiles" ON public.apt_actor_profiles FOR SELECT USING (true);
CREATE POLICY "Hypervisor can manage actor profiles" ON public.apt_actor_profiles FOR ALL USING (has_role(auth.uid(), 'HYPERVISOR'));

-- APT Scenarios
CREATE POLICY "Users can view tenant scenarios" ON public.apt_scenarios FOR SELECT 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.tenant_id = apt_scenarios.tenant_id AND profiles.id = auth.uid()));
CREATE POLICY "Admins can manage scenarios" ON public.apt_scenarios FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles JOIN user_roles ON user_roles.user_id = profiles.id 
    WHERE profiles.tenant_id = apt_scenarios.tenant_id AND profiles.id = auth.uid() 
    AND user_roles.role IN ('ADMIN', 'OPS')));
CREATE POLICY "Hypervisor can manage all scenarios" ON public.apt_scenarios FOR ALL USING (has_role(auth.uid(), 'HYPERVISOR'));

-- APT Runs
CREATE POLICY "Users can view tenant runs" ON public.apt_runs FOR SELECT 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.tenant_id = apt_runs.tenant_id AND profiles.id = auth.uid()));
CREATE POLICY "Admins can manage runs" ON public.apt_runs FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles JOIN user_roles ON user_roles.user_id = profiles.id 
    WHERE profiles.tenant_id = apt_runs.tenant_id AND profiles.id = auth.uid() 
    AND user_roles.role IN ('ADMIN', 'OPS')));
CREATE POLICY "Hypervisor can manage all runs" ON public.apt_runs FOR ALL USING (has_role(auth.uid(), 'HYPERVISOR'));

-- APT Events
CREATE POLICY "Users can view tenant events" ON public.apt_events FOR SELECT 
  USING (EXISTS (SELECT 1 FROM apt_runs JOIN profiles ON profiles.tenant_id = apt_runs.tenant_id 
    WHERE apt_runs.id = apt_events.run_id AND profiles.id = auth.uid()));
CREATE POLICY "System can insert events" ON public.apt_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Hypervisor can manage events" ON public.apt_events FOR ALL USING (has_role(auth.uid(), 'HYPERVISOR'));

-- APT Detection Logs
CREATE POLICY "Users can view tenant detection logs" ON public.apt_detection_logs FOR SELECT 
  USING (EXISTS (SELECT 1 FROM apt_runs JOIN profiles ON profiles.tenant_id = apt_runs.tenant_id 
    WHERE apt_runs.id = apt_detection_logs.run_id AND profiles.id = auth.uid()));
CREATE POLICY "System can insert detection logs" ON public.apt_detection_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Hypervisor can manage detection logs" ON public.apt_detection_logs FOR ALL USING (has_role(auth.uid(), 'HYPERVISOR'));

-- DevSecOps Scans
CREATE POLICY "Users can view tenant scans" ON public.devsecops_scans FOR SELECT 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.tenant_id = devsecops_scans.tenant_id AND profiles.id = auth.uid()));
CREATE POLICY "Admins can manage scans" ON public.devsecops_scans FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles JOIN user_roles ON user_roles.user_id = profiles.id 
    WHERE profiles.tenant_id = devsecops_scans.tenant_id AND profiles.id = auth.uid() 
    AND user_roles.role IN ('ADMIN', 'OPS')));
CREATE POLICY "Hypervisor can manage all scans" ON public.devsecops_scans FOR ALL USING (has_role(auth.uid(), 'HYPERVISOR'));

-- DevSecOps Findings
CREATE POLICY "Users can view tenant findings" ON public.devsecops_findings FOR SELECT 
  USING (EXISTS (SELECT 1 FROM devsecops_scans JOIN profiles ON profiles.tenant_id = devsecops_scans.tenant_id 
    WHERE devsecops_scans.id = devsecops_findings.scan_id AND profiles.id = auth.uid()));
CREATE POLICY "Admins can manage findings" ON public.devsecops_findings FOR ALL 
  USING (EXISTS (SELECT 1 FROM devsecops_scans JOIN profiles ON profiles.tenant_id = devsecops_scans.tenant_id 
    JOIN user_roles ON user_roles.user_id = profiles.id 
    WHERE devsecops_scans.id = devsecops_findings.scan_id AND profiles.id = auth.uid() 
    AND user_roles.role IN ('ADMIN', 'OPS')));
CREATE POLICY "Hypervisor can manage all findings" ON public.devsecops_findings FOR ALL USING (has_role(auth.uid(), 'HYPERVISOR'));

-- DevSecOps SBOM
CREATE POLICY "Users can view tenant sbom" ON public.devsecops_sbom FOR SELECT 
  USING (EXISTS (SELECT 1 FROM devsecops_scans JOIN profiles ON profiles.tenant_id = devsecops_scans.tenant_id 
    WHERE devsecops_scans.id = devsecops_sbom.scan_id AND profiles.id = auth.uid()));
CREATE POLICY "System can insert sbom" ON public.devsecops_sbom FOR INSERT WITH CHECK (true);
CREATE POLICY "Hypervisor can manage sbom" ON public.devsecops_sbom FOR ALL USING (has_role(auth.uid(), 'HYPERVISOR'));

-- DevSecOps Pipelines
CREATE POLICY "Users can view tenant pipelines" ON public.devsecops_pipelines FOR SELECT 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.tenant_id = devsecops_pipelines.tenant_id AND profiles.id = auth.uid()));
CREATE POLICY "Admins can manage pipelines" ON public.devsecops_pipelines FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles JOIN user_roles ON user_roles.user_id = profiles.id 
    WHERE profiles.tenant_id = devsecops_pipelines.tenant_id AND profiles.id = auth.uid() 
    AND user_roles.role IN ('ADMIN', 'OPS')));
CREATE POLICY "Hypervisor can manage all pipelines" ON public.devsecops_pipelines FOR ALL USING (has_role(auth.uid(), 'HYPERVISOR'));

-- DevSecOps Pipeline Runs
CREATE POLICY "Users can view tenant pipeline runs" ON public.devsecops_pipeline_runs FOR SELECT 
  USING (EXISTS (SELECT 1 FROM devsecops_pipelines JOIN profiles ON profiles.tenant_id = devsecops_pipelines.tenant_id 
    WHERE devsecops_pipelines.id = devsecops_pipeline_runs.pipeline_id AND profiles.id = auth.uid()));
CREATE POLICY "System can insert pipeline runs" ON public.devsecops_pipeline_runs FOR INSERT WITH CHECK (true);
CREATE POLICY "Hypervisor can manage pipeline runs" ON public.devsecops_pipeline_runs FOR ALL USING (has_role(auth.uid(), 'HYPERVISOR'));

-- Triggers
CREATE TRIGGER update_apt_scenarios_updated_at BEFORE UPDATE ON public.apt_scenarios 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_devsecops_scans_updated_at BEFORE UPDATE ON public.devsecops_scans 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_devsecops_pipelines_updated_at BEFORE UPDATE ON public.devsecops_pipelines 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed threat actor profiles
INSERT INTO public.apt_actor_profiles (id, name, aliases, origin_country, motivation, sophistication_level, primary_targets, common_ttps) VALUES
  ('11111111-1111-1111-1111-111111111111', 'APT28', ARRAY['Fancy Bear', 'Sofacy', 'Sednit'], 'Russia', 'Espionage', 'nation_state', ARRAY['Government', 'Military', 'Defense contractors'], '{"spearphishing": true, "credential_harvesting": true, "zero_days": true}'),
  ('22222222-2222-2222-2222-222222222222', 'APT29', ARRAY['Cozy Bear', 'The Dukes'], 'Russia', 'Intelligence gathering', 'nation_state', ARRAY['Government', 'Think tanks', 'Healthcare'], '{"supply_chain": true, "living_off_land": true, "stealth": true}'),
  ('33333333-3333-3333-3333-333333333333', 'Lazarus Group', ARRAY['Hidden Cobra', 'Guardians of Peace'], 'North Korea', 'Financial gain + espionage', 'nation_state', ARRAY['Financial', 'Cryptocurrency', 'Defense'], '{"ransomware": true, "wiper_malware": true, "supply_chain": true}'),
  ('44444444-4444-4444-4444-444444444444', 'FIN7', ARRAY['Carbanak Group'], 'Unknown', 'Financial theft', 'high', ARRAY['Retail', 'Hospitality', 'Financial services'], '{"pos_malware": true, "phishing": true, "tool_development": true}'),
  ('55555555-5555-5555-5555-555555555555', 'REvil', ARRAY['Sodinokibi'], 'Russia', 'Ransomware-as-a-Service', 'high', ARRAY['Any profitable target'], '{"ransomware": true, "double_extortion": true, "supply_chain": true}'),
  ('66666666-6666-6666-6666-666666666666', 'Wizard Spider', ARRAY['Grim Spider'], 'Russia', 'Ransomware operations', 'high', ARRAY['Enterprise', 'Healthcare', 'Government'], '{"ryuk_ransomware": true, "trickbot": true, "emotet": true}')
ON CONFLICT (id) DO NOTHING;