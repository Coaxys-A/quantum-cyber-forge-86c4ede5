import { Routes, Route, Navigate } from 'react-router-dom';
import { RouteGuard } from '@/components/RouteGuard';
import DashboardLayout from './DashboardLayout';
import OverviewPage from './pages/OverviewPage';
import TenantsPage from './pages/TenantsPage';
import TenantDetailPage from './pages/TenantDetailPage';
import UsersPage from './pages/UsersPage';
import PlansPage from './pages/PlansPage';
import SystemHealthPage from './pages/SystemHealthPage';
import LogsPage from './pages/LogsPage';
import SEODashboardPage from './pages/SEODashboardPage';
import InfrastructurePage from './pages/InfrastructurePage';

export default function DashboardShell() {
  return (
    <RouteGuard requireAuth requireRole="HYPERVISOR">
      <DashboardLayout>
        <Routes>
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/tenants" element={<TenantsPage />} />
          <Route path="/tenants/:tenantId" element={<TenantDetailPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/system/health" element={<SystemHealthPage />} />
          <Route path="/system/logs" element={<LogsPage />} />
          <Route path="/seo" element={<SEODashboardPage />} />
          <Route path="/infrastructure" element={<InfrastructurePage />} />
          <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
        </Routes>
      </DashboardLayout>
    </RouteGuard>
  );
}
