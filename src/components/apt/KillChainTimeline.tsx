import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';

interface Event {
  stage: string;
  technique: string;
  tactic: string;
  timestamp: string;
  success: boolean;
  impact_score: number;
  detection_probability: number;
  narrative: string;
}

interface KillChainTimelineProps {
  events: Event[];
}

const KILL_CHAIN_STAGES = [
  'reconnaissance',
  'weaponization',
  'delivery',
  'exploitation',
  'installation',
  'command_and_control',
  'actions_on_objectives'
];

export function KillChainTimeline({ events }: KillChainTimelineProps) {
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.stage]) acc[event.stage] = [];
    acc[event.stage].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const stagesCompleted = KILL_CHAIN_STAGES.filter(
    stage => groupedEvents[stage]?.some(e => e.success)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kill Chain Progression</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-8">
            {KILL_CHAIN_STAGES.map((stage, idx) => {
              const stageEvents = groupedEvents[stage] || [];
              const hasSuccess = stageEvents.some(e => e.success);
              const isCompleted = hasSuccess;
              const avgImpact = stageEvents.length > 0
                ? Math.round(stageEvents.reduce((sum, e) => sum + e.impact_score, 0) / stageEvents.length)
                : 0;

              return (
                <div key={stage} className="relative flex items-start gap-4">
                  {/* Stage indicator */}
                  <div className="relative z-10">
                    {isCompleted ? (
                      <CheckCircle className="h-12 w-12 text-green-500 bg-background" />
                    ) : stageEvents.length > 0 ? (
                      <XCircle className="h-12 w-12 text-red-500 bg-background" />
                    ) : (
                      <Clock className="h-12 w-12 text-muted-foreground bg-background" />
                    )}
                  </div>

                  {/* Stage content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg capitalize">
                        {stage.replace(/_/g, ' ')}
                      </h3>
                      {stageEvents.length > 0 && (
                        <Badge variant={isCompleted ? 'default' : 'destructive'}>
                          {stageEvents.length} event{stageEvents.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>

                    {stageEvents.length > 0 ? (
                      <div className="space-y-2">
                        {stageEvents.map((event, i) => (
                          <div
                            key={i}
                            className="bg-muted p-3 rounded-md border-l-4 border-primary"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-medium text-sm">
                                {event.technique} - {event.tactic}
                              </p>
                              <Badge variant={event.success ? 'default' : 'secondary'}>
                                {event.success ? 'Success' : 'Failed'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {event.narrative}
                            </p>
                            <div className="flex gap-4 text-xs">
                              <span>
                                Impact: <strong>{event.impact_score}/100</strong>
                              </span>
                              <span>
                                Detection Risk: <strong>{event.detection_probability}%</strong>
                              </span>
                              <span className="text-muted-foreground">
                                {new Date(event.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        ))}
                        {isCompleted && avgImpact > 0 && (
                          <div className="text-sm text-muted-foreground">
                            Average Impact: {avgImpact}/100
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Stage not yet executed
                      </p>
                    )}
                  </div>

                  {/* Arrow to next stage */}
                  {idx < KILL_CHAIN_STAGES.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground absolute left-8 -bottom-4" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Stages Completed:</span>
              <strong>
                {stagesCompleted.length} / {KILL_CHAIN_STAGES.length}
              </strong>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
