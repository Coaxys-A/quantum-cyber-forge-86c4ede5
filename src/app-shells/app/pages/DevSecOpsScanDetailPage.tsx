import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, AlertTriangle, CheckCircle, Info, XCircle, Download } from 'lucide-react';
import { SBOMTreeViewer } from '@/components/devsecops/SBOMTreeViewer';
import { exportDevSecOpsScanToPDF } from '@/lib/pdf-export';

export default function DevSecOpsScanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState<any>(null);
  const [findings, setFindings] = useState<any[]>([]);
  const [sbom, setSbom] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScanDetails();
  }, [id]);

  const loadScanDetails = async () => {
    const [scanRes, findingsRes, sbomRes] = await Promise.all([
      supabase
        .from('devsecops_scans')
        .select('*')
        .eq('id', id)
        .single(),
      supabase
        .from('devsecops_findings')
        .select('*')
        .eq('scan_id', id)
        .order('severity', { ascending: false }),
      supabase
        .from('devsecops_sbom')
        .select('*')
        .eq('scan_id', id)
        .maybeSingle()
    ]);

    if (scanRes.data) setScan(scanRes.data);
    if (findingsRes.data) setFindings(findingsRes.data);
    if (sbomRes.data) setSbom(sbomRes.data);
    setLoading(false);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
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

  const severityCount = (severity: string) =>
    findings.filter(f => f.severity === severity).length;

  const handleExportPDF = () => {
    if (scan) {
      exportDevSecOpsScanToPDF({
        ...scan,
        findings
      });
    }
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

  if (!scan) {
    return (
      <div className="container mx-auto p-6">
        <p>Scan not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate('/app/devsecops')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to DevSecOps
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{scan.name}</h1>
          <p className="text-muted-foreground mt-1">
            {scan.target_type}: {scan.target_identifier}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {findings.length} Findings
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">{scan.status}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{severityCount('critical')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">High</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-500">{severityCount('high')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Medium</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-500">{severityCount('medium')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Low</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-500">{severityCount('low')}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="findings" className="w-full">
        <TabsList>
          <TabsTrigger value="findings">Findings</TabsTrigger>
          {sbom && <TabsTrigger value="sbom">SBOM</TabsTrigger>}
          <TabsTrigger value="details">Scan Details</TabsTrigger>
        </TabsList>

        <TabsContent value="findings" className="space-y-4 mt-4">
          {findings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-lg font-medium">No findings</p>
                <p className="text-sm text-muted-foreground">
                  All security checks passed
                </p>
              </CardContent>
            </Card>
          ) : (
            findings.map((finding, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(finding.severity)}
                      <div className="flex-1">
                        <CardTitle className="text-sm font-medium">
                          {finding.title}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {finding.file_path}
                          {finding.line_number && `:${finding.line_number}`}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(finding.severity)}>
                      {finding.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">{finding.description}</p>
                  
                  {finding.cwe_id && (
                    <div className="text-xs">
                      <span className="text-muted-foreground">CWE:</span>{' '}
                      <Badge variant="outline">{finding.cwe_id}</Badge>
                      {finding.cvss_score && (
                        <>
                          {' '}
                          <span className="text-muted-foreground">CVSS:</span>{' '}
                          <span className="font-medium">{finding.cvss_score}</span>
                        </>
                      )}
                    </div>
                  )}

                  {finding.remediation && (
                    <div className="bg-muted p-3 rounded-md text-sm">
                      <p className="font-medium mb-1">Remediation:</p>
                      <p className="text-muted-foreground">{finding.remediation}</p>
                    </div>
                  )}

                  {finding.code_snippet && (
                    <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                      <code>{finding.code_snippet}</code>
                    </pre>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {sbom && (
          <TabsContent value="sbom" className="mt-4">
            <SBOMTreeViewer sbom={sbom} />
          </TabsContent>
        )}

        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Scan Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Scan Types</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {scan.scan_types.map((type: string) => (
                      <Badge key={type} variant="outline">
                        {type.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Type</p>
                  <p className="font-medium capitalize">{scan.target_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Started At</p>
                  <p className="font-medium">
                    {scan.started_at
                      ? new Date(scan.started_at).toLocaleString()
                      : 'Not started'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed At</p>
                  <p className="font-medium">
                    {scan.completed_at
                      ? new Date(scan.completed_at).toLocaleString()
                      : 'In progress'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
