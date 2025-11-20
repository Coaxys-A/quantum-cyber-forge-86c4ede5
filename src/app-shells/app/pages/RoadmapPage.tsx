import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';

export default function RoadmapPage() {
  const { t } = useTranslation();
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const data = await apiClient.roadmap.stages.list();
        setStages(data);
      } catch (error) {
        console.error('Failed to fetch stages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStages();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('nav.roadmap')}</h1>
        <p className="text-muted-foreground">Track your project roadmap</p>
      </div>

      <div className="space-y-4">
        {stages.map((stage) => (
          <Card key={stage.id}>
            <CardHeader>
              <CardTitle>{stage.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{stage.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
