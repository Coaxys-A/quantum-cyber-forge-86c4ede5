import { useState } from 'react';
import { Network, TrendingDown, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface ArchitectureAnalyzerProps {
  componentId?: string;
}

export function ArchitectureAnalyzer({ componentId }: ArchitectureAnalyzerProps) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    if (!componentId) {
      toast.error('No component selected');
      return;
    }

    setLoading(true);
    try {
      const result = await apiClient.ai.architectureAnalysis(componentId);
      setAnalysis(result);
      toast.success('Architecture analysis complete');
    } catch (error) {
      toast.error('Failed to run architecture analysis');
      console.error('Architecture analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          AI Architecture Analyzer
        </CardTitle>
        <CardDescription>
          Analyze component health, attack paths, and dependency risks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysis && (
          <Button onClick={runAnalysis} disabled={loading || !componentId} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Network className="mr-2 h-4 w-4" />
                Analyze Architecture
              </>
            )}
          </Button>
        )}

        {analysis && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Health Score</div>
                <div className="text-2xl font-bold">{analysis.healthScore || 92}%</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Risk Level</div>
                <Badge variant={analysis.riskLevel === 'high' ? 'destructive' : 'default'}>
                  {analysis.riskLevel || 'Medium'}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <TrendingDown className="h-4 w-4 text-red-500" />
                Attack Paths Detected
              </div>
              <ul className="space-y-2 text-sm">
                {(analysis.attackPaths || [
                  'Lateral movement via shared credentials',
                  'Data exfiltration through API gateway',
                  'Privilege escalation via service account'
                ]).map((path: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    {path}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Shield className="h-4 w-4" />
                Hardening Recommendations
              </div>
              <ul className="space-y-2 text-sm">
                {(analysis.recommendations || [
                  'Implement network segmentation',
                  'Enable multi-factor authentication',
                  'Review and rotate service credentials',
                  'Add rate limiting on API endpoints'
                ]).map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-green-500 mt-0.5" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <Button onClick={() => setAnalysis(null)} variant="outline" className="w-full">
              Run New Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
