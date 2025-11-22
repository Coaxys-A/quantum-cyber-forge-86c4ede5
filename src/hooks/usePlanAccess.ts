import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type PlanTier = 'FREE' | 'PLUS' | 'PRO' | 'ULTRA' | 'ENTERPRISE' | 'ENTERPRISE_PLUS';

export interface PlanLimits {
  modules: number;
  risks: number;
  simulations: number;
  aiRequests: number;
  teamMembers: number;
  projects: number;
}

export function usePlanAccess() {
  const { profile } = useAuth();
  const [planTier, setPlanTier] = useState<PlanTier>('FREE');
  const [limits, setLimits] = useState<PlanLimits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlanInfo();
  }, [profile?.tenant_id]);

  const loadPlanInfo = async () => {
    if (!profile?.tenant_id) {
      setLoading(false);
      return;
    }

    try {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan:plans(*)')
        .eq('tenant_id', profile.tenant_id)
        .eq('status', 'active')
        .single();

      if (subscription?.plan) {
        const plan = subscription.plan as any;
        setPlanTier(plan.tier);
        setLimits(plan.limits as PlanLimits);
      }
    } catch (error) {
      console.error('Failed to load plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasFeature = (feature: string): boolean => {
    const features: Record<string, PlanTier[]> = {
      'compliance': ['PRO', 'ULTRA', 'ENTERPRISE', 'ENTERPRISE_PLUS'],
      'devsecops': ['PRO', 'ULTRA', 'ENTERPRISE', 'ENTERPRISE_PLUS'],
      'apt_simulation': ['PRO', 'ULTRA', 'ENTERPRISE', 'ENTERPRISE_PLUS'],
      'ai_deep_analysis': ['PRO', 'ULTRA', 'ENTERPRISE', 'ENTERPRISE_PLUS'],
      'exports': ['PRO', 'ULTRA', 'ENTERPRISE', 'ENTERPRISE_PLUS'],
      'multi_project': ['ENTERPRISE', 'ENTERPRISE_PLUS'],
      'sso': ['ENTERPRISE', 'ENTERPRISE_PLUS'],
      'custom_domains': ['ENTERPRISE', 'ENTERPRISE_PLUS'],
      'hypervisor_access': ['ENTERPRISE_PLUS'],
    };

    return features[feature]?.includes(planTier) ?? false;
  };

  const canCreate = (resource: 'modules' | 'risks' | 'simulations' | 'projects', current: number): boolean => {
    if (planTier === 'ENTERPRISE_PLUS') return true;
    if (!limits) return false;
    
    return current < limits[resource];
  };

  return {
    planTier,
    limits,
    loading,
    hasFeature,
    canCreate,
    isEnterprise: ['ENTERPRISE', 'ENTERPRISE_PLUS'].includes(planTier),
    isHypervisor: planTier === 'ENTERPRISE_PLUS',
    isPro: ['PRO', 'ULTRA', 'ENTERPRISE', 'ENTERPRISE_PLUS'].includes(planTier),
  };
}
