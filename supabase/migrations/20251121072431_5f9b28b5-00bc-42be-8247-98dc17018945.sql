-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('PLATFORM_ADMIN', 'ADMIN', 'OPS', 'VIEWER', 'BILLING_OWNER');

-- Create module_status enum
CREATE TYPE public.module_status AS ENUM ('DRAFT', 'EXPERIMENTAL', 'CANARY', 'STABLE', 'DEPRECATED');

-- Create module_category enum
CREATE TYPE public.module_category AS ENUM ('INFRASTRUCTURE', 'SECURITY', 'NETWORK', 'DATA', 'APPLICATION');

-- Create stage_status enum
CREATE TYPE public.stage_status AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED');

-- Create task_status enum
CREATE TYPE public.task_status AS ENUM ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED');

-- Create task_priority enum
CREATE TYPE public.task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- Create risk_severity enum
CREATE TYPE public.risk_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- Create risk_status enum
CREATE TYPE public.risk_status AS ENUM ('IDENTIFIED', 'ASSESSING', 'MITIGATING', 'MONITORING', 'CLOSED');

-- Create control_status enum
CREATE TYPE public.control_status AS ENUM ('ACTIVE', 'INACTIVE', 'TESTING', 'FAILED');

-- Create simulation_scenario enum
CREATE TYPE public.simulation_scenario AS ENUM ('BREACH_DETECTION', 'INCIDENT_RESPONSE', 'COMPLIANCE_AUDIT', 'DISASTER_RECOVERY', 'PENETRATION_TEST');

-- Create simulation_status enum
CREATE TYPE public.simulation_status AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- Create component_type enum
CREATE TYPE public.component_type AS ENUM ('SERVICE', 'DATABASE', 'API', 'FRONTEND', 'BACKEND', 'NETWORK', 'STORAGE');

-- Create health_status enum
CREATE TYPE public.health_status AS ENUM ('HEALTHY', 'DEGRADED', 'DOWN', 'UNKNOWN');

-- Create plan_tier enum
CREATE TYPE public.plan_tier AS ENUM ('FREE', 'PLUS', 'PRO', 'ULTRA', 'ENTERPRISE');

-- Tenants table
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  UNIQUE(user_id, role, tenant_id)
);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Billing plans table
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  tier public.plan_tier NOT NULL,
  price_monthly INTEGER NOT NULL,
  price_yearly INTEGER NOT NULL,
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  usdt_price_monthly DECIMAL(10,2),
  usdt_price_yearly DECIMAL(10,2),
  features JSONB DEFAULT '[]'::jsonb,
  limits JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.plans(id) NOT NULL,
  billing_owner_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'active',
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,
  stripe_invoice_id TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Modules table
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  version TEXT DEFAULT '1.0.0',
  status public.module_status DEFAULT 'DRAFT',
  category public.module_category,
  repository_url TEXT,
  documentation_url TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tenant_id, slug)
);

-- Roadmap stages table
CREATE TABLE public.stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status public.stage_status DEFAULT 'PLANNED',
  order_index INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Roadmap tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  stage_id UUID REFERENCES public.stages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status public.task_status DEFAULT 'TODO',
  priority public.task_priority DEFAULT 'MEDIUM',
  assignee_id UUID REFERENCES auth.users(id),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Security risks table
CREATE TABLE public.risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  severity public.risk_severity NOT NULL,
  status public.risk_status DEFAULT 'IDENTIFIED',
  impact_score INTEGER CHECK (impact_score >= 0 AND impact_score <= 100),
  likelihood_score INTEGER CHECK (likelihood_score >= 0 AND likelihood_score <= 100),
  mitigation_plan TEXT,
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Security controls table
CREATE TABLE public.controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status public.control_status DEFAULT 'ACTIVE',
  effectiveness_score INTEGER CHECK (effectiveness_score >= 0 AND effectiveness_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Risk-Control mapping
CREATE TABLE public.control_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  control_id UUID REFERENCES public.controls(id) ON DELETE CASCADE NOT NULL,
  risk_id UUID REFERENCES public.risks(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(control_id, risk_id)
);

-- Security findings table
CREATE TABLE public.findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  severity public.risk_severity NOT NULL,
  status TEXT DEFAULT 'open',
  discovered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Simulations table
CREATE TABLE public.simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  scenario public.simulation_scenario NOT NULL,
  description TEXT,
  status public.simulation_status DEFAULT 'PENDING',
  config JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Simulation events table
CREATE TABLE public.simulation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  simulation_id UUID REFERENCES public.simulations(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Architecture components table
CREATE TABLE public.components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type public.component_type NOT NULL,
  description TEXT,
  health_status public.health_status DEFAULT 'UNKNOWN',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Component edges (connections)
CREATE TABLE public.component_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES public.components(id) ON DELETE CASCADE NOT NULL,
  target_id UUID REFERENCES public.components(id) ON DELETE CASCADE NOT NULL,
  label TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Documentation pages
CREATE TABLE public.doc_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  language TEXT DEFAULT 'en',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Blog posts
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.control_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doc_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'PLATFORM_ADMIN') OR public.has_role(auth.uid(), 'ADMIN'));

