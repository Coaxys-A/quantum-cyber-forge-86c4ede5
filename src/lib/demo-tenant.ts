import { DEMO_TENANT_ID, DEMO_RESTRICTED_FEATURES } from './config';

export { DEMO_TENANT_ID };
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
  return DEMO_RESTRICTED_FEATURES.includes(feature as any);
}
