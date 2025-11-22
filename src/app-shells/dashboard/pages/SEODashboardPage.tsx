import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { seoEngine, SEOAuditResult } from '@/lib/seo-engine';
import { useToast } from '@/hooks/use-toast';
import { Search, CheckCircle, AlertCircle, XCircle, TrendingUp, Globe, FileText, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function SEODashboardPage() {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanUrl, setScanUrl] = useState('');
  const [currentAudit, setCurrentAudit] = useState<SEOAuditResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAudits();
  }, []);

  const loadAudits = async () => {
    const { data: profile } = await supabase.from('profiles').select('tenant_id').single();
    if (!profile?.tenant_id) return;

    const { data, error } = await supabase
      .from('seo_audits')
      .select('*')
      .eq('tenant_id', profile.tenant_id)
      .order('scanned_at', { ascending: false })
      .limit(20);

    if (error) {
      toast({ title: 'Error loading audits', description: error.message, variant: 'destructive' });
      return;
    }

    setAudits(data || []);
  };

  const handleScan = async () => {
    if (!scanUrl) {
      toast({ title: 'Error', description: 'Please enter a URL to scan', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { data: profile } = await supabase.from('profiles').select('tenant_id').single();
      if (!profile?.tenant_id) throw new Error('No tenant found');

      const result = await seoEngine.scanPage(scanUrl, profile.tenant_id);
      setCurrentAudit(result);
      await loadAudits();

      toast({ title: 'Scan completed', description: `SEO Score: ${result.score}/100` });
    } catch (error) {
      toast({
        title: 'Scan failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, 'default' | 'destructive' | 'secondary'> = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'secondary',
      low: 'default',
    };
    return <Badge variant={variants[severity] || 'default'}>{severity}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SEO Inspector</h1>
        <p className="text-muted-foreground">Analyze and optimize your pages for search engines</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scan a Page</CardTitle>
          <CardDescription>Enter a URL to perform a comprehensive SEO audit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/page"
              value={scanUrl}
              onChange={(e) => setScanUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            />
            <Button onClick={handleScan} disabled={loading}>
              {loading ? 'Scanning...' : 'Scan'}
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {currentAudit && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Scan Results</CardTitle>
            <CardDescription>{currentAudit.url}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getScoreColor(currentAudit.score)}`}>
                    {currentAudit.score}
                  </div>
                  <div className="text-sm text-muted-foreground">SEO Score</div>
                </div>
                <div className="flex-1">
                  <Progress value={currentAudit.score} className="h-3" />
                </div>
              </div>

              <Tabs defaultValue="issues">
                <TabsList>
                  <TabsTrigger value="issues">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Issues ({currentAudit.issues.length})
                  </TabsTrigger>
                  <TabsTrigger value="metadata">
                    <FileText className="mr-2 h-4 w-4" />
                    Metadata
                  </TabsTrigger>
                  <TabsTrigger value="content">
                    <Globe className="mr-2 h-4 w-4" />
                    Content Analysis
                  </TabsTrigger>
                  <TabsTrigger value="recommendations">
                    <Zap className="mr-2 h-4 w-4" />
                    Recommendations
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="issues" className="space-y-3">
                  {currentAudit.issues.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-600" />
                      <p>No issues found! Your page SEO is excellent.</p>
                    </div>
                  ) : (
                    currentAudit.issues.map((issue, idx) => (
                      <Card key={idx}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-3">
                            <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getSeverityBadge(issue.severity)}
                                <span className="font-semibold">{issue.message}</span>
                              </div>
                              {issue.recommendation && (
                                <p className="text-sm text-muted-foreground">{issue.recommendation}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="metadata" className="space-y-3">
                  <div className="grid gap-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Title</div>
                      <div className="p-3 bg-muted rounded-md">
                        {currentAudit.metadata.title || <span className="text-muted-foreground">Not set</span>}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Description</div>
                      <div className="p-3 bg-muted rounded-md">
                        {currentAudit.metadata.description || (
                          <span className="text-muted-foreground">Not set</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Keywords</div>
                      <div className="p-3 bg-muted rounded-md">
                        {currentAudit.metadata.keywords?.join(', ') || (
                          <span className="text-muted-foreground">Not set</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Canonical URL</div>
                      <div className="p-3 bg-muted rounded-md">
                        {currentAudit.metadata.canonical || (
                          <span className="text-muted-foreground">Not set</span>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{currentAudit.extractedData.wordCount}</div>
                        <div className="text-sm text-muted-foreground">Total Words</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{currentAudit.extractedData.headings.h1.length}</div>
                        <div className="text-sm text-muted-foreground">H1 Headings</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{currentAudit.extractedData.images.length}</div>
                        <div className="text-sm text-muted-foreground">Images</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                          {currentAudit.extractedData.links.internal + currentAudit.extractedData.links.external}
                        </div>
                        <div className="text-sm text-muted-foreground">Links</div>
                      </CardContent>
                    </Card>
                  </div>

                  {currentAudit.extractedData.images.filter((img: any) => img.missing_alt).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Images Without Alt Text</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {currentAudit.extractedData.images
                            .filter((img: any) => img.missing_alt)
                            .slice(0, 5)
                            .map((img: any, idx: number) => (
                              <div key={idx} className="text-sm truncate text-muted-foreground">
                                {img.src}
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-3">
                  {currentAudit.recommendations.map((rec, idx) => (
                    <Card key={idx}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>{rec}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Audits</CardTitle>
          <CardDescription>Your latest SEO scan history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {audits.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-2" />
                <p>No audits yet. Scan your first page to get started!</p>
              </div>
            ) : (
              audits.map((audit) => (
                <Card key={audit.id} className="cursor-pointer hover:bg-accent" onClick={() => setScanUrl(audit.url)}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium truncate">{audit.url}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(audit.scanned_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`text-2xl font-bold ${getScoreColor(audit.seo_score)}`}>
                          {audit.seo_score}
                        </div>
                        <Badge variant={audit.issues?.length > 5 ? 'destructive' : 'default'}>
                          {audit.issues?.length || 0} issues
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
