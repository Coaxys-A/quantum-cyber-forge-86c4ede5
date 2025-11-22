import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from './AppLayout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ModulesPage from './pages/ModulesPage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import ModuleCreatePage from './pages/ModuleCreatePage';
import RoadmapPage from './pages/RoadmapPage';
import SecurityPage from './pages/SecurityPage';
import RiskDetailPage from './pages/RiskDetailPage';
import RiskCreatePage from './pages/RiskCreatePage';
import ControlsPage from './pages/ControlsPage';
import FindingsPage from './pages/FindingsPage';
import SimulationsPage from './pages/SimulationsPage';
import SimulationDetailPage from './pages/SimulationDetailPage';
import SimulationCreatePage from './pages/SimulationCreatePage';
import ArchitecturePage from './pages/ArchitecturePage';
import BillingPage from './pages/BillingPage';
import TeamPage from './pages/TeamPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/app/login" replace />;
  }

  return <>{children}</>;
};

export default function AppShell() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                
                {/* Modules */}
                <Route path="/modules" element={<ModulesPage />} />
                <Route path="/modules/create" element={<ModuleCreatePage />} />
                <Route path="/modules/:slug" element={<ModuleDetailPage />} />
                
                {/* Roadmap */}
                <Route path="/roadmap" element={<RoadmapPage />} />
                
                {/* Security */}
                <Route path="/security" element={<SecurityPage />} />
                <Route path="/security/risks/create" element={<RiskCreatePage />} />
                <Route path="/security/risks/:id" element={<RiskDetailPage />} />
                <Route path="/security/controls" element={<ControlsPage />} />
                <Route path="/security/findings" element={<FindingsPage />} />
                
                {/* Simulations */}
                <Route path="/simulations" element={<SimulationsPage />} />
                <Route path="/simulations/create" element={<SimulationCreatePage />} />
                <Route path="/simulations/:id" element={<SimulationDetailPage />} />
                
                {/* Architecture */}
                <Route path="/architecture" element={<ArchitecturePage />} />
                
                {/* Billing */}
                <Route path="/billing" element={<BillingPage />} />
                
                {/* Team */}
                <Route path="/team" element={<TeamPage />} />
                
                {/* Notifications */}
                <Route path="/notifications" element={<NotificationsPage />} />
                
                {/* Settings */}
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
