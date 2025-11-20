import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { Package, Map, Shield, Zap } from 'lucide-react';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    modules: 0,
    risks: 0,
    simulations: 0,
    tasks: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [modules, security] = await Promise.all([
          apiClient.modules.list(),
          apiClient.security.risks.list(),
        ]);
        
        setMetrics({
          modules: modules.length,
          risks: security.length,
          simulations: 0,
          tasks: 0,
        });
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const cards = [
    { title: t('nav.modules'), value: metrics.modules, icon: Package, color: 'text-blue-500' },
    { title: t('nav.roadmap'), value: metrics.tasks, icon: Map, color: 'text-green-500' },
    { title: t('nav.security'), value: metrics.risks, icon: Shield, color: 'text-red-500' },
    { title: t('nav.simulation'), value: metrics.simulations, icon: Zap, color: 'text-yellow-500' },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('dashboard.welcome')}</h1>
        <p className="text-muted-foreground">{t('dashboard.overview')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
