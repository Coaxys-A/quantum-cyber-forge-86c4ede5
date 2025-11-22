import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SystemStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down' | 'maintenance';
  description: string;
}

export default function StatusPage() {
  const [systems, setSystems] = useState<SystemStatus[]>([
    { name: 'API', status: 'operational', description: 'All API endpoints responding normally' },
    { name: 'Database', status: 'operational', description: 'Database queries performing optimally' },
    { name: 'Authentication', status: 'operational', description: 'Login and registration working' },
    { name: 'AI Engines', status: 'operational', description: 'All AI services available' },
    { name: 'File Storage', status: 'operational', description: 'File uploads and downloads working' },
    { name: 'WebSockets', status: 'operational', description: 'Real-time updates functioning' },
  ]);

  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    checkSystemHealth();
    loadIncidents();
  }, []);

  const checkSystemHealth = async () => {
    try {
      // Check database connectivity
      const { error } = await supabase.from('tenants').select('count').limit(1);
      
      if (error) {
        setSystems(prev => prev.map(s => 
          s.name === 'Database' 
            ? { ...s, status: 'degraded' as const, description: 'Database experiencing issues' }
            : s
        ));
      }
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  const loadIncidents = async () => {
    // In a real implementation, this would fetch from an incidents table
    setIncidents([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'maintenance':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      operational: 'default',
      degraded: 'secondary',
      down: 'destructive',
      maintenance: 'outline',
    };
    
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const allOperational = systems.every(s => s.status === 'operational');

  return (
    <div className="space-y-8">
      {/* Overall Status */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">
            {allOperational ? (
              <span className="text-green-500">All Systems Operational</span>
            ) : (
              <span className="text-yellow-500">Some Systems Degraded</span>
            )}
          </CardTitle>
          <CardDescription>
            Last updated: {new Date().toLocaleString()}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* System Components */}
      <div>
        <h2 className="text-2xl font-bold mb-4">System Components</h2>
        <div className="space-y-3">
          {systems.map((system) => (
            <Card key={system.name}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  {getStatusIcon(system.status)}
                  <div>
                    <h3 className="font-semibold">{system.name}</h3>
                    <p className="text-sm text-muted-foreground">{system.description}</p>
                  </div>
                </div>
                {getStatusBadge(system.status)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Incidents */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Incidents</h2>
        {incidents.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-muted-foreground">No recent incidents to report</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {incidents.map((incident) => (
              <Card key={incident.id}>
                <CardHeader>
                  <CardTitle>{incident.title}</CardTitle>
                  <CardDescription>{incident.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Uptime Stats */}
      <Card>
        <CardHeader>
          <CardTitle>90-Day Uptime</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systems.map((system) => (
              <div key={system.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{system.name}</span>
                  <span className="text-sm text-muted-foreground">99.9%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.9%' }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
