import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Landing from '@/pages/Landing';
import Pricing from '@/pages/Pricing';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';

// Lazy load marketing pages
const Features = lazy(() => import('@/pages/Features'));
const Solutions = lazy(() => import('@/pages/Solutions'));
const Compare = lazy(() => import('@/pages/Compare'));
const Industries = lazy(() => import('@/pages/Industries'));

// Lazy load subdomain shells
const AppShell = lazy(() => import('@/app-shells/app/AppShell'));
const DashboardShell = lazy(() => import('@/app-shells/dashboard/DashboardShell'));
const DocsShell = lazy(() => import('@/app-shells/docs/DocsShell'));
const BlogShell = lazy(() => import('@/app-shells/blog/BlogShell'));
const StatusShell = lazy(() => import('@/app-shells/status/StatusShell'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="relative">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-b-2 border-primary opacity-25"></div>
    </div>
  </div>
);

export const AppRouter = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/features" element={<Features />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/compare/:competitor" element={<Compare />} />
        <Route path="/industries/:industry" element={<Industries />} />
        
        {/* Dashboard subdomain */}
        <Route path="/dashboard/*" element={<DashboardShell />} />
        
        {/* Docs subdomain */}
        <Route path="/docs/*" element={<DocsShell />} />
        
        {/* Blog subdomain */}
        <Route path="/blog/*" element={<BlogShell />} />
        
        {/* Status subdomain */}
        <Route path="/status/*" element={<StatusShell />} />
        
        {/* App subdomain */}
        <Route path="/app/*" element={<AppShell />} />
        
        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};