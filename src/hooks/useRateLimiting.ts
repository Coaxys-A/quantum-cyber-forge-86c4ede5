import { useCallback } from 'react';
import { checkRateLimit, clearRateLimit } from '@/lib/security';
import { toast } from 'sonner';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  message?: string;
}

/**
 * Hook for rate limiting user actions
 */
export function useRateLimiting() {
  const checkLimit = useCallback((
    key: string,
    config: RateLimitConfig = { maxAttempts: 5, windowMs: 60000 }
  ): boolean => {
    const allowed = checkRateLimit(key, config.maxAttempts, config.windowMs);
    
    if (!allowed) {
      toast.error(
        config.message || 'Too many attempts. Please try again later.',
        { duration: 5000 }
      );
    }
    
    return allowed;
  }, []);

  const reset = useCallback((key: string) => {
    clearRateLimit(key);
  }, []);

  return {
    checkLimit,
    reset,
  };
}
