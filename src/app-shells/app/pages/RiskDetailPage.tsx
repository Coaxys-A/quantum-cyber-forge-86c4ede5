import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { ArrowLeft } from 'lucide-react';

export default function RiskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [risk, setRisk] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRisk = async () => {
      if (!id) return;
      try {
        const data = await apiClient.security.risks.get(id);
        setRisk(data);
      } catch (error) {
        console.error('Failed to fetch risk:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRisk();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!risk) {
    return <div>Risk not found</div>;
  }

  return (
    <div className="space-y-6">
      <Link to="/app/security">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Security
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{risk.title}</CardTitle>
            <Badge variant="destructive">{risk.severity}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{risk.description}</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Likelihood</h3>
              <p>{risk.likelihood || 'N/A'}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Impact</h3>
              <p>{risk.impact || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
