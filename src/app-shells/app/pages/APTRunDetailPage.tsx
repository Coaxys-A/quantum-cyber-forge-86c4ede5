import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Activity, Shield, AlertTriangle } from 'lucide-react';

export default function APTRunDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [run, setRun] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [detections, setDetections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRunDetails();
  }, [id]);

  const loadRunDetails = async () => {
    const [runRes, eventsRes, detectionsRes] = await Promise.all([
      supabase
        .from('apt_runs')
        .select('*, apt_scenarios(*, apt_actor_profiles(*))')
        .eq('id', id)
        .single(),
      supabase
        .from('apt_events')
        .select('*')
        .eq('run_id', id)
        .order('timestamp'),
      supabase
        .from('apt_detection_logs')
        .select('*')
        .eq('run_id', id)
        .order('detected_at')
    ]);

    if (runRes.data) setRun(runRes.data);
    if (eventsRes.data) setEvents(eventsRes.data);
    if (detectionsRes.data) setDetections(detectionsRes.data);
    setLoading(false);
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-blue-500',
      info: 'bg-gray-500'
    };
    return colors[severity] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="container mx-auto p-6">
        <p>Simulation not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate('/app/simulations')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Simulations
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            {run.apt_scenarios?.name || 'Simulation Run'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {run.apt_scenarios?.apt_actor_profiles?.name} - {run.status}
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {run.progress_percent}% Complete
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">{run.status}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{events.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Detections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{detections.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {run.results?.success_rate || 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList>
          <TabsTrigger value="events">
            <Activity className="h-4 w-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="detections">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Detections
          </TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4 mt-4">
          {events.map((event, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-sm font-medium">
                      {event.technique} - {event.tactic}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Stage: {event.stage}
                    </CardDescription>
                  </div>
                  <Badge variant={event.success ? 'default' : 'destructive'}>
                    {event.success ? 'Success' : 'Failed'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{event.narrative}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Impact:</span>{' '}
                    <span className="font-medium">{event.impact_score}/100</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Detection Risk:</span>{' '}
                    <span className="font-medium">{event.detection_probability}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="detections" className="space-y-4 mt-4">
          {detections.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No detections recorded</p>
              </CardContent>
            </Card>
          ) : (
            detections.map((detection, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {detection.detection_type} Detection
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {new Date(detection.detected_at).toLocaleString()}
                      </CardDescription>
                    </div>
                    <Badge className={getSeverityColor(detection.alert_severity)}>
                      {detection.alert_severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Confidence:</span>{' '}
                      <span className="font-medium">
                        {detection.confidence_score.toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Response:</span>{' '}
                      <span>{detection.blue_team_response}</span>
                    </div>
                    {detection.blocked && (
                      <Badge variant="outline" className="mt-2">
                        ✓ Attack Blocked
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Kill Chain Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.reduce((acc: any[], event) => {
                  if (!acc.find(e => e.stage === event.stage)) {
                    acc.push(event);
                  }
                  return acc;
                }, []).map((event, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="rounded-full bg-primary h-3 w-3 mt-1" />
                    <div>
                      <p className="font-medium capitalize">{event.stage.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
