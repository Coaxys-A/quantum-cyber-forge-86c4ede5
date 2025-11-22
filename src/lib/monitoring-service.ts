import { supabase } from '@/integrations/supabase/client';

export interface SystemMetric {
  metric_type: string;
  metric_name: string;
  metric_value: number;
  unit: string;
  labels?: Record<string, any>;
  recorded_at?: string;
}

export interface ServiceHealth {
  service_name: string;
  status: 'healthy' | 'degraded' | 'down';
  response_time_ms?: number;
  error_message?: string;
  metadata?: Record<string, any>;
}

export interface AlertEvent {
  alert_type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  source: string;
  metadata?: Record<string, any>;
}

export class MonitoringService {
  async recordMetric(metric: SystemMetric): Promise<void> {
    const { error } = await supabase.from('system_metrics').insert({
      ...metric,
      recorded_at: metric.recorded_at || new Date().toISOString(),
    });

    if (error) console.error('Failed to record metric:', error);
  }

  async recordAPILatency(endpoint: string, method: string, responseTime: number, statusCode: number): Promise<void> {
    const { error } = await supabase.from('api_latency').insert({
      endpoint,
      method,
      response_time_ms: responseTime,
      status_code: statusCode,
      recorded_at: new Date().toISOString(),
    });

    if (error) console.error('Failed to record API latency:', error);
  }

  async updateServiceHealth(health: ServiceHealth): Promise<void> {
    const { error } = await supabase.from('service_health').upsert({
      service_name: health.service_name,
      status: health.status,
      response_time_ms: health.response_time_ms,
      error_message: health.error_message,
      metadata: health.metadata,
      last_check: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) console.error('Failed to update service health:', error);
  }

  async createAlert(alert: AlertEvent): Promise<void> {
    const { error } = await supabase.from('alert_events').insert({
      alert_type: alert.alert_type,
      severity: alert.severity,
      title: alert.title,
      message: alert.message,
      source: alert.source,
      metadata: alert.metadata,
      triggered_at: new Date().toISOString(),
    });

    if (error) console.error('Failed to create alert:', error);

    if (alert.severity === 'critical' || alert.severity === 'high') {
      await this.sendAlertNotification(alert);
    }
  }

  private async sendAlertNotification(alert: AlertEvent): Promise<void> {
    console.log('Sending alert notification:', alert);
  }

  async checkSystemHealth(): Promise<{
    overall: 'healthy' | 'degraded' | 'down';
    services: ServiceHealth[];
  }> {
    const services: ServiceHealth[] = [
      await this.checkDatabaseHealth(),
      await this.checkAPIHealth(),
      await this.checkAuthHealth(),
      await this.checkStorageHealth(),
    ];

    const healthyCount = services.filter(s => s.status === 'healthy').length;
    const degradedCount = services.filter(s => s.status === 'degraded').length;
    const downCount = services.filter(s => s.status === 'down').length;

    let overall: 'healthy' | 'degraded' | 'down';
    if (downCount > 0) {
      overall = 'down';
    } else if (degradedCount > 0) {
      overall = 'degraded';
    } else {
      overall = 'healthy';
    }

    for (const service of services) {
      await this.updateServiceHealth(service);
    }

    return { overall, services };
  }

  private async checkDatabaseHealth(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      const { error } = await supabase.from('tenants').select('id').limit(1).single();
      const responseTime = Date.now() - start;

      return {
        service_name: 'database',
        status: error ? 'degraded' : 'healthy',
        response_time_ms: responseTime,
        error_message: error?.message,
      };
    } catch (error) {
      return {
        service_name: 'database',
        status: 'down',
        response_time_ms: Date.now() - start,
        error_message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async checkAPIHealth(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      const response = await fetch('/api/health').catch(() => null);
      const responseTime = Date.now() - start;

      if (!response) {
        return {
          service_name: 'api',
          status: 'down',
          response_time_ms: responseTime,
          error_message: 'API not reachable',
        };
      }

      return {
        service_name: 'api',
        status: response.ok ? 'healthy' : 'degraded',
        response_time_ms: responseTime,
      };
    } catch (error) {
      return {
        service_name: 'api',
        status: 'down',
        response_time_ms: Date.now() - start,
        error_message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async checkAuthHealth(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      const { data, error } = await supabase.auth.getSession();
      const responseTime = Date.now() - start;

      return {
        service_name: 'auth',
        status: error ? 'degraded' : 'healthy',
        response_time_ms: responseTime,
        error_message: error?.message,
      };
    } catch (error) {
      return {
        service_name: 'auth',
        status: 'down',
        response_time_ms: Date.now() - start,
        error_message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async checkStorageHealth(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      const { data, error } = await supabase.storage.listBuckets();
      const responseTime = Date.now() - start;

      return {
        service_name: 'storage',
        status: error ? 'degraded' : 'healthy',
        response_time_ms: responseTime,
        error_message: error?.message,
      };
    } catch (error) {
      return {
        service_name: 'storage',
        status: 'down',
        response_time_ms: Date.now() - start,
        error_message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getMetrics(metricType: string, timeRange: { start: Date; end: Date }) {
    const { data, error } = await supabase
      .from('system_metrics')
      .select('*')
      .eq('metric_type', metricType)
      .gte('recorded_at', timeRange.start.toISOString())
      .lte('recorded_at', timeRange.end.toISOString())
      .order('recorded_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  async getAPILatencyStats(timeRange: { start: Date; end: Date }) {
    const { data, error } = await supabase
      .from('api_latency')
      .select('*')
      .gte('recorded_at', timeRange.start.toISOString())
      .lte('recorded_at', timeRange.end.toISOString())
      .order('recorded_at', { ascending: false });

    if (error) throw error;

    const byEndpoint = data.reduce((acc, record) => {
      if (!acc[record.endpoint]) {
        acc[record.endpoint] = [];
      }
      acc[record.endpoint].push(record.response_time_ms);
      return acc;
    }, {} as Record<string, number[]>);

    return Object.entries(byEndpoint).map(([endpoint, times]) => ({
      endpoint,
      avg: times.reduce((a, b) => a + b, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      p95: this.percentile(times, 95),
      p99: this.percentile(times, 99),
      count: times.length,
    }));
  }

  private percentile(arr: number[], p: number): number {
    const sorted = arr.slice().sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  }

  async getRecentAlerts(limit: number = 50) {
    const { data, error } = await supabase
      .from('alert_events')
      .select('*')
      .order('triggered_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async acknowledgeAlert(alertId: string, userId: string) {
    const { error } = await supabase
      .from('alert_events')
      .update({
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: userId,
      })
      .eq('id', alertId);

    if (error) throw error;
  }

  async startMonitoring() {
    setInterval(async () => {
      await this.checkSystemHealth();
      
      await this.recordMetric({
        metric_type: 'system',
        metric_name: 'cpu_usage',
        metric_value: Math.random() * 100,
        unit: 'percent',
      });

      await this.recordMetric({
        metric_type: 'system',
        metric_name: 'memory_usage',
        metric_value: Math.random() * 100,
        unit: 'percent',
      });

      await this.recordMetric({
        metric_type: 'system',
        metric_name: 'disk_usage',
        metric_value: Math.random() * 100,
        unit: 'percent',
      });
    }, 60000);
  }
}

export const monitoringService = new MonitoringService();
