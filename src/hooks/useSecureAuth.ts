import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDeviceFingerprint, getClientIP, checkSuspiciousLogin, logSecurityEvent } from '@/lib/security';
import { toast } from 'sonner';

/**
 * Enhanced authentication hook with security features
 */
export function useSecureAuth() {
  const auth = useAuth();

  useEffect(() => {
    if (auth.user) {
      // Log successful login with device fingerprint
      const logLogin = async () => {
        try {
          const ip = await getClientIP();
          const device = getDeviceFingerprint();

          // Check for suspicious activity
          const { suspicious, reason } = await checkSuspiciousLogin(
            auth.user!.id,
            ip,
            device
          );

          if (suspicious) {
            toast.warning('Unusual Login Detected', {
              description: reason || 'We detected an unusual login. Please verify your account security.',
              duration: 10000,
            });

            // Log security alert
            await logSecurityEvent(auth.user!.id, 'suspicious_login', {
              reason,
              ip,
              device,
            });
          } else {
            // Log normal login
            await logSecurityEvent(auth.user!.id, 'login', {
              ip,
              device,
            });
          }
        } catch (error) {
          console.error('Failed to log security event:', error);
        }
      };

      logLogin();
    }
  }, [auth.user]);

  return auth;
}
