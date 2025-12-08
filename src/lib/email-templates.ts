/**
 * Email Template Generator for Hyperion-Flux
 * Production-grade HTML email templates
 */

interface EmailTemplateData {
  recipientName?: string;
  code?: string;
  link?: string;
  expiresIn?: string;
  deviceInfo?: {
    browser: string;
    os: string;
    ip: string;
    location?: string;
  };
  amount?: string;
  planName?: string;
  invoiceNumber?: string;
  findingTitle?: string;
  findingSeverity?: string;
  simulationName?: string;
}

const baseStyles = `
  body { 
    margin: 0; 
    padding: 0; 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
    background-color: #0a0e14; 
    color: #e2e8f0;
  }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .card { background: linear-gradient(135deg, #0f1419 0%, #1a202c 100%); border-radius: 16px; padding: 40px; border: 1px solid #2d3748; }
  .header { text-align: center; margin-bottom: 32px; }
  .logo { width: 48px; height: 48px; margin-bottom: 16px; }
  .title { font-size: 24px; font-weight: 700; color: #00d4ff; margin: 0 0 8px 0; }
  .subtitle { font-size: 14px; color: #718096; margin: 0; }
  .content { margin-bottom: 32px; }
  .code-box { background: #1a202c; border: 2px solid #00d4ff; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
  .code { font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #00d4ff; font-family: monospace; }
  .timer { font-size: 14px; color: #f6ad55; margin-top: 12px; }
  .button { display: inline-block; background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%); color: #0a0e14 !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; }
  .button:hover { background: linear-gradient(135deg, #00b8e6 0%, #0088bb 100%); }
  .device-info { background: #1a202c; border-radius: 8px; padding: 16px; margin: 24px 0; }
  .device-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2d3748; }
  .device-row:last-child { border-bottom: none; }
  .device-label { color: #718096; font-size: 14px; }
  .device-value { color: #e2e8f0; font-size: 14px; font-weight: 500; }
  .alert-box { background: linear-gradient(135deg, #742a2a 0%, #4a1c1c 100%); border: 1px solid #c53030; border-radius: 12px; padding: 20px; margin: 24px 0; }
  .success-box { background: linear-gradient(135deg, #1a4731 0%, #0f2d1f 100%); border: 1px solid #38a169; border-radius: 12px; padding: 20px; margin: 24px 0; }
  .footer { text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #2d3748; }
  .footer-text { font-size: 12px; color: #718096; margin: 8px 0; }
  .footer-link { color: #00d4ff; text-decoration: none; }
  .severity-critical { color: #fc8181; background: rgba(252, 129, 129, 0.1); padding: 4px 12px; border-radius: 4px; font-weight: 600; }
  .severity-high { color: #f6ad55; background: rgba(246, 173, 85, 0.1); padding: 4px 12px; border-radius: 4px; font-weight: 600; }
  @media (prefers-color-scheme: light) {
    body { background-color: #f7fafc; color: #1a202c; }
    .card { background: #ffffff; border-color: #e2e8f0; }
    .code-box { background: #f7fafc; }
    .device-info { background: #f7fafc; }
    .device-row { border-color: #e2e8f0; }
  }
`;

const logoSvg = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="24" r="22" stroke="#00d4ff" stroke-width="2" fill="none"/>
  <path d="M24 10L30 18H18L24 10Z" fill="#00d4ff"/>
  <path d="M24 38L18 30H30L24 38Z" fill="#00d4ff"/>
  <circle cx="24" cy="24" r="6" fill="#00d4ff"/>
