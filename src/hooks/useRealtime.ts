import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeAPTRuns(tenantId: string | undefined) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!tenantId) return;

    const aptChannel = supabase
      .channel('apt_runs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'apt_runs',
          filter: `tenant_id=eq.${tenantId}`
        },
        (payload) => {
          console.log('[REALTIME] APT Run changed:', payload);
          // Trigger refetch via query invalidation in consuming components
          window.dispatchEvent(new CustomEvent('apt-run-updated', { detail: payload }));
        }
      )
      .subscribe();

    setChannel(aptChannel);

    return () => {
      supabase.removeChannel(aptChannel);
    };
  }, [tenantId]);

  return channel;
}

export function useRealtimeDevSecOpsScans(tenantId: string | undefined) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!tenantId) return;

    const scansChannel = supabase
      .channel('devsecops_scans_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devsecops_scans',
          filter: `tenant_id=eq.${tenantId}`
        },
        (payload) => {
          console.log('[REALTIME] DevSecOps Scan changed:', payload);
          window.dispatchEvent(new CustomEvent('devsecops-scan-updated', { detail: payload }));
        }
      )
      .subscribe();

    setChannel(scansChannel);

    return () => {
      supabase.removeChannel(scansChannel);
    };
  }, [tenantId]);

  return channel;
}

export function useRealtimeSubscriptions(tenantId: string | undefined) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!tenantId) return;

    const subsChannel = supabase
      .channel('subscriptions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `tenant_id=eq.${tenantId}`
        },
        (payload) => {
          console.log('[REALTIME] Subscription changed:', payload);
          window.dispatchEvent(new CustomEvent('subscription-updated', { detail: payload }));
        }
      )
      .subscribe();

    setChannel(subsChannel);

    return () => {
      supabase.removeChannel(subsChannel);
    };
  }, [tenantId]);

  return channel;
}

export function useRealtimeSystemMetrics() {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const metricsChannel = supabase
      .channel('system_metrics_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_metrics'
        },
        (payload) => {
          console.log('[REALTIME] New metric:', payload);
          window.dispatchEvent(new CustomEvent('system-metric-updated', { detail: payload }));
        }
      )
      .subscribe();

    setChannel(metricsChannel);

    return () => {
      supabase.removeChannel(metricsChannel);
    };
  }, []);

  return channel;
}
