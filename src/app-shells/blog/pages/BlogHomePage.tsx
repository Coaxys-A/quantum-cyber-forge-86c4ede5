import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BlogHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Blog</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Latest updates and insights from Hyperion-Flux
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>No posts yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Blog posts will appear here</p>
        </CardContent>
      </Card>
    </div>
  );
}
