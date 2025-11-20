import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import { Plus } from 'lucide-react';

export default function SimulationsPage() {
  const [simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const data = await apiClient.simulations.list();
        setSimulations(data);
      } catch (error) {
        console.error('Failed to fetch simulations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimulations();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Simulations</h1>
          <p className="text-muted-foreground">Manage cyber simulations</p>
        </div>
        <Link to="/app/simulations/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Simulation
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {simulations.map((simulation) => (
          <Link key={simulation.id} to={`/app/simulations/${simulation.id}`}>
            <Card className="hover:bg-accent transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{simulation.name}</CardTitle>
                  <Badge>{simulation.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{simulation.scenario}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
