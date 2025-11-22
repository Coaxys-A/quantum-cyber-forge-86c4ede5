import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlanLimitGuard } from '@/components/PlanLimitGuard';
import { PlayCircle, Shield, Activity, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function APTSimulationsPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRuns();
  }, [profile?.tenant_id]);

  const loadRuns = async () => {
    if (!profile?.tenant_id) return;
    
    const { data, error } = await supabase
      .from('apt_runs')
      .select(`
        *,
        apt_scenarios (
          name,
          description,
          apt_actor_profiles (name)
        )
      `)
      .eq('tenant_id', profile.tenant_id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRuns(data);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500',
      running: 'bg-blue-500',
      completed: 'bg-green-500',
      failed: 'bg-red-500',
      stopped: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            APT Attack Simulator
          </h1>
          <p className="text-muted-foreground mt-2">
            Simulate advanced persistent threat campaigns using real-world TTPs
          </p>
        </div>
        <PlanLimitGuard resource="simulations">
          <Button onClick={() => navigate('/app/simulations/create')} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            New Simulation
          </Button>
        </PlanLimitGuard>
      </div>

      <div className="grid gap-4">
        {runs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No simulations yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first APT simulation to begin
              </p>
              <Button onClick={() => navigate('/app/simulations/create')}>
                Create Simulation
              </Button>
            </CardContent>
          </Card>
        ) : (
          runs.map((run) => (
            <Card
              key={run.id}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => navigate(`/app/simulations/${run.id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {run.apt_scenarios?.name || 'Unnamed Scenario'}
                      {run.apt_scenarios?.apt_actor_profiles && (
                        <Badge variant="outline">
                          {run.apt_scenarios.apt_actor_profiles.name}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {run.apt_scenarios?.description || 'No description'}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(run.status)}>
                    {run.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Progress</p>
                    <p className="font-medium">{run.progress_percent}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Stage</p>
                    <p className="font-medium">{run.current_stage || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Started</p>
                    <p className="font-medium">
                      {run.started_at
                        ? new Date(run.started_at).toLocaleDateString()
                        : 'Not started'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">
                      {run.started_at && run.completed_at
                        ? `${Math.round(
                            (new Date(run.completed_at).getTime() -
                              new Date(run.started_at).getTime()) /
                              1000
                          )}s`
                        : run.status === 'running'
                        ? 'In progress'
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
