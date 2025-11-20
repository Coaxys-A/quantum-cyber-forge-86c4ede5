import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';

export default function ArchitecturePage() {
  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const data = await apiClient.architecture.components.list();
        setComponents(data);
      } catch (error) {
        console.error('Failed to fetch components:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Architecture</h1>
        <p className="text-muted-foreground">System architecture components</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {components.map((component) => (
          <Card key={component.id}>
            <CardHeader>
              <CardTitle>{component.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{component.type}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
