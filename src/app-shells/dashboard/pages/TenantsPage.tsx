import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TenantsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tenants</h1>
        <p className="text-muted-foreground">Manage all tenants</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tenant List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No tenants found</p>
        </CardContent>
      </Card>
    </div>
  );
}
