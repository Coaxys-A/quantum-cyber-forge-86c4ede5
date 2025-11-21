-- Step 2: Create hypervisor tenant, plan, and RLS policies

-- Create hypervisor tenant
INSERT INTO public.tenants (name, domain, settings)
VALUES (
  'Hyperion Hypervisor',
  'hypervisor.hyperionflux.com',
  '{"type": "HYPERVISOR_TENANT", "unlimited": true}'::jsonb
)
ON CONFLICT (domain) DO UPDATE SET
  name = EXCLUDED.name,
  settings = EXCLUDED.settings;

-- Create hypervisor plan using new ENTERPRISE_PLUS tier
INSERT INTO public.plans (name, tier, price_monthly, price_yearly, features, limits)
VALUES (
  'Hypervisor Enterprise Plus',
  'ENTERPRISE_PLUS',
  0,
  0,
  '["Unlimited Everything", "Full System Access", "Bypass All Restrictions", "Impersonation Rights", "Global Feature Control", "All AI Engines", "Priority Support", "Security Logging", "IP Fingerprinting", "2FA Ready"]'::jsonb,
  '{"unlimited": true, "bypass_rls": true, "bypass_rate_limits": true}'::jsonb
)
ON CONFLICT (name) DO UPDATE SET
  tier = EXCLUDED.tier,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits;

-- Add comprehensive RLS policies for HYPERVISOR role

-- Profiles
DROP POLICY IF EXISTS "Hypervisor can manage all profiles" ON public.profiles;
CREATE POLICY "Hypervisor can manage all profiles" ON public.profiles FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- User roles
DROP POLICY IF EXISTS "Hypervisor can manage all roles" ON public.user_roles;
CREATE POLICY "Hypervisor can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Tenants
DROP POLICY IF EXISTS "Hypervisor can manage all tenants" ON public.tenants;
CREATE POLICY "Hypervisor can manage all tenants" ON public.tenants FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Modules
DROP POLICY IF EXISTS "Hypervisor can manage all modules" ON public.modules;
CREATE POLICY "Hypervisor can manage all modules" ON public.modules FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Risks
DROP POLICY IF EXISTS "Hypervisor can manage all risks" ON public.risks;
CREATE POLICY "Hypervisor can manage all risks" ON public.risks FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Controls
DROP POLICY IF EXISTS "Hypervisor can manage all controls" ON public.controls;
CREATE POLICY "Hypervisor can manage all controls" ON public.controls FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Simulations
DROP POLICY IF EXISTS "Hypervisor can manage all simulations" ON public.simulations;
CREATE POLICY "Hypervisor can manage all simulations" ON public.simulations FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Simulation events
DROP POLICY IF EXISTS "Hypervisor can view all events" ON public.simulation_events;
CREATE POLICY "Hypervisor can view all events" ON public.simulation_events FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Components
DROP POLICY IF EXISTS "Hypervisor can manage all components" ON public.components;
CREATE POLICY "Hypervisor can manage all components" ON public.components FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Component edges
DROP POLICY IF EXISTS "Hypervisor can manage all edges" ON public.component_edges;
CREATE POLICY "Hypervisor can manage all edges" ON public.component_edges FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Control risks
DROP POLICY IF EXISTS "Hypervisor can manage control risks" ON public.control_risks;
CREATE POLICY "Hypervisor can manage control risks" ON public.control_risks FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Stages
DROP POLICY IF EXISTS "Hypervisor can manage all stages" ON public.stages;
CREATE POLICY "Hypervisor can manage all stages" ON public.stages FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Tasks
DROP POLICY IF EXISTS "Hypervisor can manage all tasks" ON public.tasks;
CREATE POLICY "Hypervisor can manage all tasks" ON public.tasks FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Findings
DROP POLICY IF EXISTS "Hypervisor can manage all findings" ON public.findings;
CREATE POLICY "Hypervisor can manage all findings" ON public.findings FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Subscriptions
DROP POLICY IF EXISTS "Hypervisor can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Hypervisor can manage subscriptions" ON public.subscriptions FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Invoices
DROP POLICY IF EXISTS "Hypervisor can view all invoices" ON public.invoices;
CREATE POLICY "Hypervisor can view all invoices" ON public.invoices FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Notifications
DROP POLICY IF EXISTS "Hypervisor can manage notifications" ON public.notifications;
CREATE POLICY "Hypervisor can manage notifications" ON public.notifications FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Audit logs
DROP POLICY IF EXISTS "Hypervisor can view audit logs" ON public.audit_logs;
CREATE POLICY "Hypervisor can view audit logs" ON public.audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Doc pages
DROP POLICY IF EXISTS "Hypervisor can manage docs" ON public.doc_pages;
CREATE POLICY "Hypervisor can manage docs" ON public.doc_pages FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Blog posts
DROP POLICY IF EXISTS "Hypervisor can manage blog" ON public.blog_posts;
CREATE POLICY "Hypervisor can manage blog" ON public.blog_posts FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Plans
DROP POLICY IF EXISTS "Hypervisor can manage plans" ON public.plans;
CREATE POLICY "Hypervisor can manage plans" ON public.plans FOR ALL USING (public.has_role(auth.uid(), 'HYPERVISOR'));

-- Helper function to check hypervisor status
CREATE OR REPLACE FUNCTION public.is_hypervisor(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'HYPERVISOR'
  )
$$;