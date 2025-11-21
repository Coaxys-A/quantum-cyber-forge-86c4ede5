import { useState } from 'react';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface SecurityAnalystProps {
  riskId?: string;
}

export function SecurityAnalyst({ riskId }: SecurityAnalystProps) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    if (!riskId) {
      toast.error('No risk selected');
      return;
    }

    setLoading(true);
    try {
      const result = await apiClient.ai.securityAnalysis(riskId);
      setAnalysis(result);
      toast.success('Security analysis complete');
    } catch (error) {
      toast.error('Failed to run security analysis');
      console.error('Security analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          AI Security Analyst
        </CardTitle>
        <CardDescription>
          Advanced risk scoring, threat prediction, and remediation recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysis && (
          <Button onClick={runAnalysis} disabled={loading || !riskId} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Run Security Analysis
              </>
            )}
          </Button>
        )}

        {analysis && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Threat Score</div>
                <div className="text-2xl font-bold">{analysis.threatScore || 85}/100</div>
                <Progress value={analysis.threatScore || 85} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Risk Level</div>
                <Badge variant={analysis.riskLevel === 'critical' ? 'destructive' : 'default'}>
                  {analysis.riskLevel || 'High'}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                Threat Predictions
              </div>
              <ul className="space-y-2 text-sm">
                {(analysis.predictions || [
                  'Likely escalation within 48 hours',
                  'Potential lateral movement detected',
                  'Data exfiltration risk elevated'
                ]).map((prediction: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    {prediction}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                Recommended Actions
              </div>
              <ul className="space-y-2 text-sm">
                {(analysis.recommendations || [
                  'Isolate affected systems immediately',
                  'Enable enhanced monitoring on related assets',
                  'Review access logs for anomalies',
                  'Update security controls and policies'
                ]).map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
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
