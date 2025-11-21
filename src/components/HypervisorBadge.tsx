import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

export function HypervisorBadge() {
  const { hasRole } = useAuth();
  
  if (!hasRole('HYPERVISOR')) {
    return null;
  }

  return (
    <Badge variant="destructive" className="gap-1 animate-pulse">
      <Shield className="h-3 w-3" />
      HYPERVISOR
    </Badge>
  );
}
