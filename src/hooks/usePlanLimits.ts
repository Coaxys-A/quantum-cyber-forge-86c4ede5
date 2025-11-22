import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PlanLimits {
  max_projects: number;
  max_architecture_nodes: number;
  max_risks: number;
  max_simulations: number;
  max_ai_requests: number;
  max_team_members: number;
}

export interface UsageStats {
  PROJECTS?: number;
  ARCHITECTURE_NODES?: number;
  RISKS?: number;
  SIMULATIONS?: number;
  AI_REQUESTS?: number;
  TEAM_MEMBERS?: number;
}

export function usePlanLimits() {
  const { profile, isHypervisor, planTier } = useAuth();

  const { data: subscription } = useQuery({
    queryKey: ['subscription', profile?.tenant_id],
    queryFn: async () => {
      if (!profile?.tenant_id) return null;
      
      const { data } = await supabase
        .from('subscriptions')
        .select(`
          *,
          plan:plans(*)
        `)
        .eq('tenant_id', profile.tenant_id)
        .eq('status', 'active')
        .maybeSingle();
      
      return data;
    },
    enabled: !!profile?.tenant_id && !isHypervisor
  });

  const { data: usage } = useQuery({
    queryKey: ['usage', profile?.tenant_id],
    queryFn: async () => {
      if (!profile?.tenant_id) return {};

      const { data } = await supabase
        .from('usage_events')
        .select('type')
        .eq('tenant_id', profile.tenant_id);

      if (!data) return {};

      // Aggregate usage by type
      const stats: UsageStats = {};
      data.forEach(event => {
        const key = event.type as keyof UsageStats;
        stats[key] = (stats[key] || 0) + 1;
      });

      return stats;
    },
    enabled: !!profile?.tenant_id
  });

  const limits = subscription?.plan?.limits as unknown as PlanLimits | undefined;

  const checkLimit = (resource: string): { allowed: boolean; used: number; limit: number } => {
    // Hypervisor has unlimited everything
    if (isHypervisor) {
      return { allowed: true, used: usage?.[resource as keyof UsageStats] || 0, limit: -1 };
    }

    if (!limits) {
      return { allowed: false, used: 0, limit: 0 };
    }

    const limitKey = `max_${resource.toLowerCase()}` as keyof PlanLimits;
    const limit = limits[limitKey];
    const used = usage?.[resource.toUpperCase() as keyof UsageStats] || 0;

    // -1 means unlimited
    if (limit === -1) {
      return { allowed: true, used, limit };
    }

    return {
      allowed: used < limit,
      used,
      limit
    };
  };

  const canCreate = (resource: string): boolean => {
    return checkLimit(resource).allowed;
  };

  const getUsagePercentage = (resource: string): number => {
    const { used, limit } = checkLimit(resource);
    if (limit === -1) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  return {
    limits,
    subscription,
    usage,
    isHypervisor,
    planTier,
    checkLimit,
    canCreate,
    getUsagePercentage
  };
}
