import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { ArrowLeft } from 'lucide-react';

export default function ModuleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [module, setModule] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModule = async () => {
      if (!slug) return;
      try {
        const modules = await apiClient.modules.list();
        const found = modules.find((m: any) => m.slug === slug);
        setModule(found);
      } catch (error) {
        console.error('Failed to fetch module:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!module) {
    return <div>Module not found</div>;
  }

  return (
    <div className="space-y-6">
      <Link to="/app/modules">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Modules
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{module.name}</CardTitle>
            <Badge>{module.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">
              {module.description || 'No description available'}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Category</h3>
            <Badge variant="outline">{module.category}</Badge>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Version</h3>
            <p>{module.version || 'N/A'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
