import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// HTML Email Template Generator
function generateEmailHTML(type: string, data: any): string {
  const baseStyle = `
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
    .logo { font-size: 32px; font-weight: bold; color: #ffffff; }
    .content { padding: 40px 30px; }
    .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .code { display: inline-block; padding: 16px 24px; background: #f3f4f6; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1f2937; margin: 20px 0; }
    .footer { padding: 30px; text-align: center; color: #6b7280; font-size: 14px; background: #f9fafb; }
    .security-info { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .alert { background: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; }
    @media (prefers-color-scheme: dark) {
      body { background: #111827; }
      .container { background: #1f2937; }
      .content { color: #e5e7eb; }
      .security-info { background: #374151; }
      .alert { background: #7f1d1d; color: #fecaca; }
      .footer { background: #111827; color: #9ca3af; }
    }
  `;

  switch (type) {
    case 'verify-email':
      return `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><style>${baseStyle}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🛡️ Hyperion-Flux</div>
            </div>
            <div class="content">
              <h1 style="color: #1f2937; margin: 0 0 20px 0;">Verify Your Email</h1>
              <p>Welcome to Hyperion-Flux! Please verify your email address to activate your account.</p>
              <div class="code">${data.token}</div>
              <p style="color: #6b7280; font-size: 14px;">This code expires in 24 hours</p>
              <div class="security-info">
                <strong>🔒 Security Information</strong><br>
                Device: ${data.device || 'Unknown'}<br>
                IP: ${data.ip || 'Unknown'}<br>
                Location: ${data.location || 'Unknown'}<br>
                Time: ${new Date().toLocaleString()}
              </div>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2024 Hyperion-Flux. Enterprise Security Platform.</p>
              <p>Need help? Contact <a href="mailto:support@hyperion-flux.com">support@hyperion-flux.com</a></p>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'reset-password':
      return `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><style>${baseStyle}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🛡️ Hyperion-Flux</div>
            </div>
            <div class="content">
              <h1 style="color: #1f2937; margin: 0 0 20px 0;">Reset Your Password</h1>
              <p>We received a request to reset your password. Use the code below:</p>
              <div class="code">${data.token}</div>
              <p style="color: #6b7280; font-size: 14px;">This code expires in 1 hour</p>
              <div class="security-info">
                <strong>🔒 Security Information</strong><br>
                Device: ${data.device || 'Unknown'}<br>
                IP: ${data.ip || 'Unknown'}<br>
                Location: ${data.location || 'Unknown'}<br>
                Time: ${new Date().toLocaleString()}
              </div>
              <div class="alert">
                <strong>⚠️ Security Alert</strong><br>
                If you didn't request this password reset, someone may be trying to access your account. Please secure your account immediately.
              </div>
            </div>
            <div class="footer">
              <p>© 2024 Hyperion-Flux. Enterprise Security Platform.</p>
              <p>Need help? Contact <a href="mailto:support@hyperion-flux.com">support@hyperion-flux.com</a></p>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'magic-link':
      return `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><style>${baseStyle}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🛡️ Hyperion-Flux</div>
            </div>
            <div class="content">
              <h1 style="color: #1f2937; margin: 0 0 20px 0;">Your Magic Link</h1>
              <p>Click the button below to sign in to your account:</p>
              <a href="${data.link}" class="button">Sign In to Hyperion-Flux</a>
              <p style="color: #6b7280; font-size: 14px;">This link expires in 15 minutes</p>
              <div class="security-info">
                <strong>🔒 Security Information</strong><br>
                Device: ${data.device || 'Unknown'}<br>
                IP: ${data.ip || 'Unknown'}<br>
                Time: ${new Date().toLocaleString()}
              </div>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2024 Hyperion-Flux. Enterprise Security Platform.</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'device-alert':
      return `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><style>${baseStyle}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🛡️ Hyperion-Flux</div>
            </div>
            <div class="content">
              <h1 style="color: #1f2937; margin: 0 0 20px 0;">New Device Login Detected</h1>
              <div class="alert">
                <strong>🔔 Security Alert</strong><br>
                A new device just logged into your account.
              </div>
              <div class="security-info">
                <strong>Login Details:</strong><br>
                Device: ${data.device || 'Unknown'}<br>
                IP Address: ${data.ip || 'Unknown'}<br>
                Location: ${data.location || 'Unknown'}<br>
                Time: ${new Date().toLocaleString()}<br>
                Browser: ${data.browser || 'Unknown'}
              </div>
              <p>If this was you, you can safely ignore this email.</p>
              <p>If you don't recognize this activity, <a href="${data.secureLink}" style="color: #ef4444; font-weight: 600;">secure your account immediately</a>.</p>
            </div>
            <div class="footer">
              <p>© 2024 Hyperion-Flux. Enterprise Security Platform.</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'billing-receipt':
      return `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><style>${baseStyle}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🛡️ Hyperion-Flux</div>
            </div>
            <div class="content">
              <h1 style="color: #1f2937; margin: 0 0 20px 0;">Payment Receipt</h1>
              <p>Thank you for your payment!</p>
              <div class="security-info">
                <strong>Receipt Details</strong><br>
                Invoice: #${data.invoice_id}<br>
                Amount: $${data.amount}<br>
                Plan: ${data.plan_name}<br>
                Billing Cycle: ${data.billing_cycle}<br>
                Date: ${new Date().toLocaleDateString()}<br>
                Status: ✅ Paid
              </div>
              <a href="${data.invoice_url}" class="button">Download Invoice</a>
              <p>Your subscription is now active and will renew on ${data.next_billing_date}.</p>
            </div>
            <div class="footer">
              <p>© 2024 Hyperion-Flux. Enterprise Security Platform.</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'subscription-expiry':
      return `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><style>${baseStyle}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🛡️ Hyperion-Flux</div>
            </div>
            <div class="content">
              <h1 style="color: #1f2937; margin: 0 0 20px 0;">Subscription Expiring Soon</h1>
              <div class="alert">
                <strong>⚠️ Action Required</strong><br>
                Your subscription will expire in ${data.days_remaining} days.
              </div>
              <p>Don't lose access to your enterprise security features!</p>
              <div class="security-info">
                <strong>Subscription Details</strong><br>
                Plan: ${data.plan_name}<br>
                Expires: ${data.expiry_date}<br>
                Status: Expiring Soon
              </div>
              <a href="${data.renewal_link}" class="button">Renew Subscription</a>
            </div>
            <div class="footer">
              <p>© 2024 Hyperion-Flux. Enterprise Security Platform.</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'apt-detection':
      return `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><style>${baseStyle}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🛡️ Hyperion-Flux</div>
            </div>
            <div class="content">
              <h1 style="color: #1f2937; margin: 0 0 20px 0;">🚨 APT Threat Detected</h1>
              <div class="alert">
                <strong>Critical Security Alert</strong><br>
                Advanced Persistent Threat detected in your environment.
              </div>
              <div class="security-info">
                <strong>Threat Details</strong><br>
                Actor: ${data.actor || 'Unknown'}<br>
                Technique: ${data.technique}<br>
                Severity: ${data.severity}<br>
                Time: ${new Date().toLocaleString()}<br>
                Stage: ${data.stage}
              </div>
              <p><strong>Recommended Actions:</strong></p>
              <ol style="margin: 0; padding-left: 20px;">
                <li>Review the full attack timeline immediately</li>
                <li>Isolate affected systems</li>
                <li>Activate incident response procedures</li>
                <li>Document all findings for forensics</li>
              </ol>
              <a href="${data.simulation_url}" class="button">View Full Report</a>
            </div>
            <div class="footer">
              <p>© 2024 Hyperion-Flux. Enterprise Security Platform.</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'devsecops-critical':
      return `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><style>${baseStyle}</style></head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🛡️ Hyperion-Flux</div>
            </div>
            <div class="content">
              <h1 style="color: #1f2937; margin: 0 0 20px 0;">🔍 Critical Security Finding</h1>
              <div class="alert">
                <strong>High Severity Vulnerability Detected</strong><br>
                DevSecOps scan found critical security issues.
              </div>
              <div class="security-info">
                <strong>Finding Details</strong><br>
                Type: ${data.finding_type}<br>
                Severity: ${data.severity}<br>
                CVSS Score: ${data.cvss_score || 'N/A'}<br>
                File: ${data.file_path || 'N/A'}<br>
                Scan: ${data.scan_name}
              </div>
              <p><strong>Description:</strong></p>
              <p>${data.description}</p>
              <p><strong>Remediation:</strong></p>
              <p>${data.remediation}</p>
              <a href="${data.scan_url}" class="button">View Full Scan Results</a>
            </div>
            <div class="footer">
              <p>© 2024 Hyperion-Flux. Enterprise Security Platform.</p>
            </div>
          </div>
        </body>
        </html>
      `;

    default:
      return `<html><body><p>Unknown email type</p></body></html>`;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { type, to, data } = await req.json();

    if (!type || !to) {
      throw new Error('Missing required fields: type, to');
    }

    // Rate limiting check
    const { count } = await supabaseClient
      .from('email_logs')
      .select('*', { count: 'exact', head: true })
      .eq('recipient', to)
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

    if (count && count > 10) {
      throw new Error('Rate limit exceeded. Maximum 10 emails per hour.');
    }

    const html = generateEmailHTML(type, data);

    // In production, integrate with actual email service (Resend, SendGrid, etc.)
    console.log('[EMAIL]', type, 'to', to);

    // Log email send
    await supabaseClient.from('email_logs').insert({
      recipient: to,
      type,
      status: 'sent',
      metadata: { data }
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error: any) {
    console.error('[EMAIL ERROR]', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
