/**
 * Hypervisor Account Creation Script
 * 
 * SECURITY NOTE: This script should be run once during initial setup.
 * The hypervisor account credentials should be stored securely and never hardcoded.
 * 
 * To create the hypervisor account:
 * 1. Sign up via the registration page with the designated hypervisor email
 * 2. Run this script in the Lovable Cloud backend console or via Supabase SQL editor
 * 3. Manually assign the HYPERVISOR role to the created user
 * 
 * DO NOT commit credentials to version control!
 */

import { supabase } from "@/integrations/supabase/client";

export interface HypervisorSetupResult {
  success: boolean;
  message: string;
  userId?: string;
  tenantId?: string;
}

/**
 * Assigns HYPERVISOR role to an existing user
 * This should be called after the user has signed up normally
 */
export async function assignHypervisorRole(
  userId: string
): Promise<HypervisorSetupResult> {
  try {
    // Get the hypervisor tenant
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("id")
      .eq("domain", "hypervisor.hyperionflux.com")
      .single();

    if (tenantError || !tenant) {
      return {
        success: false,
        message: "Hypervisor tenant not found. Run database migrations first.",
      };
    }

    // Update user profile to link to hypervisor tenant
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ tenant_id: tenant.id })
      .eq("id", userId);

    if (profileError) {
      return {
        success: false,
        message: `Failed to update profile: ${profileError.message}`,
      };
    }

    // Assign HYPERVISOR role via user_roles table
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: userId,
      role: "HYPERVISOR",
      tenant_id: tenant.id,
    });

    if (roleError) {
      return {
        success: false,
        message: `Failed to assign role: ${roleError.message}`,
      };
    }

    // Get the Enterprise Plus plan
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("id")
      .eq("tier", "ENTERPRISE_PLUS")
      .single();

    if (!planError && plan) {
      // Create subscription for the hypervisor tenant
      const { error: subError } = await supabase.from("subscriptions").insert({
        tenant_id: tenant.id,
        plan_id: plan.id,
        status: "active",
        billing_owner_id: userId,
      });

      if (subError) {
        console.warn("Failed to create subscription:", subError.message);
      }
    }

    return {
      success: true,
      message: "Hypervisor role assigned successfully",
      userId,
      tenantId: tenant.id,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Unexpected error: ${error.message}`,
    };
  }
}

/**
 * Checks if a user has HYPERVISOR role
 */
export async function isHypervisor(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "HYPERVISOR")
      .single();

    return !error && !!data;
  } catch {
    return false;
  }
}

/**
 * Gets hypervisor capabilities
 */
export async function getHypervisorCapabilities() {
  return {
    unlimited_access: true,
    bypass_rls: true,
    bypass_rate_limits: true,
    impersonation: true,
    global_feature_control: true,
    all_ai_engines: true,
    all_subdomains: [
      "app.hyperionflux.com",
      "dashboard.hyperionflux.com",
      "docs.hyperionflux.com",
      "blog.hyperionflux.com",
    ],
    features: [
      "Unlimited architecture nodes",
      "Unlimited risks, controls, simulations",
      "Unlimited team members",
      "All AI engines with maximum depth",
      "DevSecOps module",
      "APT Simulator (full depth)",
      "Multi-project environments",
      "SSO & identity features",
      "API Keys management",
      "System health monitoring",
      "Event-stream logs",
      "Global feature flags",
    ],
  };
}
