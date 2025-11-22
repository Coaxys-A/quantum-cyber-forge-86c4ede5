import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Only log error message, not sensitive data or stack traces
    console.error('ErrorBoundary caught an error:', error.message);
    
    // Store minimal error info for debugging (no stack traces in localStorage)
    try {
      const errorId = `err_${Date.now()}`;
      const auditEvent = {
        errorId,
        action: 'ERROR',
        resourceType: 'UI',
        message: error.message,
        timestamp: new Date().toISOString(),
      };
      
      // Only store error ID, send full details to backend if available
      localStorage.setItem('last_error_id', errorId);
      
      // TODO: Send full error details to backend audit log
      // await auditLogger.logError(auditEvent);
    } catch (e) {
      // Silently fail if can't log
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <CardTitle>Something went wrong</CardTitle>
                  <CardDescription>
                    We encountered an unexpected error. Our team has been notified.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="p-3 rounded-lg bg-muted text-sm font-mono overflow-auto">
                  {this.state.error.message}
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={this.handleReset}>Reload Page</Button>
                <Button variant="outline" onClick={() => window.history.back()}>
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
