import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSEO } from '@/hooks/useSEO';
import { Search, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

export function SEOBrain() {
  const [url, setUrl] = useState('');
  const { audits, scanPage, isScanning } = useSEO();
  const latestAudit = audits?.[0];

  const handleScan = () => {
    if (url) {
      scanPage(url);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO Brain Scanner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter URL to scan..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            />
            <Button onClick={handleScan} disabled={isScanning || !url}>
              {isScanning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Scan</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {latestAudit && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>SEO Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-6xl font-bold">
                  {latestAudit.seo_score}
                </div>
                <p className="text-muted-foreground mt-2">Overall SEO Score</p>
              </div>
              <Progress value={latestAudit.seo_score} />
            </CardContent>
          </Card>

          {latestAudit.issues && (
            <Card>
              <CardHeader>
                <CardTitle>Issues Found</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(latestAudit.issues as any[]).map((issue, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 border rounded">
                      {issue.severity === 'error' ? (
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{issue.title}</span>
                          <Badge variant={issue.severity === 'error' ? 'destructive' : 'secondary'}>
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{issue.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {latestAudit.recommendations && (
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(latestAudit.recommendations as any[]).map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!latestAudit && !isScanning && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              Enter a URL above to start scanning for SEO issues
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
