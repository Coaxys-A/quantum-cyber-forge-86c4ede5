import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Code, GitBranch, Shield, AlertTriangle, CheckCircle, Lock, Sparkles, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function DevSecOpsPage() {
  const { profile } = useAuth();
  const [repoUrl, setRepoUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [profile]);

  const checkAccess = async () => {
    if (!profile?.tenant_id) return;
    
    try {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan:plans(*)')
        .eq('tenant_id', profile.tenant_id)
        .eq('status', 'active')
        .single();

      const plan = subscription?.plan as any;
      const hasFullAccess = ['PRO', 'ULTRA', 'ENTERPRISE', 'ENTERPRISE_PLUS'].includes(plan?.tier);
      setHasAccess(hasFullAccess);
    } catch (error) {
      console.error('Access check failed:', error);
    }
  };

  const handleScan = async () => {
    if (!hasAccess) {
      toast.error('Upgrade to Pro or higher to use DevSecOps scanning');
      return;
    }

    if (!repoUrl) {
      toast.error('Please enter a repository URL');
      return;
    }

    setScanning(true);
    toast.info('Starting security scan...', { description: 'Analyzing dependencies and code' });

    // Simulate scanning
    setTimeout(() => {
      setScanResults({
        dependencies: {
          total: 234,
          outdated: 12,
          vulnerable: 3,
          critical: 1
        },
        codeIssues: {
          total: 45,
          high: 8,
          medium: 22,
          low: 15
        },
        cicd: {
          pipelineScore: 75,
          issues: [
            'No SAST scanning detected',
            'Secrets scanning not configured',
            'Missing dependency scanning'
          ],
          recommendations: [
            'Add Snyk or similar tool for dependency scanning',
            'Configure pre-commit hooks',
            'Enable branch protection rules'
          ]
        },
        sbom: {
          packages: 234,
          licenses: {
            MIT: 180,
            Apache: 32,
            GPL: 8,
            BSD: 14
          }
        }
      });
      setScanning(false);
      toast.success('Scan complete', { description: 'Found 3 critical vulnerabilities' });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">DevSecOps Advisor</h1>
          <p className="text-muted-foreground">
            Automated security analysis for your development pipeline
          </p>
        </div>
        {!hasAccess && (
          <Badge variant="outline" className="gap-2">
            <Lock className="h-3 w-3" />
            Upgrade for full access
          </Badge>
        )}
      </div>

      {!hasAccess && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">Limited Access</p>
                <p className="text-sm text-muted-foreground">
                  Upgrade to Pro for recurring scans and full DevSecOps features
                </p>
              </div>
            </div>
            <Button>Upgrade Plan</Button>
          </CardContent>
        </Card>
      )}

      {/* Scan Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Repository Analysis
          </CardTitle>
          <CardDescription>
            Scan your repository for security issues and best practices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="repo-url">Repository URL</Label>
            <div className="flex gap-2">
              <Input
                id="repo-url"
                placeholder="https://github.com/username/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                disabled={scanning}
              />
              <Button 
                onClick={handleScan} 
                disabled={scanning || !repoUrl}
                className="gap-2"
              >
                {scanning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Scanning...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Scan
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scan Results */}
      {scanResults && (
        <Tabs defaultValue="dependencies">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
            <TabsTrigger value="code">Code Issues</TabsTrigger>
            <TabsTrigger value="cicd">CI/CD</TabsTrigger>
            <TabsTrigger value="sbom">SBOM</TabsTrigger>
          </TabsList>

          <TabsContent value="dependencies" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{scanResults.dependencies.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Outdated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-500">{scanResults.dependencies.outdated}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Vulnerable</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{scanResults.dependencies.vulnerable}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Critical</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{scanResults.dependencies.critical}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Critical Vulnerabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">lodash (4.17.19)</p>
                    <p className="text-sm text-muted-foreground">Prototype Pollution vulnerability</p>
                    <p className="text-xs text-muted-foreground mt-1">CVE-2020-8203</p>
                  </div>
                  <Badge variant="destructive">Critical</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Total Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{scanResults.codeIssues.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">High</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{scanResults.codeIssues.high}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Medium</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-500">{scanResults.codeIssues.medium}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Low</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">{scanResults.codeIssues.low}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cicd" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5" />
                    Pipeline Security Score
                  </span>
                  <Badge variant="outline">{scanResults.cicd.pipelineScore}/100</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Issues Found</h4>
                  <div className="space-y-2">
                    {scanResults.cicd.issues.map((issue: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <div className="space-y-2">
                    {scanResults.cicd.recommendations.map((rec: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sbom" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Software Bill of Materials
                </CardTitle>
                <CardDescription>
                  Complete inventory of all dependencies and licenses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Total Packages</span>
                    <span className="text-sm font-bold">{scanResults.sbom.packages}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">License Distribution</h4>
                  <div className="space-y-2">
                    {Object.entries(scanResults.sbom.licenses).map(([license, count]) => (
                      <div key={license} className="flex items-center justify-between text-sm">
                        <span>{license}</span>
                        <Badge variant="outline">{count as number}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {!scanResults && (
        <Card>
          <CardContent className="p-12 text-center">
            <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Enter a repository URL and click Scan to begin analysis
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
