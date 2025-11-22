import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireRole?: string;
  redirectTo?: string;
}

export function RouteGuard({ 
  children, 
  requireAuth = true,
  requireRole,
  redirectTo = '/app/login'
}: RouteGuardProps) {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requireRole && !hasRole(requireRole)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
}
