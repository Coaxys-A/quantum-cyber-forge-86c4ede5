import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  Map,
  Shield,
  Zap,
  Network,
  CreditCard,
  Users,
  Bell,
  Settings,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { HypervisorBadge } from '@/components/HypervisorBadge';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, signOut, profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: NavItem[] = [
    { to: '/app/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/app/modules', icon: Package, label: t('nav.modules') },
    { to: '/app/roadmap', icon: Map, label: t('nav.roadmap') },
    { to: '/app/security', icon: Shield, label: t('nav.security') },
    { to: '/app/simulations', icon: Zap, label: t('nav.simulation') },
    { to: '/app/architecture', icon: Network, label: t('nav.architecture') },
    { to: '/app/billing', icon: CreditCard, label: t('nav.billing') },
    { to: '/app/team', icon: Users, label: 'Team' },
    { to: '/app/notifications', icon: Bell, label: 'Notifications' },
    { to: '/app/settings', icon: Settings, label: t('nav.settings') },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          
          <Link to="/app/dashboard" className="flex items-center gap-2 font-bold text-xl">
            {t('app.name')}
          </Link>
          
          <div className="flex-1" />
          
          <HypervisorBadge />
          <ThemeToggle />
          <LocaleSwitcher />
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {profile?.full_name || user?.email}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign out">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } bg-card border-r mt-16 md:mt-0`}
        >
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.to);
              
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
