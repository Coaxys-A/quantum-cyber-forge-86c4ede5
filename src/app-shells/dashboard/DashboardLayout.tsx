import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Server, DollarSign, Activity, FileText, Search, TrendingUp } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="flex h-16 items-center px-4 gap-4">
          <Link to="/dashboard/overview" className="font-bold text-xl">
            Platform Dashboard
          </Link>
          <div className="flex-1" />
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 border-r bg-card p-4">
          <nav className="space-y-1">
            <Link to="/dashboard/overview" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent">
              <LayoutDashboard className="h-5 w-5" />
              Overview
            </Link>
            <Link to="/dashboard/tenants" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent">
              <Users className="h-5 w-5" />
              Tenants
            </Link>
            <Link to="/dashboard/users" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent">
              <Users className="h-5 w-5" />
              Users
            </Link>
            <Link to="/dashboard/plans" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent">
              <DollarSign className="h-5 w-5" />
              Plans
            </Link>
            <Link to="/dashboard/system/health" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent">
              <Activity className="h-5 w-5" />
              System Health
            </Link>
            <Link to="/dashboard/infrastructure" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent">
              <Server className="h-5 w-5" />
              Infrastructure
            </Link>
            <Link to="/dashboard/seo" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent">
              <Search className="h-5 w-5" />
              SEO Inspector
            </Link>
            <Link to="/dashboard/system/logs" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent">
              <FileText className="h-5 w-5" />
              Logs
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
