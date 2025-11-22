import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { billingClient } from '@/lib/billing-client';

export interface PlanLimits {
  max_projects: number;
  max_architecture_nodes: number;
  max_risks: number;
  max_simulations: number;
  max_ai_requests: number;
  max_team_members: number;
}

export function usePlanLimits() {
  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => billingClient.getCurrentSubscription()
  });

  const { data: usage } = useQuery({
    queryKey: ['usage'],
    queryFn: () => billingClient.getUsageStats()
  });

  const limits = subscription?.plan?.limits as PlanLimits | undefined;
  const isHypervisor = subscription?.plan?.tier === 'ENTERPRISE_PLUS';

  const checkLimit = (resource: string): { allowed: boolean; used: number; limit: number } => {
    // Hypervisor has unlimited everything
    if (isHypervisor) {
      return { allowed: true, used: usage?.[resource] || 0, limit: -1 };
    }

    if (!limits) {
      return { allowed: false, used: 0, limit: 0 };
    }

    const limitKey = `max_${resource.toLowerCase()}` as keyof PlanLimits;
    const limit = limits[limitKey];
    const used = usage?.[resource.toUpperCase()] || 0;

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
    checkLimit,
    canCreate,
    getUsagePercentage
  };
}
