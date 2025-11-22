export const DEMO_TENANT_ID = 'demo-tenant-00000000-0000-0000-0000-000000000000';
export const DEMO_USER_EMAIL = 'demo@hyperionflux.dev';

export function isDemoMode(): boolean {
  return localStorage.getItem('demo_mode') === 'true';
}

export function enableDemoMode() {
  localStorage.setItem('demo_mode', 'true');
}

export function disableDemoMode() {
  localStorage.removeItem('demo_mode');
}

export function isDemoTenant(tenantId?: string): boolean {
  return tenantId === DEMO_TENANT_ID || isDemoMode();
}

export function requiresUpgrade(feature: string): boolean {
  if (!isDemoMode()) return false;
  
  const restrictedFeatures = [
    'create_module',
    'create_risk',
    'create_simulation',
    'create_control',
    'delete_any',
    'update_any',
    'ai_deep_analysis',
    'export_data',
    'invite_team',
  ];
  
  return restrictedFeatures.includes(feature);
}
