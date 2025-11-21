-- Step 1: Add new enum values
-- Add HYPERVISOR role to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'HYPERVISOR';

-- Add ENTERPRISE_PLUS tier to plan_tier enum  
ALTER TYPE public.plan_tier ADD VALUE IF NOT EXISTS 'ENTERPRISE_PLUS';