-- Create hypervisor tenant if not exists
INSERT INTO public.tenants (id, name, domain, settings, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Hypervisor Platform',
  'hypervisor.hyperionflux.dev',
  '{"type": "hypervisor", "unlimited": true}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Create Enterprise Plus plan if not exists
INSERT INTO public.plans (id, name, tier, price_monthly, price_yearly, usdt_price_monthly, usdt_price_yearly, features, limits, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  'Enterprise Plus (Hypervisor)',
  'ENTERPRISE_PLUS',
  0,
  0,
  0,
  0,
  '["Unlimited everything", "All AI engines", "Global access", "Impersonation", "System administration"]'::jsonb,
  '{"modules": -1, "risks": -1, "simulations": -1, "aiRequests": -1, "teamMembers": -1, "projects": -1}'::jsonb,
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Create function to auto-setup hypervisor on first login
CREATE OR REPLACE FUNCTION public.setup_hypervisor_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  hypervisor_tenant_id UUID := '00000000-0000-0000-0000-000000000001';
  enterprise_plus_plan_id UUID := '00000000-0000-0000-0000-000000000002';
BEGIN
  -- Check if this is the hypervisor email
  IF NEW.email = 'arsam12sb@gmail.com' THEN
    -- Update profile with hypervisor tenant
    UPDATE public.profiles
    SET tenant_id = hypervisor_tenant_id
    WHERE id = NEW.id;
    
    -- Assign HYPERVISOR role
    INSERT INTO public.user_roles (user_id, role, tenant_id)
    VALUES (NEW.id, 'HYPERVISOR', hypervisor_tenant_id)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Create subscription for hypervisor tenant if doesn't exist
    INSERT INTO public.subscriptions (tenant_id, plan_id, status, billing_owner_id)
    VALUES (hypervisor_tenant_id, enterprise_plus_plan_id, 'active', NEW.id)
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on profile creation
DROP TRIGGER IF EXISTS setup_hypervisor_on_profile_creation ON public.profiles;
CREATE TRIGGER setup_hypervisor_on_profile_creation
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.setup_hypervisor_user();