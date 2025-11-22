import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { monitoringService } from '@/lib/monitoring-service';
import { useToast } from '@/hooks/use-toast';
import {
  Activity,
  Server,
  Database,
  Shield,
  HardDrive,
  Cpu,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock,
  Zap,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function InfrastructurePage() {
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [latencyStats, setLatencyStats] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const health = await monitoringService.checkSystemHealth();
      setSystemHealth(health);

      const end = new Date();
      const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);

      const cpuMetrics = await monitoringService.getMetrics('system', { start, end });
      setMetrics(cpuMetrics);

      const latency = await monitoringService.getAPILatencyStats({ start, end });
      setLatencyStats(latency);

      const recentAlerts = await monitoringService.getRecentAlerts(20);
      setAlerts(recentAlerts);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'destructive' | 'secondary'> = {
      healthy: 'default',
      degraded: 'secondary',
      down: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'default'} className="capitalize">
        {status}
      </Badge>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, 'default' | 'destructive' | 'secondary'> = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'secondary',
      low: 'default',
    };
    return (
      <Badge variant={variants[severity] || 'default'} className="capitalize">
        {severity}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Infrastructure Monitoring</h1>
          <p className="text-muted-foreground">System health, metrics, and alerts</p>
        </div>
        <Button onClick={loadDashboard} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {systemHealth?.services.filter((s: any) => s.status === 'healthy').length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Healthy Services</div>
              </div>
              <Server className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {systemHealth?.services.filter((s: any) => s.status === 'degraded').length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Degraded Services</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{alerts.filter((a) => !a.acknowledged_at).length}</div>
                <div className="text-sm text-muted-foreground">Active Alerts</div>
              </div>
              <Zap className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {latencyStats.length > 0 ? Math.round(latencyStats[0]?.avg || 0) : 0}ms
                </div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {systemHealth && (
        <Card>
          <CardHeader>
            <CardTitle>Service Health</CardTitle>
            <CardDescription>Real-time status of all system services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.services.map((service: any) => (
                <div key={service.service_name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <div className="font-medium capitalize">{service.service_name}</div>
                      {service.response_time_ms && (
                        <div className="text-sm text-muted-foreground">{service.response_time_ms}ms</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(service.status)}
                    {service.error_message && (
                      <div className="text-sm text-red-600 max-w-md truncate">{service.error_message}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="metrics">
        <TabsList>
          <TabsTrigger value="metrics">
            <TrendingUp className="mr-2 h-4 w-4" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="latency">
            <Clock className="mr-2 h-4 w-4" />
            API Latency
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Alerts ({alerts.filter((a) => !a.acknowledged_at).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>System Metrics (24h)</CardTitle>
              <CardDescription>CPU, Memory, and Disk usage over time</CardDescription>
            </CardHeader>
            <CardContent>
              {metrics.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="recorded_at" tickFormatter={(val) => new Date(val).toLocaleTimeString()} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="metric_value" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No metrics data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="latency">
          <Card>
            <CardHeader>
              <CardTitle>API Latency Stats</CardTitle>
              <CardDescription>Response times by endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              {latencyStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={latencyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="endpoint" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avg" fill="hsl(var(--primary))" />
                    <Bar dataKey="p95" fill="hsl(var(--secondary))" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No latency data available</div>
              )}

              {latencyStats.length > 0 && (
                <div className="mt-6 space-y-2">
                  {latencyStats.slice(0, 10).map((stat) => (
                    <div key={stat.endpoint} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="font-medium truncate flex-1">{stat.endpoint}</div>
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Avg: </span>
                          <span className="font-medium">{Math.round(stat.avg)}ms</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">P95: </span>
                          <span className="font-medium">{Math.round(stat.p95)}ms</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Requests: </span>
                          <span className="font-medium">{stat.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>System alerts and incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-600" />
                    <p>No alerts. All systems operational!</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getSeverityBadge(alert.severity)}
                          <span className="font-semibold">{alert.title}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(alert.triggered_at).toLocaleString()}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{alert.source}</Badge>
                        {alert.acknowledged_at ? (
                          <Badge variant="default">Acknowledged</Badge>
                        ) : (
                          <Button size="sm" variant="outline">
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
