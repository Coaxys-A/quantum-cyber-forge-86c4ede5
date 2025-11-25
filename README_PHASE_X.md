# Hyperion-Flux - Phase X Activation

## Quick Start Guide

### Prerequisites
- Node.js 18+ installed
- Supabase project connected
- Resend API key (for emails)

### Setup Instructions

#### 1. Email Configuration
```bash
# Add Resend API key to Supabase secrets
RESEND_API_KEY=your_resend_api_key_here
SEND_EMAIL_HOOK_SECRET=your_webhook_secret_here
```

#### 2. Supabase Auth Configuration
Configure email templates in Supabase Auth settings:
- Go to Authentication → Email Templates
- Set up webhook for custom email templates
- Point to: `https://your-project.supabase.co/functions/v1/send-email`

#### 3. Demo Mode Setup
Demo mode is automatically enabled when:
- User tenant_id matches DEMO_TENANT_ID
- Or localStorage item 'demo_mode' === 'true'

No additional setup required.

#### 4. Security Configuration
All security features are automatically enabled:
- Device fingerprinting (automatic)
- Rate limiting (client-side)
- Audit logging (automatic)
- Suspicious login detection (automatic)

### Features Overview

#### 🔐 Authentication & Security
- Email verification with custom templates
- Password reset flow
- Device fingerprinting
- Suspicious login detection
- Rate limiting
- Audit logging

#### 📊 Dashboard
- Real-time statistics
- Recent activity feed
- System health monitoring
- Quick actions
- Demo mode indicator

#### 💳 Billing & Usage
- Plan limit enforcement
- Usage tracking
- Upgrade prompts
- Stripe integration
- Crypto payment support

#### 👥 User Management
- Onboarding flow
- Profile management
- Tenant/organization setup
- Role-based access control

### API Endpoints

#### Edge Functions
- `/functions/v1/send-email` - Email delivery
- `/functions/v1/stripe-webhook` - Stripe webhooks
- `/functions/v1/crypto-payment` - Crypto payments
- `/functions/v1/apt-run` - APT simulations
- `/functions/v1/devsecops-scan` - Security scans

### Usage Examples

#### Check Usage Limits
```typescript
import { checkUsageLimit, showUpgradePrompt } from '@/lib/usage-enforcement';

const result = await checkUsageLimit(tenantId, 'AI_REQUEST', planLimits);
if (!result.allowed) {
  showUpgradePrompt('AI_REQUEST', result.current, result.limit);
  return;
}
// Proceed with action...
```

#### Track Usage
```typescript
import { trackUsage } from '@/lib/usage-enforcement';

await trackUsage(tenantId, 'AI_REQUEST', {
  model: 'gpt-4',
  tokens: 1500
});
```

#### Check Rate Limit
```typescript
import { useRateLimiting } from '@/hooks/useRateLimiting';

const { checkLimit } = useRateLimiting();

if (!checkLimit('login_attempts', {
  maxAttempts: 5,
  windowMs: 60000,
  message: 'Too many login attempts'
})) {
  return; // Rate limit exceeded
}
```

#### Log Security Event
```typescript
import { logSecurityEvent } from '@/lib/security';

await logSecurityEvent(userId, 'password_change', {
  reason: 'user_initiated',
  success: true
});
```

### Environment Variables

Required environment variables are automatically configured by Lovable Cloud:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon key
- `VITE_SUPABASE_PROJECT_ID` - Supabase project ID

### Deployment

The application is automatically deployed when you push changes. All edge functions are deployed automatically.

#### Production Checklist
- [ ] Configure Resend API key
- [ ] Set up email webhook in Supabase
- [ ] Test email verification flow
- [ ] Verify security logging works
- [ ] Check rate limiting functionality
- [ ] Test demo mode
- [ ] Verify usage tracking
- [ ] Test onboarding flow
- [ ] Check all loading states
- [ ] Verify error handling

### Monitoring

#### Security Logs
View security events in the `audit_logs` table:
```sql
SELECT * FROM audit_logs 
WHERE action IN ('login', 'suspicious_login', 'password_change')
ORDER BY created_at DESC;
```

#### Usage Statistics
View usage stats in the `usage_events` table:
```sql
SELECT type, COUNT(*) as count, SUM(quantity) as total
FROM usage_events
WHERE tenant_id = 'your-tenant-id'
GROUP BY type;
```

### Troubleshooting

#### Emails Not Sending
1. Check Resend API key is set
2. Verify webhook is configured in Supabase Auth
3. Check edge function logs
4. Verify email templates are deployed

#### Security Logs Not Working
1. Check audit_logs table exists
2. Verify RLS policies allow inserts
3. Check user is authenticated
4. Review browser console for errors

#### Rate Limiting Not Working
1. Check localStorage is available
2. Verify rate limit key is unique
3. Review browser console for errors
4. Test with different limits

### Support

For issues or questions:
- Check `PHASE_X_COMPLETION.md` for detailed documentation
- Review edge function logs in Supabase dashboard
- Check browser console for client-side errors
- Review audit logs for security events

### License

Proprietary - All Rights Reserved
