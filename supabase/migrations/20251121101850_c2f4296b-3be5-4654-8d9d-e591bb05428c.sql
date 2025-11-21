-- Fix RLS policies for control_risks table
DROP POLICY IF EXISTS "Admins can manage control risks" ON public.control_risks;
DROP POLICY IF EXISTS "Users can view control risks" ON public.control_risks;

CREATE POLICY "Admins can manage control risks"
ON public.control_risks
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.controls c
    JOIN public.profiles p ON p.tenant_id = c.tenant_id
    JOIN public.user_roles ur ON ur.user_id = p.id
    WHERE c.id = control_risks.control_id
    AND p.id = auth.uid()
    AND ur.role IN ('ADMIN', 'OPS')
  )
);

CREATE POLICY "Users can view control risks"
ON public.control_risks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.controls c
    JOIN public.profiles p ON p.tenant_id = c.tenant_id
    WHERE c.id = control_risks.control_id
    AND p.id = auth.uid()
  )
);

-- Fix RLS policies for component_edges table
DROP POLICY IF EXISTS "Admins can manage component edges" ON public.component_edges;
DROP POLICY IF EXISTS "Users can view component edges" ON public.component_edges;

CREATE POLICY "Admins can manage component edges"
ON public.component_edges
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.components c
    JOIN public.profiles p ON p.tenant_id = c.tenant_id
    JOIN public.user_roles ur ON ur.user_id = p.id
    WHERE c.id = component_edges.source_id
    AND p.id = auth.uid()
    AND ur.role IN ('ADMIN', 'OPS')
  )
);

CREATE POLICY "Users can view component edges"
ON public.component_edges
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.components c
    JOIN public.profiles p ON p.tenant_id = c.tenant_id
    WHERE c.id = component_edges.source_id
    AND p.id = auth.uid()
  )
);