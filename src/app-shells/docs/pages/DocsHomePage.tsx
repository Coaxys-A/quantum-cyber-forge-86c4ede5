import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DocsHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Hyperion-Flux Documentation</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Learn how to use the Hyperion-Flux platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Quick start guide for new users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>API Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Complete API documentation</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
