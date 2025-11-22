import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { monitoringService } from '@/lib/monitoring-service';
import { useToast } from './use-toast';

export function useMonitoring() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: systemHealth, isLoading: healthLoading } = useQuery({
    queryKey: ['system-health'],
    queryFn: () => monitoringService.checkSystemHealth(),
    refetchInterval: 30000,
  });

  const { data: serviceHealth } = useQuery({
    queryKey: ['service-health'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_health')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  const { data: alerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alert_events')
        .select('*')
        .order('triggered_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    refetchInterval: 10000,
  });

  const { data: metrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const end = new Date();
      const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);

      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .gte('recorded_at', start.toISOString())
        .lte('recorded_at', end.toISOString())
        .order('recorded_at', { ascending: true })
        .limit(1000);

      if (error) throw error;
      return data;
    },
    refetchInterval: 60000,
  });

  const acknowledgeAlertMutation = useMutation({
    mutationFn: async ({ alertId, userId }: { alertId: string; userId: string }) => {
      return await monitoringService.acknowledgeAlert(alertId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast({ title: 'Success', description: 'Alert acknowledged' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  return {
    systemHealth,
    healthLoading,
    serviceHealth,
    alerts,
    metrics,
    acknowledgeAlert: acknowledgeAlertMutation.mutate,
  };
}
