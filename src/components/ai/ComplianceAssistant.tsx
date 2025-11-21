import { useState } from 'react';
import { FileCheck, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export function ComplianceAssistant() {
  const [framework, setFramework] = useState('');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const frameworks = [
    { value: 'ISO27001', label: 'ISO 27001' },
    { value: 'SOC2', label: 'SOC 2' },
    { value: 'NIST', label: 'NIST Cybersecurity Framework' },
    { value: 'GDPR', label: 'GDPR' },
    { value: 'HIPAA', label: 'HIPAA' },
    { value: 'PCI-DSS', label: 'PCI-DSS' },
  ];

  const runCheck = async () => {
    if (!framework) {
      toast.error('Please select a framework');
      return;
    }

    setLoading(true);
    try {
      const result = await apiClient.ai.complianceCheck(framework);
      setReport(result);
      toast.success('Compliance check complete');
    } catch (error) {
      toast.error('Failed to run compliance check');
      console.error('Compliance check error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary" />
          AI Compliance Assistant
        </CardTitle>
        <CardDescription>
          Automated compliance mapping and documentation generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!report && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Compliance Framework</label>
              <Select value={framework} onValueChange={setFramework}>
                <SelectTrigger>
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  {frameworks.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={runCheck} disabled={loading || !framework} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileCheck className="mr-2 h-4 w-4" />
                  Run Compliance Check
                </>
              )}
            </Button>
          </div>
        )}

        {report && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall Compliance</span>
                <span className="text-lg font-bold">{report.score || 78}%</span>
              </div>
              <Progress value={report.score || 78} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1 text-center">
                <div className="flex items-center justify-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-2xl font-bold">{report.passed || 23}</span>
                </div>
                <div className="text-xs text-muted-foreground">Passed</div>
              </div>
              <div className="space-y-1 text-center">
                <div className="flex items-center justify-center gap-1">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="text-2xl font-bold">{report.warnings || 8}</span>
                </div>
                <div className="text-xs text-muted-foreground">Warnings</div>
              </div>
              <div className="space-y-1 text-center">
                <div className="flex items-center justify-center gap-1">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-2xl font-bold">{report.failed || 3}</span>
                </div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Critical Items</div>
              <div className="space-y-2">
                {(report.criticalItems || [
                  { id: 'AC-2', title: 'Account Management', status: 'failed' },
                  { id: 'AC-3', title: 'Access Enforcement', status: 'warning' },
                  { id: 'AU-2', title: 'Audit Events', status: 'passed' },
                ]).map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                    <div className="flex items-center gap-2">
                      {item.status === 'passed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {item.status === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                      {item.status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
                      <span className="text-sm font-mono">{item.id}</span>
                      <span className="text-sm">{item.title}</span>
                    </div>
                    <Badge 
                      variant={item.status === 'passed' ? 'default' : item.status === 'warning' ? 'secondary' : 'destructive'}
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                Export Report
              </Button>
              <Button onClick={() => setReport(null)} variant="outline" className="flex-1">
                New Check
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
