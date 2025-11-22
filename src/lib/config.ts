/**
 * Central Configuration for Hyperion-Flux
 * Single source of truth for all app-wide constants
 */

// ============= SYSTEM IDENTIFIERS =============
export const HYPERVISOR_EMAIL = 'arsam12sb@gmail.com';
export const HYPERVISOR_TENANT_ID = '00000000-0000-4000-8000-000000000001';
export const DEMO_TENANT_ID = 'd0000000-0000-4000-8000-000000000001';

// ============= PLAN IDS =============
export const PLAN_IDS = {
  FREE: '10000000-0000-4000-8000-000000000001',
  ENTERPRISE_PLUS: '20000000-0000-4000-8000-000000000002',
  PLUS: '30000000-0000-4000-8000-000000000003',
  PRO: '40000000-0000-4000-8000-000000000004',
  ENTERPRISE: '50000000-0000-4000-8000-000000000005',
} as const;

// ============= PLAN TIERS =============
export type PlanTier = 'FREE' | 'PLUS' | 'PRO' | 'ENTERPRISE' | 'ENTERPRISE_PLUS';

export const PLAN_LIMITS = {
  FREE: {
    max_projects: 1,
    max_architecture_nodes: 10,
    max_risks: 5,
    max_simulations: 0,
    max_ai_requests: 3,
    max_team_members: 1,
    max_devsecops_scans: 1,
  },
  PLUS: {
    max_projects: 5,
    max_architecture_nodes: 50,
    max_risks: 20,
    max_simulations: 5,
    max_ai_requests: 100,
    max_team_members: 5,
    max_devsecops_scans: 10,
  },
  PRO: {
    max_projects: -1,
    max_architecture_nodes: 500,
    max_risks: 100,
    max_simulations: -1,
    max_ai_requests: 1000,
    max_team_members: 20,
    max_devsecops_scans: -1,
  },
  ENTERPRISE: {
    max_projects: -1,
    max_architecture_nodes: -1,
    max_risks: -1,
    max_simulations: -1,
    max_ai_requests: -1,
    max_team_members: -1,
    max_devsecops_scans: -1,
  },
  ENTERPRISE_PLUS: {
    max_projects: -1,
    max_architecture_nodes: -1,
    max_risks: -1,
    max_simulations: -1,
    max_ai_requests: -1,
    max_team_members: -1,
    max_devsecops_scans: -1,
  },
} as const;

// ============= ROLES =============
export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  OPS: 'OPS',
  BILLING_OWNER: 'BILLING_OWNER',
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
  HYPERVISOR: 'HYPERVISOR',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// ============= USAGE TYPES =============
export const USAGE_TYPES = {
  AI_REQUEST: 'AI_REQUEST',
  APT_SIMULATION: 'APT_SIMULATION',
  DEVSECOPS_SCAN: 'DEVSECOPS_SCAN',
  PROJECT_CREATED: 'PROJECT_CREATED',
  ARCHITECTURE_NODE: 'ARCHITECTURE_NODE',
  RISK_CREATED: 'RISK_CREATED',
  CONTROL_CREATED: 'CONTROL_CREATED',
  MODULE_CREATED: 'MODULE_CREATED',
} as const;

export type UsageType = (typeof USAGE_TYPES)[keyof typeof USAGE_TYPES];

// ============= FEATURE FLAGS =============
export const FEATURES = {
  DEMO_MODE: 'demo_mode',
  GOOGLE_LOGIN: 'google_login',
  CRYPTO_PAYMENTS: 'crypto_payments',
  MFA: 'mfa',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  MARKETING_AI: 'marketing_ai',
  SEO_BRAIN: 'seo_brain',
  INFRASTRUCTURE_DASHBOARD: 'infrastructure_dashboard',
} as const;

// ============= DEMO RESTRICTIONS =============
export const DEMO_RESTRICTED_FEATURES = [
  'create_module',
  'create_risk',
  'create_simulation',
  'create_control',
  'delete_any',
  'update_any',
  'ai_deep_analysis',
  'export_data',
  'invite_team',
] as const;

// ============= SUPPORTED LANGUAGES =============
export const SUPPORTED_LANGUAGES = [
  'en', 'fa', 'ar', 'fr', 'de', 'es', 'pt-BR', 'ru', 'zh-CN', 'zh-TW',
  'ja', 'ko', 'hi', 'tr', 'it', 'nl', 'sv', 'no', 'da', 'fi',
  'pl', 'cs', 'he', 'th', 'id',
] as const;

export const RTL_LANGUAGES = ['fa', 'ar', 'he'] as const;

// ============= API ENDPOINTS =============
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  TENANTS: '/tenants',
  PLANS: '/plans',
  SUBSCRIPTIONS: '/subscriptions',
  MODULES: '/modules',
  RISKS: '/risks',
  CONTROLS: '/controls',
  SIMULATIONS: '/simulations',
  ARCHITECTURE: '/architecture',
  DEVSECOPS: '/devsecops',
  AI: '/ai',
  BILLING: '/billing',
  SEO: '/seo',
  MONITORING: '/monitoring',
} as const;

// ============= HELPER FUNCTIONS =============
export function isDemoTenant(tenantId?: string | null): boolean {
  return tenantId === DEMO_TENANT_ID;
}

export function isHypervisorTenant(tenantId?: string | null): boolean {
  return tenantId === HYPERVISOR_TENANT_ID;
}

export function isUnlimitedPlan(tier?: string | null): boolean {
  return tier === 'ENTERPRISE' || tier === 'ENTERPRISE_PLUS' || tier === 'PRO';
}

export function getPlanLimits(tier?: string | null) {
  if (!tier) return PLAN_LIMITS.FREE;
  return PLAN_LIMITS[tier as PlanTier] || PLAN_LIMITS.FREE;
}

export function isRTLLanguage(lang: string): boolean {
  return RTL_LANGUAGES.includes(lang as any);
}
