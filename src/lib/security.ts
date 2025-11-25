import { supabase } from '@/integrations/supabase/client';

/**
 * Security utilities for Hyperion-Flux
 */

// Device fingerprinting
export function getDeviceFingerprint(): string {
  const nav = navigator as any;
  const screen = window.screen;
  
  const fingerprint = [
    nav.userAgent,
    nav.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    !!window.localStorage,
    !!window.sessionStorage,
    !!window.indexedDB,
  ].join('|');

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(36);
}

// Get client IP (best effort)
export async function getClientIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
}

// Check for suspicious login patterns
export async function checkSuspiciousLogin(
  userId: string, 
  currentIP: string, 
  deviceFingerprint: string
): Promise<{
  suspicious: boolean;
  reason?: string;
}> {
  try {
    // Get recent successful logins
    const { data: recentLogins } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('action', 'login')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    if (!recentLogins || recentLogins.length === 0) {
      return { suspicious: false };
    }

    // Check for rapid login attempts from different locations
    const uniqueIPs = new Set(recentLogins.map(log => log.ip_address));
    if (uniqueIPs.size > 5) {
      return { 
        suspicious: true, 
        reason: 'Multiple login locations detected' 
      };
    }

    // Check for device change
    const recentDevices = new Set(recentLogins.map(log => {
      const details = log.details as Record<string, any>;
      return details?.device_fingerprint;
    }));
    
    if (recentDevices.size > 0 && !recentDevices.has(deviceFingerprint)) {
      return { 
        suspicious: true, 
        reason: 'New device detected' 
      };
    }

    return { suspicious: false };
  } catch (error) {
    console.error('Error checking suspicious login:', error);
    return { suspicious: false };
  }
}

// Log security event
export async function logSecurityEvent(
  userId: string,
  action: string,
  details: Record<string, any>
) {
  try {
    const ip = await getClientIP();
    const device = getDeviceFingerprint();

    await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      resource_type: 'security',
      ip_address: ip,
      user_agent: navigator.userAgent,
      details: {
        ...details,
        device_fingerprint: device,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

// Rate limiting check (client-side)
export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now();
  const storageKey = `rate_limit_${key}`;
  
  try {
    const stored = localStorage.getItem(storageKey);
    let attempts: number[] = stored ? JSON.parse(stored) : [];
    
    // Filter out old attempts
    attempts = attempts.filter(timestamp => now - timestamp < windowMs);
    
    if (attempts.length >= maxAttempts) {
      return false; // Rate limit exceeded
    }
    
    // Add current attempt
    attempts.push(now);
    localStorage.setItem(storageKey, JSON.stringify(attempts));
    
    return true;
  } catch {
    return true; // Fail open if storage is unavailable
  }
}

// Clear rate limit
export function clearRateLimit(key: string) {
  try {
    localStorage.removeItem(`rate_limit_${key}`);
  } catch {
    // Ignore errors
  }
}

// Check password strength
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length < 8) feedback.push('Password should be at least 8 characters');
  if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters');
  if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters');
  if (!/[0-9]/.test(password)) feedback.push('Add numbers');
  if (!/[^A-Za-z0-9]/.test(password)) feedback.push('Add special characters');

  return { score, feedback };
}
