import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from './DashboardLayout';
import OverviewPage from './pages/OverviewPage';
import TenantsPage from './pages/TenantsPage';
import TenantDetailPage from './pages/TenantDetailPage';
import UsersPage from './pages/UsersPage';
import PlansPage from './pages/PlansPage';
import SystemHealthPage from './pages/SystemHealthPage';
import LogsPage from './pages/LogsPage';

const PlatformRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || (!hasRole('PLATFORM_ADMIN') && !hasRole('HYPERVISOR'))) {
    return <Navigate to="/app/login" replace />;
  }

  return <>{children}</>;
};

export default function DashboardShell() {
  return (
    <PlatformRoute>
      <DashboardLayout>
        <Routes>
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/tenants" element={<TenantsPage />} />
          <Route path="/tenants/:tenantId" element={<TenantDetailPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/system/health" element={<SystemHealthPage />} />
          <Route path="/system/logs" element={<LogsPage />} />
          <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
        </Routes>
      </DashboardLayout>
    </PlatformRoute>
  );
}
