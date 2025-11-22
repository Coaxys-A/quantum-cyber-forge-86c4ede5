import { Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { isDemoMode } from '@/lib/demo-tenant';

interface UpgradeCTAProps {
  feature: string;
  description?: string;
  inline?: boolean;
}

export function UpgradeCTA({ feature, description, inline = false }: UpgradeCTAProps) {
  if (!isDemoMode()) return null;

  if (inline) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
        <Lock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Upgrade to unlock {feature}
        </span>
        <Button asChild size="sm" variant="ghost" className="ml-auto">
          <Link to="/pricing">Upgrade</Link>
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Unlock {feature}</CardTitle>
            <CardDescription>
              {description || `This feature is available on paid plans`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Button asChild className="flex-1">
            <Link to="/pricing">View Plans</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to="/contact">Contact Sales</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
