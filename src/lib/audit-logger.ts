import { supabase } from '@/integrations/supabase/client';

interface AuditLogParams {
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, any>;
}

export async function logAudit({
  action,
  resourceType,
  resourceId,
  details,
}: AuditLogParams) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile?.tenant_id) return;

    await supabase.from('audit_logs').insert({
      tenant_id: profile.tenant_id,
      user_id: user.id,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details: details || {},
      ip_address: null, // Will be set by backend
      user_agent: navigator.userAgent,
    });
  } catch (error) {
    console.error('Failed to log audit:', error);
  }
}
