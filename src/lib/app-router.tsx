import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Lazy load subdomain shells
const AppShell = lazy(() => import('@/app-shells/app/AppShell'));
const DashboardShell = lazy(() => import('@/app-shells/dashboard/DashboardShell'));
const DocsShell = lazy(() => import('@/app-shells/docs/DocsShell'));
const BlogShell = lazy(() => import('@/app-shells/blog/BlogShell'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const AppRouter = () => {
  const location = useLocation();
  
  // Determine subdomain from path in dev or hostname in prod
  const getSubdomain = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.includes('dashboard.')) return 'dashboard';
      if (hostname.includes('docs.')) return 'docs';
      if (hostname.includes('blog.')) return 'blog';
      if (hostname.includes('app.')) return 'app';
    }
    
    // Dev mode: use path prefix
    if (location.pathname.startsWith('/dashboard')) return 'dashboard';
    if (location.pathname.startsWith('/docs')) return 'docs';
    if (location.pathname.startsWith('/blog')) return 'blog';
    if (location.pathname.startsWith('/app')) return 'app';
    
    return 'app'; // default
  };

  const subdomain = getSubdomain();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Dashboard subdomain */}
        <Route path="/dashboard/*" element={<DashboardShell />} />
        
        {/* Docs subdomain */}
        <Route path="/docs/*" element={<DocsShell />} />
        
        {/* Blog subdomain */}
        <Route path="/blog/*" element={<BlogShell />} />
        
        {/* App subdomain */}
        <Route path="/app/*" element={<AppShell />} />
        
        {/* Root redirect based on subdomain */}
        <Route 
          path="/" 
          element={
            subdomain === 'dashboard' ? <Navigate to="/dashboard/overview" replace /> :
            subdomain === 'docs' ? <Navigate to="/docs" replace /> :
            subdomain === 'blog' ? <Navigate to="/blog" replace /> :
            <Navigate to="/app/login" replace />
          } 
        />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to={`/${subdomain}`} replace />} />
      </Routes>
    </Suspense>
  );
};
