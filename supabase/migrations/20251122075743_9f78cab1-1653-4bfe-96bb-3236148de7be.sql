-- Seed Essential Plans Only
INSERT INTO public.plans (id, name, tier, price_monthly, price_yearly, usdt_price_monthly, usdt_price_yearly, features, limits) VALUES
('10000000-0000-4000-8000-000000000001'::uuid, 'Free', 'FREE', 0, 0, 0, 0,
  '["1 Project", "Basic Architecture (10 nodes)", "3 AI Requests/month", "Community Support"]'::jsonb,
  '{"max_projects": 1, "max_architecture_nodes": 10, "max_risks": 5, "max_simulations": 0, "max_ai_requests": 3, "max_team_members": 1, "max_devsecops_scans": 1}'::jsonb),
('20000000-0000-4000-8000-000000000002'::uuid, 'Enterprise Plus', 'ENTERPRISE_PLUS', 0, 0, 0, 0,
  '["Unlimited Everything", "Full Global Access", "All Features", "Priority Support"]'::jsonb,
  '{"max_projects": -1, "max_architecture_nodes": -1, "max_risks": -1, "max_simulations": -1, "max_ai_requests": -1, "max_team_members": -1, "max_devsecops_scans": -1}'::jsonb),
('30000000-0000-4000-8000-000000000003'::uuid, 'Plus', 'PLUS', 49, 470, 49, 470,
  '["5 Projects", "50 Architecture Nodes", "100 AI Requests/month", "Email Support"]'::jsonb,
  '{"max_projects": 5, "max_architecture_nodes": 50, "max_risks": 20, "max_simulations": 5, "max_ai_requests": 100, "max_team_members": 5, "max_devsecops_scans": 10}'::jsonb),
('40000000-0000-4000-8000-000000000004'::uuid, 'Pro', 'PRO', 149, 1430, 149, 1430,
  '["Unlimited Projects", "500 Architecture Nodes", "1000 AI Requests/month", "Priority Support"]'::jsonb,
  '{"max_projects": -1, "max_architecture_nodes": 500, "max_risks": 100, "max_simulations": -1, "max_ai_requests": 1000, "max_team_members": 20, "max_devsecops_scans": -1}'::jsonb),
('50000000-0000-4000-8000-000000000005'::uuid, 'Enterprise', 'ENTERPRISE', 499, 4790, 499, 4790,
  '["Unlimited Everything", "Unlimited AI", "Dedicated Support", "Custom Integrations"]'::jsonb,
  '{"max_projects": -1, "max_architecture_nodes": -1, "max_risks": -1, "max_simulations": -1, "max_ai_requests": -1, "max_team_members": -1, "max_devsecops_scans": -1}'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, features = EXCLUDED.features, limits = EXCLUDED.limits;