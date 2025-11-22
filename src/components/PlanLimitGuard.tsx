import { ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface PlanLimitGuardProps {
  resource: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PlanLimitGuard({ resource, children, fallback }: PlanLimitGuardProps) {
  const { canCreate, checkLimit, isHypervisor } = usePlanLimits();

  if (isHypervisor) {
    return <>{children}</>;
  }

  const allowed = canCreate(resource);
  const { used, limit } = checkLimit(resource);

  if (!allowed) {
    return fallback || (
      <Alert className="border-destructive/50 bg-destructive/10">
        <Lock className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            You've reached your plan limit ({used}/{limit} {resource.toLowerCase()}).
          </span>
          <Button asChild size="sm" variant="outline">
            <Link to="/app/billing">Upgrade Plan</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}
