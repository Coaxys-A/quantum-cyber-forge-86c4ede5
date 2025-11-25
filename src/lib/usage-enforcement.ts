import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UsageCheck {
  allowed: boolean;
  message?: string;
  current?: number;
  limit?: number;
}

/**
 * Check if user can perform an action based on plan limits
 */
export async function checkUsageLimit(
  tenantId: string,
  feature: string,
  planLimits?: Record<string, number>
): Promise<UsageCheck> {
  if (!planLimits) {
    return { allowed: true };
  }

  const limit = planLimits[feature];
  
  // -1 means unlimited
  if (limit === -1 || limit === undefined) {
    return { allowed: true };
  }

  try {
    // Count current usage
    const { count, error } = await supabase
      .from('usage_events')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('type', feature);

    if (error) throw error;

    const current = count || 0;
    const allowed = current < limit;

    return {
      allowed,
      current,
      limit,
      message: allowed 
        ? undefined 
        : `You've reached your plan limit (${current}/${limit}). Please upgrade to continue.`
    };
  } catch (error) {
    console.error('Error checking usage limit:', error);
    // Fail open - allow action if check fails
    return { allowed: true };
  }
}

/**
 * Track usage event
 */
export async function trackUsage(
  tenantId: string,
  type: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('usage_events')
      .insert({
        tenant_id: tenantId,
        type,
        quantity: 1,
        metadata: metadata || {}
      });

    if (error) {
      console.error('Failed to track usage:', error);
    }
  } catch (error) {
    console.error('Exception tracking usage:', error);
  }
}

/**
 * Show upgrade prompt when limit is reached
 */
export function showUpgradePrompt(feature: string, current?: number, limit?: number) {
  toast.error('Plan Limit Reached', {
    description: current && limit 
      ? `You've used ${current}/${limit} ${feature}. Upgrade to continue.`
      : `You've reached your plan limit for ${feature}.`,
    action: {
      label: 'Upgrade Plan',
      onClick: () => {
        window.location.href = '/app/billing';
      }
    },
    duration: 10000,
  });
}