</svg>`;

export function generateVerificationEmail(data: EmailTemplateData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark light">
  <title>Verify Your Email - Hyperion-Flux</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        ${logoSvg}
        <h1 class="title">Verify Your Email</h1>
        <p class="subtitle">Welcome to Hyperion-Flux</p>
      </div>
      
      <div class="content">
        <p style="color: #a0aec0; line-height: 1.6;">
          Hello${data.recipientName ? ` ${data.recipientName}` : ''},
        </p>
        <p style="color: #a0aec0; line-height: 1.6;">
          Thank you for signing up for Hyperion-Flux. Please use the verification code below to complete your registration:
        </p>
        
        <div class="code-box">
          <div class="code">${data.code || '000000'}</div>
          <div class="timer">⏱️ Expires in ${data.expiresIn || '10 minutes'}</div>
        </div>
        
        <p style="color: #718096; font-size: 14px; text-align: center;">
          If you didn't request this code, you can safely ignore this email.
        </p>
      </div>
      
      <div class="footer">
        <p class="footer-text">
          This email was sent by Hyperion-Flux Security Platform
        </p>
        <p class="footer-text">
          <a href="https://hyperionflux.dev" class="footer-link">hyperionflux.dev</a> • 
          <a href="https://hyperionflux.dev/support" class="footer-link">Support</a> • 
          <a href="https://hyperionflux.dev/privacy" class="footer-link">Privacy</a>
        </p>
        <p class="footer-text">
          © ${new Date().getFullYear()} Hyperion-Flux. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function generatePasswordResetEmail(data: EmailTemplateData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark light">
  <title>Reset Your Password - Hyperion-Flux</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        ${logoSvg}
        <h1 class="title">Reset Your Password</h1>
        <p class="subtitle">Secure Account Recovery</p>
      </div>
      
      <div class="content">
        <p style="color: #a0aec0; line-height: 1.6;">
          Hello${data.recipientName ? ` ${data.recipientName}` : ''},
        </p>
        <p style="color: #a0aec0; line-height: 1.6;">
          We received a request to reset your password. Use the code below or click the button to create a new password:
        </p>
        
        <div class="code-box">
          <div class="code">${data.code || '000000'}</div>
          <div class="timer">⏱️ Expires in ${data.expiresIn || '15 minutes'}</div>
        </div>
        
        ${data.link ? `
        <div style="text-align: center; margin: 24px 0;">
          <a href="${data.link}" class="button">Reset Password</a>
        </div>
        ` : ''}
        
        ${data.deviceInfo ? `
        <div class="device-info">
          <p style="margin: 0 0 12px 0; font-weight: 600; color: #a0aec0;">Request Details:</p>
          <div class="device-row">
            <span class="device-label">Browser</span>
            <span class="device-value">${data.deviceInfo.browser}</span>
          </div>
          <div class="device-row">
            <span class="device-label">Operating System</span>
            <span class="device-value">${data.deviceInfo.os}</span>
          </div>
          <div class="device-row">
            <span class="device-label">IP Address</span>
            <span class="device-value">${data.deviceInfo.ip}</span>
          </div>
          ${data.deviceInfo.location ? `
          <div class="device-row">
            <span class="device-label">Location</span>
            <span class="device-value">${data.deviceInfo.location}</span>
          </div>
          ` : ''}
        </div>
        ` : ''}
        
        <p style="color: #718096; font-size: 14px;">
          If you didn't request a password reset, please ignore this email or contact support if you have concerns.
        </p>
      </div>
      
      <div class="footer">
        <p class="footer-text">
          This email was sent by Hyperion-Flux Security Platform
        </p>
        <p class="footer-text">
          <a href="https://hyperionflux.dev" class="footer-link">hyperionflux.dev</a> • 
          <a href="https://hyperionflux.dev/support" class="footer-link">Support</a>
        </p>
        <p class="footer-text">
          © ${new Date().getFullYear()} Hyperion-Flux. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function generateSuspiciousLoginEmail(data: EmailTemplateData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark light">
  <title>Security Alert - Hyperion-Flux</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        ${logoSvg}
        <h1 class="title" style="color: #fc8181;">⚠️ Security Alert</h1>
        <p class="subtitle">Unusual Login Activity Detected</p>
      </div>
      
      <div class="content">
        <p style="color: #a0aec0; line-height: 1.6;">
          Hello${data.recipientName ? ` ${data.recipientName}` : ''},
        </p>
        
        <div class="alert-box">
          <p style="margin: 0; color: #fc8181; font-weight: 600;">
            🔐 We detected a login to your account from an unfamiliar device or location.
          </p>
        </div>
        
        ${data.deviceInfo ? `
        <div class="device-info">
          <p style="margin: 0 0 12px 0; font-weight: 600; color: #a0aec0;">Login Details:</p>
          <div class="device-row">
            <span class="device-label">Browser</span>
            <span class="device-value">${data.deviceInfo.browser}</span>
          </div>
          <div class="device-row">
            <span class="device-label">Operating System</span>
            <span class="device-value">${data.deviceInfo.os}</span>
          </div>
          <div class="device-row">
            <span class="device-label">IP Address</span>
            <span class="device-value">${data.deviceInfo.ip}</span>
          </div>
          ${data.deviceInfo.location ? `
          <div class="device-row">
            <span class="device-label">Location</span>
            <span class="device-value">${data.deviceInfo.location}</span>
          </div>
          ` : ''}
          <div class="device-row">
            <span class="device-label">Time</span>
            <span class="device-value">${new Date().toLocaleString()}</span>
          </div>
        </div>
        ` : ''}
        
        <p style="color: #a0aec0; line-height: 1.6;">
          <strong>If this was you:</strong> No action is needed. You can safely ignore this email.
        </p>
        <p style="color: #a0aec0; line-height: 1.6;">
          <strong>If this wasn't you:</strong> We recommend you change your password immediately and enable two-factor authentication.
        </p>
        
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://hyperionflux.dev/app/settings/security" class="button">Review Security Settings</a>
        </div>
      </div>
      
      <div class="footer">
        <p class="footer-text">
          This security alert was sent by Hyperion-Flux
        </p>
        <p class="footer-text">
          <a href="https://hyperionflux.dev/support" class="footer-link">Contact Support</a>
        </p>
        <p class="footer-text">
          © ${new Date().getFullYear()} Hyperion-Flux. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function generateBillingReceiptEmail(data: EmailTemplateData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark light">
  <title>Payment Receipt - Hyperion-Flux</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        ${logoSvg}
        <h1 class="title">Payment Received</h1>
        <p class="subtitle">Thank you for your payment</p>
      </div>
      
      <div class="content">
        <p style="color: #a0aec0; line-height: 1.6;">
          Hello${data.recipientName ? ` ${data.recipientName}` : ''},
        </p>
        
        <div class="success-box">
          <p style="margin: 0; color: #68d391; font-weight: 600;">
            ✓ Your payment has been successfully processed
          </p>
        </div>
        
        <div class="device-info">
          <div class="device-row">
            <span class="device-label">Plan</span>
            <span class="device-value">${data.planName || 'Pro Plan'}</span>
          </div>
          <div class="device-row">
            <span class="device-label">Amount</span>
            <span class="device-value" style="color: #68d391; font-weight: 600;">${data.amount || '$0.00'}</span>
          </div>
          <div class="device-row">
            <span class="device-label">Invoice Number</span>
            <span class="device-value">${data.invoiceNumber || 'INV-000000'}</span>
          </div>
          <div class="device-row">
            <span class="device-label">Date</span>
            <span class="device-value">${new Date().toLocaleDateString()}</span>
          </div>
        </div>
        
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://hyperionflux.dev/app/billing" class="button">View Invoice</a>
        </div>
        
        <p style="color: #718096; font-size: 14px;">
          This receipt serves as confirmation of your payment. Please keep it for your records.
        </p>
      </div>
      
      <div class="footer">
        <p class="footer-text">
          Questions about your bill? <a href="https://hyperionflux.dev/support" class="footer-link">Contact Support</a>
        </p>
        <p class="footer-text">
          © ${new Date().getFullYear()} Hyperion-Flux. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function generateSecurityFindingAlertEmail(data: EmailTemplateData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark light">
  <title>Security Finding Alert - Hyperion-Flux</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        ${logoSvg}
        <h1 class="title">🔍 Security Finding Detected</h1>
        <p class="subtitle">DevSecOps Scan Results</p>
      </div>
      
      <div class="content">
        <p style="color: #a0aec0; line-height: 1.6;">
          Hello${data.recipientName ? ` ${data.recipientName}` : ''},
        </p>
        <p style="color: #a0aec0; line-height: 1.6;">
          A security scan has detected a finding that requires your attention:
        </p>
        
        <div class="alert-box">
          <p style="margin: 0 0 8px 0; color: #e2e8f0; font-weight: 600; font-size: 18px;">
            ${data.findingTitle || 'Security Vulnerability'}
          </p>
          <span class="severity-${(data.findingSeverity || 'high').toLowerCase()}">
            ${(data.findingSeverity || 'HIGH').toUpperCase()}
          </span>
        </div>
        
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://hyperionflux.dev/app/devsecops" class="button">View Finding Details</a>
        </div>
        
        <p style="color: #718096; font-size: 14px;">
          We recommend addressing this finding as soon as possible to maintain your security posture.
        </p>
      </div>
      
      <div class="footer">
        <p class="footer-text">
          This alert was generated by Hyperion-Flux DevSecOps Engine
        </p>
        <p class="footer-text">
          © ${new Date().getFullYear()} Hyperion-Flux. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function generateAPTAlertEmail(data: EmailTemplateData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark light">
  <title>APT Simulation Alert - Hyperion-Flux</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        ${logoSvg}
        <h1 class="title">🎯 APT Simulation Complete</h1>
        <p class="subtitle">Attack Simulation Results</p>
      </div>
      
      <div class="content">
        <p style="color: #a0aec0; line-height: 1.6;">
          Hello${data.recipientName ? ` ${data.recipientName}` : ''},
        </p>
        <p style="color: #a0aec0; line-height: 1.6;">
          Your APT simulation has completed. Here's a summary:
        </p>
        
        <div class="device-info">
          <div class="device-row">
            <span class="device-label">Simulation</span>
            <span class="device-value">${data.simulationName || 'APT Simulation'}</span>
          </div>
          <div class="device-row">
            <span class="device-label">Status</span>
            <span class="device-value" style="color: #68d391;">Completed</span>
          </div>
          <div class="device-row">
            <span class="device-label">Completed At</span>
            <span class="device-value">${new Date().toLocaleString()}</span>
          </div>
        </div>
        
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://hyperionflux.dev/app/simulations" class="button">View Full Report</a>
        </div>
      </div>
      
      <div class="footer">
        <p class="footer-text">
          This alert was generated by Hyperion-Flux APT Simulator
        </p>
        <p class="footer-text">
          © ${new Date().getFullYear()} Hyperion-Flux. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
