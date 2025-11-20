import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import { Plus, AlertTriangle } from 'lucide-react';

export default function SecurityPage() {
  const { t } = useTranslation();
  const [risks, setRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRisks = async () => {
      try {
        const data = await apiClient.security.risks.list();
        setRisks(data);
      } catch (error) {
        console.error('Failed to fetch risks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRisks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.security')}</h1>
          <p className="text-muted-foreground">Manage security risks</p>
        </div>
        <Link to="/app/security/risks/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Risk
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {risks.map((risk) => (
          <Link key={risk.id} to={`/app/security/risks/${risk.id}`}>
            <Card className="hover:bg-accent transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <CardTitle>{risk.title}</CardTitle>
                  <Badge variant="destructive">{risk.severity}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {risk.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
