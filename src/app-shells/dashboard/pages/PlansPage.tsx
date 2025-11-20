import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Plans</h1>
        <p className="text-muted-foreground">Manage billing plans</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Plan management coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
