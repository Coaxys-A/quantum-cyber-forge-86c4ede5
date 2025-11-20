import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TenantDetailPage() {
  const { tenantId } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tenant Details</h1>
        <p className="text-muted-foreground">ID: {tenantId}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tenant Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Tenant details coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
