import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import { Plus } from 'lucide-react';

export default function ModulesPage() {
  const { t } = useTranslation();
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await apiClient.modules.list();
        setModules(data);
      } catch (error) {
        console.error('Failed to fetch modules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.modules')}</h1>
          <p className="text-muted-foreground">Manage your system modules</p>
        </div>
        <Link to="/app/modules/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Module
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Link key={module.id} to={`/app/modules/${module.slug}`}>
            <Card className="hover:bg-accent transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{module.name}</CardTitle>
                  <Badge>{module.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {module.description || 'No description'}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
