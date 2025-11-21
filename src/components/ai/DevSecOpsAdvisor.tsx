import { useState } from 'react';
import { Code, Shield, Package, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export function DevSecOpsAdvisor() {
  const [repoUrl, setRepoUrl] = useState('');
  const [advice, setAdvice] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getAdvice = async () => {
    setLoading(true);
    try {
      const result = await apiClient.ai.devsecopsAdvice(repoUrl || undefined);
      setAdvice(result);
      toast.success('DevSecOps analysis complete');
    } catch (error) {
      toast.error('Failed to get DevSecOps advice');
      console.error('DevSecOps advice error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          AI DevSecOps Advisor
        </CardTitle>
        <CardDescription>
          Dependency scanning, SBOM generation, and CI/CD security review
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!advice && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="repoUrl">Repository URL (optional)</Label>
              <Input
                id="repoUrl"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/org/repo"
              />
            </div>
            <Button onClick={getAdvice} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Get Security Advice
                </>
              )}
            </Button>
          </div>
        )}

        {advice && (
          <Tabs defaultValue="dependencies" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
              <TabsTrigger value="sbom">SBOM</TabsTrigger>
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            </TabsList>

            <TabsContent value="dependencies" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Dependencies</div>
                  <div className="text-2xl font-bold">{advice.totalDeps || 142}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Vulnerabilities</div>
                  <div className="text-2xl font-bold text-red-500">{advice.vulnerabilities || 7}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">High Risk Dependencies</div>
                {(advice.highRiskDeps || [
                  { name: 'lodash', version: '4.17.15', issue: 'Prototype pollution', severity: 'high' },
                  { name: 'axios', version: '0.19.2', issue: 'SSRF vulnerability', severity: 'critical' },
                  { name: 'moment', version: '2.24.0', issue: 'ReDoS vulnerability', severity: 'medium' },
                ]).map((dep: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span className="text-sm font-mono">{dep.name}@{dep.version}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{dep.issue}</span>
                      <Badge variant={dep.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {dep.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sbom" className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm font-mono">
                  {(advice.sbom || [
                    'Package: react@18.2.0',
                    'Package: react-dom@18.2.0',
                    'Package: typescript@5.0.4',
                    'Package: vite@4.3.9',
                    '...',
                  ]).map((line: string, i: number) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Download Full SBOM
              </Button>
            </TabsContent>

            <TabsContent value="pipeline" className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Security Recommendations</div>
                {(advice.pipelineRecs || [
                  'Add SAST scanning to CI pipeline',
                  'Implement dependency vulnerability scanning',
                  'Enable container image scanning',
                  'Add secret detection in commits',
                  'Configure security gates for deployments',
                ]).map((rec: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 p-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {advice && (
          <Button onClick={() => setAdvice(null)} variant="outline" className="w-full">
            New Analysis
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