-- RLS Policies for plans (public read)
CREATE POLICY "Anyone can view plans" ON public.plans FOR SELECT USING (true);

-- RLS Policies for tenant-scoped data
CREATE POLICY "Users can view own tenant" ON public.tenants FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.tenant_id = tenants.id AND profiles.id = auth.uid())
);

CREATE POLICY "Users can view tenant subscriptions" ON public.subscriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.tenant_id = subscriptions.tenant_id AND profiles.id = auth.uid())
);

CREATE POLICY "Users can view tenant invoices" ON public.invoices FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.subscriptions
    JOIN public.profiles ON profiles.tenant_id = subscriptions.tenant_id
    WHERE subscriptions.id = invoices.subscription_id AND profiles.id = auth.uid()
  )
);

CREATE POLICY "Users can view tenant modules" ON public.modules FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.tenant_id = modules.tenant_id AND profiles.id = auth.uid())
);

CREATE POLICY "Admins can manage modules" ON public.modules FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    JOIN public.user_roles ON user_roles.user_id = profiles.id
    WHERE profiles.tenant_id = modules.tenant_id AND profiles.id = auth.uid()
    AND user_roles.role IN ('ADMIN', 'OPS')
  )
);

CREATE POLICY "Users can view tenant stages" ON public.stages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.tenant_id = stages.tenant_id AND profiles.id = auth.uid())
);

CREATE POLICY "Admins can manage stages" ON public.stages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    JOIN public.user_roles ON user_roles.user_id = profiles.id
    WHERE profiles.tenant_id = stages.tenant_id AND profiles.id = auth.uid()
    AND user_roles.role IN ('ADMIN', 'OPS')
  )
);

CREATE POLICY "Users can view tenant tasks" ON public.tasks FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.tenant_id = tasks.tenant_id AND profiles.id = auth.uid())
);

CREATE POLICY "Admins can manage tasks" ON public.tasks FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    JOIN public.user_roles ON user_roles.user_id = profiles.id
    WHERE profiles.tenant_id = tasks.tenant_id AND profiles.id = auth.uid()
    AND user_roles.role IN ('ADMIN', 'OPS')
  )
);

CREATE POLICY "Users can view tenant risks" ON public.risks FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.tenant_id = risks.tenant_id AND profiles.id = auth.uid())
);

CREATE POLICY "Admins can manage risks" ON public.risks FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    JOIN public.user_roles ON user_roles.user_id = profiles.id
    WHERE profiles.tenant_id = risks.tenant_id AND profiles.id = auth.uid()
    AND user_roles.role IN ('ADMIN', 'OPS')
  )
);

CREATE POLICY "Users can view tenant controls" ON public.controls FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.tenant_id = controls.tenant_id AND profiles.id = auth.uid())
);

CREATE POLICY "Admins can manage controls" ON public.controls FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    JOIN public.user_roles ON user_roles.user_id = profiles.id
    WHERE profiles.tenant_id = controls.tenant_id AND profiles.id = auth.uid()
    AND user_roles.role IN ('ADMIN', 'OPS')
  )
);

CREATE POLICY "Users can view control risks" ON public.control_risks FOR SELECT USING (true);
CREATE POLICY "Admins can manage control risks" ON public.control_risks FOR ALL USING (
  public.has_role(auth.uid(), 'ADMIN') OR public.has_role(auth.uid(), 'OPS')
);

