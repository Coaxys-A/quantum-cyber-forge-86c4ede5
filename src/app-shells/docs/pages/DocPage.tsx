import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

export default function DocPage() {
  const { slug } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold capitalize">{slug?.replace(/-/g, ' ')}</h1>
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Documentation content for {slug}</p>
        </CardContent>
      </Card>
    </div>
  );
}
