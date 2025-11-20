import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';

export default function ControlsPage() {
  const [controls, setControls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchControls = async () => {
      try {
        const data = await apiClient.security.controls.list();
        setControls(data);
      } catch (error) {
        console.error('Failed to fetch controls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchControls();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Controls</h1>
        <p className="text-muted-foreground">Manage security controls</p>
      </div>

      <div className="grid gap-4">
        {controls.map((control) => (
          <Card key={control.id}>
            <CardHeader>
              <CardTitle>{control.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{control.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
