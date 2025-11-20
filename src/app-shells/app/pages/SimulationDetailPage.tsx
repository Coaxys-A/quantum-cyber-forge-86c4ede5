import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import { ArrowLeft, Play, Square } from 'lucide-react';
import { toast } from 'sonner';

export default function SimulationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [simulation, setSimulation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimulation = async () => {
      if (!id) return;
      try {
        const data = await apiClient.simulations.get(id);
        setSimulation(data);
      } catch (error) {
        console.error('Failed to fetch simulation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimulation();
  }, [id]);

  const handleStart = async () => {
    if (!id) return;
    try {
      await apiClient.simulations.start(id);
      toast.success('Simulation started');
      setSimulation({ ...simulation, status: 'RUNNING' });
    } catch (error: any) {
      toast.error(error?.message || 'Failed to start simulation');
    }
  };

  const handleStop = async () => {
    if (!id) return;
    try {
      await apiClient.simulations.stop(id);
      toast.success('Simulation stopped');
      setSimulation({ ...simulation, status: 'COMPLETED' });
    } catch (error: any) {
      toast.error(error?.message || 'Failed to stop simulation');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!simulation) {
    return <div>Simulation not found</div>;
  }

  return (
    <div className="space-y-6">
      <Link to="/app/simulations">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Simulations
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{simulation.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge>{simulation.status}</Badge>
              {simulation.status === 'PENDING' && (
                <Button onClick={handleStart} size="sm">
                  <Play className="mr-2 h-4 w-4" />
                  Start
                </Button>
              )}
              {simulation.status === 'RUNNING' && (
                <Button onClick={handleStop} size="sm" variant="destructive">
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Scenario</h3>
            <p className="text-muted-foreground">{simulation.scenario}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{simulation.description || 'No description'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
