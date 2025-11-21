# Hypervisor User Creation Instructions

## ⚠️ CRITICAL: Manual Auth User Creation Required

Since Supabase Auth users cannot be created via standard SQL, you must execute the following steps in the **Lovable Cloud Backend SQL Editor**.

---

## Step 1: Create the Auth User

Execute this SQL in the Lovable Cloud backend SQL editor:

```sql
-- Create the auth user directly
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(), -- This will be the user_id
  'authenticated',
  'authenticated',
  'arsam12sb@gmail.com',
  crypt('q7!="!r"#OQCj?m0Y8s~', gen_salt('bf')), -- Bcrypt password hash
  now(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NULL,
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Hypervisor Admin"}'::jsonb,
  FALSE,
  now(),
  now(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL,
  FALSE,
  NULL
)
RETURNING id;
```

**SAVE THE RETURNED USER ID** - you'll need it for Step 2.

---

## Step 2: Complete User Setup

After getting the user ID from Step 1, execute this SQL (replace `<USER_ID>` with the actual ID):

```sql
-- Set the user_id variable
DO $$
DECLARE
  v_user_id uuid := '<USER_ID>'; -- REPLACE THIS
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, tenant_id, preferred_language, status, created_at, updated_at)
  VALUES (
    v_user_id,
    'arsam12sb@gmail.com',
    '00000000-0000-0000-0000-000000000000',
    'en',
    'ACTIVE',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    tenant_id = EXCLUDED.tenant_id,
    preferred_language = EXCLUDED.preferred_language,
    status = EXCLUDED.status,
    updated_at = now();

  -- Assign HYPERVISOR role
  INSERT INTO public.user_roles (user_id, role, tenant_id)
  VALUES (
    v_user_id,
    'HYPERVISOR',
    '00000000-0000-0000-0000-000000000000'
  )
  ON CONFLICT (user_id, role) DO NOTHING;

  RAISE NOTICE 'Hypervisor user setup complete for user ID: %', v_user_id;
END $$;
```

---

## Step 3: Verify Setup

Execute this to verify everything is configured correctly:

```sql
-- Verify the hypervisor user
SELECT 
  u.id,
  u.email,
  p.tenant_id,
  p.status,
  ur.role,
  t.name as tenant_name,
  t.domain as tenant_domain,
  public.is_hypervisor(u.id) as has_hypervisor_role
FROM auth.users u
JOIN public.profiles p ON p.id = u.id
JOIN public.user_roles ur ON ur.user_id = u.id
JOIN public.tenants t ON t.id = p.tenant_id
WHERE u.email = 'arsam12sb@gmail.com';
```

This should return:
- ✅ `has_hypervisor_role`: TRUE
- ✅ `role`: HYPERVISOR
- ✅ `tenant_name`: Hyperion Hypervisor
- ✅ `status`: ACTIVE

---

## Step 4: Test Login

1. Navigate to the login page
2. Enter credentials:
   - Email: `arsam12sb@gmail.com`
   - Password: `q7!="!r"#OQCj?m0Y8s~`
3. Verify you have access to all features and bypass all RLS restrictions

---

## Alternative: Use Signup Flow

If you prefer not to manipulate auth.users directly, you can:

1. Sign up normally at `/app/register` with the email `arsam12sb@gmail.com`
2. Then run only Step 2 above to assign the role

---

## Security Notes

- ✅ The Hypervisor tenant is configured
- ✅ All RLS policies allow HYPERVISOR role to bypass restrictions
- ✅ The `is_hypervisor()` function is in place
- ✅ The user will have unlimited access to all tenants and features
- ⚠️ Keep these credentials secure - they provide complete system access
