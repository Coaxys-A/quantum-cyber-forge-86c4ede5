import { useState } from 'react';
import { Zap, Play, Pause, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export function APTSimulator() {
  const [scenario, setScenario] = useState('');
  const [simulation, setSimulation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const scenarios = [
    { value: 'BREACH_DETECTION', label: 'Breach Detection' },
    { value: 'INCIDENT_RESPONSE', label: 'Incident Response' },
    { value: 'COMPLIANCE_AUDIT', label: 'Compliance Audit' },
    { value: 'DISASTER_RECOVERY', label: 'Disaster Recovery' },
    { value: 'PENETRATION_TEST', label: 'Penetration Test' },
  ];

  const runSimulation = async () => {
    if (!scenario) {
      toast.error('Please select a scenario');
      return;
    }

    setLoading(true);
    try {
      const result = await apiClient.ai.aptSimulation(scenario);
      setSimulation(result);
      toast.success('APT simulation started');
    } catch (error) {
      toast.error('Failed to start simulation');
      console.error('APT simulation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          AI APT Simulator
        </CardTitle>
        <CardDescription>
          Advanced Persistent Threat simulation with AI-powered attack scenarios
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {!simulation && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Attack Scenario</label>
              <Select value={scenario} onValueChange={setScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="Select attack scenario" />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={runSimulation} disabled={loading || !scenario} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Simulation
                </>
              )}
            </Button>
          </div>
        )}

        {simulation && (
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Badge variant={simulation.status === 'running' ? 'default' : 'secondary'}>
                {simulation.status || 'Running'}
              </Badge>
              <Button variant="outline" size="sm">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            </div>

            <ScrollArea className="flex-1 rounded-md border p-4">
              <div className="space-y-3">
                <div className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Simulation Events
                </div>
                {(simulation.events || [
                  { timestamp: '00:00:01', phase: 'Reconnaissance', message: 'Scanning target network for vulnerabilities' },
                  { timestamp: '00:00:15', phase: 'Initial Access', message: 'Exploiting CVE-2023-1234 on web server' },
                  { timestamp: '00:00:32', phase: 'Privilege Escalation', message: 'Elevating privileges via misconfigured service' },
                  { timestamp: '00:01:05', phase: 'Lateral Movement', message: 'Moving to internal database server' },
                  { timestamp: '00:01:47', phase: 'Exfiltration', message: 'Data extraction in progress...' },
                ]).map((event: any, i: number) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="text-muted-foreground font-mono">{event.timestamp}</span>
                    <Badge variant="outline" className="shrink-0">{event.phase}</Badge>
                    <span>{event.message}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-2">
              <div className="text-sm font-medium">Summary</div>
              <div className="bg-muted p-3 rounded-lg text-sm">
                {simulation.summary || 'Attack chain simulated successfully. Critical vulnerabilities detected in network segmentation and access controls. Immediate remediation recommended.'}
              </div>
            </div>

            <Button onClick={() => setSimulation(null)} variant="outline" className="w-full">
              Run New Simulation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
