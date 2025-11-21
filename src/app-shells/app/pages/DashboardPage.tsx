import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Shield,
  Zap,
  Database,
  Network
} from 'lucide-react';

export default function DashboardPage() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    modules: 0,
    risks: 0,
    simulations: 0,
    controls: 0,
    criticalRisks: 0,
    activeSimulations: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [profile]);

  const loadDashboardData = async () => {
    if (!profile?.tenant_id) return;

    try {
      const [modulesRes, risksRes, simulationsRes, controlsRes] = await Promise.all([
        supabase.from('modules').select('id', { count: 'exact', head: true }).eq('tenant_id', profile.tenant_id),
        supabase.from('risks').select('id, severity', { count: 'exact' }).eq('tenant_id', profile.tenant_id),
        supabase.from('simulations').select('id, status', { count: 'exact' }).eq('tenant_id', profile.tenant_id),
        supabase.from('controls').select('id', { count: 'exact', head: true }).eq('tenant_id', profile.tenant_id)
      ]);

      const criticalRisks = risksRes.data?.filter(r => r.severity === 'CRITICAL').length || 0;
      const activeSimulations = simulationsRes.data?.filter(s => s.status === 'RUNNING').length || 0;

      setStats({
        modules: modulesRes.count || 0,
        risks: risksRes.count || 0,
        simulations: simulationsRes.count || 0,
        controls: controlsRes.count || 0,
        criticalRisks,
        activeSimulations
      });

      const { data: auditData } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('tenant_id', profile.tenant_id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentActivity(auditData || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Modules', value: stats.modules, icon: Database, color: 'text-blue-500', link: '/app/modules' },
    { title: 'Security Risks', value: stats.risks, icon: AlertTriangle, color: 'text-orange-500', link: '/app/security' },
    { title: 'Simulations', value: stats.simulations, icon: Zap, color: 'text-purple-500', link: '/app/simulations' },
    { title: 'Controls', value: stats.controls, icon: Shield, color: 'text-green-500', link: '/app/security/controls' }
  ];

  const quickActions = [
    { title: 'Create Module', icon: Database, link: '/app/modules/create', variant: 'default' as const },
    { title: 'Add Risk', icon: AlertTriangle, link: '/app/security/risks/create', variant: 'outline' as const },
    { title: 'Run Simulation', icon: Zap, link: '/app/simulations/create', variant: 'outline' as const },
    { title: 'View Architecture', icon: Network, link: '/app/architecture', variant: 'outline' as const }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.full_name || profile?.email || 'User'}
        </p>
      </div>

      {stats.criticalRisks > 0 && (
        <Card className="border-destructive/50 bg-destructive/5 animate-pulse">
          <CardContent className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-semibold">Critical Security Risks Detected</p>
                <p className="text-sm text-muted-foreground">
                  {stats.criticalRisks} critical {stats.criticalRisks === 1 ? 'risk' : 'risks'} requiring immediate attention
                </p>
              </div>
            </div>
            <Link to="/app/security">
              <Button variant="destructive" size="sm">Review Now</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="hover:border-primary/50 transition-all duration-200 cursor-pointer group animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color} group-hover:scale-110 transition-transform`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  View all {stat.title.toLowerCase()}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {stats.activeSimulations > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary animate-pulse" />
              <div>
                <p className="font-semibold">Active Simulations Running</p>
                <p className="text-sm text-muted-foreground">
                  {stats.activeSimulations} {stats.activeSimulations === 1 ? 'simulation' : 'simulations'} in progress
                </p>
              </div>
            </div>
            <Link to="/app/simulations">
              <Button variant="outline" size="sm">View Details</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.link}>
                <Button variant={action.variant} className="w-full group">
                  <action.icon className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  {action.title}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest events in your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No recent activity to display
                </p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.resource_type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              System Health
            </CardTitle>
            <CardDescription>Overall system status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Database</span>
                </div>
                <span className="text-sm font-medium text-green-500">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">API Services</span>
                </div>
                <span className="text-sm font-medium text-green-500">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Authentication</span>
                </div>
                <span className="text-sm font-medium text-green-500">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Storage</span>
                </div>
                <span className="text-sm font-medium text-green-500">Available</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
