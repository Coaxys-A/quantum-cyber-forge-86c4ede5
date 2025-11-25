import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isDemoMode } from '@/lib/demo-tenant';

export function DemoBanner() {
  const [visible, setVisible] = useState(true);
  
  if (!isDemoMode() || !visible) {
    return null;
  }

  return (
    <Alert className="mb-6 border-warning bg-warning/10 relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2 h-6 w-6 p-0"
        onClick={() => setVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
      <Info className="h-4 w-4 text-warning" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <strong className="font-semibold">Demo Mode</strong>
          <p className="text-sm mt-1">
            You're viewing a read-only demo. Some features are limited. 
            {' '}
            <Link to="/app/register" className="underline font-medium">
              Sign up for free
            </Link>
            {' '}to unlock full access.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
}
