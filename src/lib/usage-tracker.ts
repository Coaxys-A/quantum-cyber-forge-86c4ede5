import { supabase } from '@/integrations/supabase/client';

export type UsageType = 
  | 'AI_REQUEST'
  | 'APT_SIMULATION'
  | 'DEVSECOPS_SCAN'
  | 'PROJECT_CREATED'
  | 'ARCHITECTURE_NODE'
  | 'RISK_CREATED'
  | 'CONTROL_CREATED'
  | 'MODULE_CREATED';

interface UsageContext {
  tenantId: string;
  projectId?: string;
  planTier?: string;
  metadata?: Record<string, any>;
}

/**
 * Track usage event for billing and plan limit enforcement
 */
export async function trackUsage(
  type: UsageType,
  context: UsageContext,
  quantity: number = 1
): Promise<void> {
  try {
    const { error } = await supabase
      .from('usage_events')
      .insert({
        tenant_id: context.tenantId,
        type,
        quantity,
        metadata: {
          project_id: context.projectId,
          plan_tier: context.planTier,
          timestamp: new Date().toISOString(),
          ...context.metadata
        }
      });

    if (error) {
      console.error('[USAGE] Failed to track usage:', error);
    }
  } catch (err) {
    console.error('[USAGE] Exception tracking usage:', err);
  }
}

/**
 * Check if user can perform action based on plan limits
 */
export async function checkUsageLimit(
  tenantId: string,
  type: UsageType,
  planLimits?: Record<string, number>
): Promise<{ allowed: boolean; message?: string }> {
  if (!planLimits) {
    return { allowed: true };
  }

  try {
    // Count current usage
    const { count, error } = await supabase
      .from('usage_events')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('type', type);

    if (error) throw error;

    const limit = planLimits[type.toLowerCase()] || -1;
    
    if (limit === -1) {
      return { allowed: true };
    }

    const allowed = (count || 0) < limit;

    return {
      allowed,
      message: allowed ? undefined : `You've reached your plan limit for ${type}. Please upgrade to continue.`
    };
  } catch (err) {
    console.error('[USAGE] Error checking limit:', err);
    return { allowed: true }; // Fail open
  }
}
