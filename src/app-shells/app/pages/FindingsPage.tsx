import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FindingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Findings</h1>
        <p className="text-muted-foreground">Security findings and issues</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>No findings yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Security findings will appear here when detected.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
