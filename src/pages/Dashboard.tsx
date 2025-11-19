import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Activity, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';

export default function Dashboard() {
  const { t } = useTranslation();

  const { data: securityData } = useQuery({
    queryKey: ['security-dashboard'],
    queryFn: () => apiClient.security.dashboard(),
  });

  const { data: modules } = useQuery({
    queryKey: ['modules'],
    queryFn: () => apiClient.modules.list(),
  });

  const { data: simulations } = useQuery({
    queryKey: ['simulations'],
    queryFn: () => apiClient.simulations.list(),
  });

  const stats = [
    {
      title: t('dashboard.modules'),
      value: modules?.length || 0,
      icon: Activity,
      trend: '+12%',
    },
    {
      title: t('dashboard.activeSimulations'),
      value: simulations?.filter((s: any) => s.status === 'RUNNING').length || 0,
      icon: TrendingUp,
      trend: '+5%',
    },
    {
      title: t('dashboard.openRisks'),
      value: securityData?.openRisks || 0,
      icon: AlertTriangle,
      trend: '-8%',
    },
    {
      title: t('dashboard.healthyComponents'),
      value: securityData?.healthyComponents || 0,
      icon: CheckCircle2,
      trend: '+2%',
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t('dashboard.welcome')}</h1>
          <p className="text-muted-foreground">{t('dashboard.overview')}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary">{stat.trend}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
            <CardDescription>Latest events across your system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b last:border-0">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Simulation completed successfully</p>
                    <p className="text-xs text-muted-foreground">{i} hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
