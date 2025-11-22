import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function IncidentPage() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost">
        <Link to="/status">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to status
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Incident Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Incident ID: {id}
          </p>
          <p className="mt-4">
            No incident details available at this time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
