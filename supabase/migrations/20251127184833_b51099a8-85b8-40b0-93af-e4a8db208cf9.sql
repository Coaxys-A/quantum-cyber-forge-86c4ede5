-- Fix RLS policies for rate_limits table

-- Enable RLS on rate_limits (if not already enabled)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only system/hypervisor can view rate limits
CREATE POLICY "Hypervisor can view rate limits" ON public.rate_limits
  FOR SELECT USING (has_role(auth.uid(), 'HYPERVISOR'));

-- System can insert/update rate limits (via functions)
CREATE POLICY "System can manage rate limits" ON public.rate_limits
  FOR ALL USING (true);