CREATE POLICY "Users can view tenant findings" ON public.findings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.tenant_id = findings.tenant_id AND profiles.id = auth.uid())
);

CREATE POLICY "Admins can manage findings" ON public.findings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    JOIN public.user_roles ON user_roles.user_id = profiles.id
    WHERE profiles.tenant_id = findings.tenant_id AND profiles.id = auth.uid()
    AND user_roles.role IN ('ADMIN', 'OPS')
  )
);

CREATE POLICY "Users can view tenant simulations" ON public.simulations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.tenant_id = simulations.tenant_id AND profiles.id = auth.uid())
);

CREATE POLICY "Admins can manage simulations" ON public.simulations FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    JOIN public.user_roles ON user_roles.user_id = profiles.id
    WHERE profiles.tenant_id = simulations.tenant_id AND profiles.id = auth.uid()
    AND user_roles.role IN ('ADMIN', 'OPS')
  )
);

CREATE POLICY "Users can view simulation events" ON public.simulation_events FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.simulations
    JOIN public.profiles ON profiles.tenant_id = simulations.tenant_id
    WHERE simulations.id = simulation_events.simulation_id AND profiles.id = auth.uid()
  )
);

CREATE POLICY "Users can view tenant components" ON public.components FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.tenant_id = components.tenant_id AND profiles.id = auth.uid())
);

CREATE POLICY "Admins can manage components" ON public.components FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    JOIN public.user_roles ON user_roles.user_id = profiles.id
    WHERE profiles.tenant_id = components.tenant_id AND profiles.id = auth.uid()
    AND user_roles.role IN ('ADMIN', 'OPS')
  )
);

CREATE POLICY "Users can view component edges" ON public.component_edges FOR SELECT USING (true);
CREATE POLICY "Admins can manage component edges" ON public.component_edges FOR ALL USING (
  public.has_role(auth.uid(), 'ADMIN') OR public.has_role(auth.uid(), 'OPS')
);

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can create notifications" ON public.notifications FOR INSERT WITH CHECK (
  public.has_role(auth.uid(), 'ADMIN') OR public.has_role(auth.uid(), 'PLATFORM_ADMIN')
);

-- Doc pages are public
CREATE POLICY "Anyone can view doc pages" ON public.doc_pages FOR SELECT USING (true);
CREATE POLICY "Admins can manage doc pages" ON public.doc_pages FOR ALL USING (public.has_role(auth.uid(), 'ADMIN'));

-- Blog posts policies
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all blog posts" ON public.blog_posts FOR SELECT USING (public.has_role(auth.uid(), 'ADMIN'));
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL USING (public.has_role(auth.uid(), 'ADMIN'));

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_stages_updated_at BEFORE UPDATE ON public.stages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_risks_updated_at BEFORE UPDATE ON public.risks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_controls_updated_at BEFORE UPDATE ON public.controls FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_simulations_updated_at BEFORE UPDATE ON public.simulations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_components_updated_at BEFORE UPDATE ON public.components FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_doc_pages_updated_at BEFORE UPDATE ON public.doc_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes for performance
CREATE INDEX idx_profiles_tenant_id ON public.profiles(tenant_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_tenant_id ON public.user_roles(tenant_id);
CREATE INDEX idx_modules_tenant_id ON public.modules(tenant_id);
CREATE INDEX idx_modules_slug ON public.modules(slug);
CREATE INDEX idx_stages_tenant_id ON public.stages(tenant_id);
CREATE INDEX idx_tasks_tenant_id ON public.tasks(tenant_id);
CREATE INDEX idx_tasks_stage_id ON public.tasks(stage_id);
CREATE INDEX idx_risks_tenant_id ON public.risks(tenant_id);
CREATE INDEX idx_controls_tenant_id ON public.controls(tenant_id);
CREATE INDEX idx_findings_tenant_id ON public.findings(tenant_id);
CREATE INDEX idx_simulations_tenant_id ON public.simulations(tenant_id);
CREATE INDEX idx_simulation_events_simulation_id ON public.simulation_events(simulation_id);
CREATE INDEX idx_components_tenant_id ON public.components(tenant_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX idx_doc_pages_slug ON public.doc_pages(slug);