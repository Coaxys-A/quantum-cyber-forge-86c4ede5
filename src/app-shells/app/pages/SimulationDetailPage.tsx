import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient } from '@/lib/api-client';
import { ArrowLeft, Play, Square, Activity, Target, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface SimulationStage {
  name: string;
  tactics: string[];
  techniques: string[];
  completed: boolean;
  timestamp?: string;
  impact: string;
}

export default function SimulationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [simulation, setSimulation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  
  const stages: SimulationStage[] = [
    {
      name: 'Reconnaissance',
      tactics: ['Resource Development', 'Reconnaissance'],
      techniques: ['T1595 - Active Scanning', 'T1590 - Gather Victim Network Information'],
      completed: true,
      timestamp: '2024-01-15 10:00:00',
      impact: 'Identified 12 public-facing services and 3 subdomains'
    },
    {
      name: 'Initial Access',
      tactics: ['Initial Access'],
      techniques: ['T1190 - Exploit Public-Facing Application', 'T1078 - Valid Accounts'],
      completed: true,
      timestamp: '2024-01-15 10:15:00',
      impact: 'Gained foothold through vulnerable web application'
    },
    {
      name: 'Execution',
      tactics: ['Execution'],
      techniques: ['T1059 - Command and Scripting Interpreter'],
      completed: true,
      timestamp: '2024-01-15 10:30:00',
      impact: 'Executed malicious payload on compromised host'
    },
    {
      name: 'Privilege Escalation',
      tactics: ['Privilege Escalation'],
      techniques: ['T1068 - Exploitation for Privilege Escalation'],
      completed: false,
      impact: 'Attempting to escalate to SYSTEM privileges'
    },
    {
      name: 'Lateral Movement',
      tactics: ['Lateral Movement'],
      techniques: ['T1021 - Remote Services'],
      completed: false,
      impact: 'Not yet initiated'
    },
    {
      name: 'Exfiltration',
      tactics: ['Exfiltration'],
      techniques: ['T1041 - Exfiltration Over C2 Channel'],
      completed: false,
      impact: 'Not yet initiated'
    }
  ];

  useEffect(() => {
    const fetchSimulation = async () => {
      if (!id) return;
      try {
        const data = await apiClient.simulations.get(id);
        setSimulation(data);
        
        // Load events
        const eventsData = await apiClient.simulations.events(id);
        setEvents(eventsData);
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
            <div>
              <CardTitle className="text-2xl">{simulation.name}</CardTitle>
              <CardDescription className="mt-1">
                APT Simulation - MITRE ATT&CK Framework
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={simulation.status === 'RUNNING' ? 'default' : 'secondary'}>
                {simulation.status}
              </Badge>
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
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Scenario</span>
                </div>
                <p className="text-2xl font-bold mt-2">{simulation.scenario}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Stages Completed</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {stages.filter(s => s.completed).length} / {stages.length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Detection Rate</span>
                </div>
                <p className="text-2xl font-bold mt-2">45%</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="timeline">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">Attack Timeline</TabsTrigger>
          <TabsTrigger value="stages">Stages</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Attack Chain Progression</CardTitle>
              <CardDescription>
                Detailed timeline of the simulated advanced persistent threat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stages.map((stage, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        stage.completed ? 'bg-green-500' : 'bg-muted'
                      }`}>
                        {stage.completed ? (
                          <Activity className="h-4 w-4 text-white" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      {index < stages.length - 1 && (
                        <div className={`w-0.5 h-16 ${stage.completed ? 'bg-green-500' : 'bg-border'}`} />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{stage.name}</h4>
                        {stage.timestamp && (
                          <span className="text-xs text-muted-foreground">{stage.timestamp}</span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Tactics: </span>
                          <span className="text-sm text-muted-foreground">{stage.tactics.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Techniques: </span>
                          <span className="text-sm text-muted-foreground">{stage.techniques.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Impact: </span>
                          <span className="text-sm text-muted-foreground">{stage.impact}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stages" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {stages.map((stage, index) => (
              <Card key={index} className={stage.completed ? 'border-green-500' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{stage.name}</CardTitle>
                    <Badge variant={stage.completed ? 'default' : 'secondary'}>
                      {stage.completed ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Tactics</p>
                    <div className="flex flex-wrap gap-2">
                      {stage.tactics.map((tactic, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tactic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Techniques</p>
                    <div className="flex flex-wrap gap-2">
                      {stage.techniques.map((technique, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {technique}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Events</CardTitle>
              <CardDescription>Detailed log of all simulation activities</CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No events recorded yet. Start the simulation to generate events.
                </p>
              ) : (
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Activity className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{event.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(event.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline">{event.event_type}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
