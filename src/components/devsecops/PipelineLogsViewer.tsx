import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Terminal, Download, Search } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  metadata?: Record<string, any>;
}

interface PipelineLogsViewerProps {
  pipelineRunId: string;
  logs?: string;
}

export function PipelineLogsViewer({ pipelineRunId, logs }: PipelineLogsViewerProps) {
  const [parsedLogs, setParsedLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  useEffect(() => {
    if (logs) {
      try {
        // Try to parse as JSON logs
        const lines = logs.split('\n').filter(line => line.trim());
        const parsed = lines.map(line => {
          try {
            return JSON.parse(line) as LogEntry;
          } catch {
            // If not JSON, create a simple log entry
            return {
              timestamp: new Date().toISOString(),
              level: 'info' as const,
              message: line
            };
          }
        });
        setParsedLogs(parsed);
      } catch {
        // Fallback: treat entire log as one entry
        setParsedLogs([{
          timestamp: new Date().toISOString(),
          level: 'info',
          message: logs
        }]);
      }
    }
  }, [logs]);

  const filteredLogs = parsedLogs.filter(log => {
    const matchesText = log.message.toLowerCase().includes(filter.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    return matchesText && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-500';
      case 'warn': return 'text-yellow-500';
      case 'debug': return 'text-blue-500';
      default: return 'text-foreground';
    }
  };

  const downloadLogs = () => {
    const blob = new Blob([logs || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pipeline-${pipelineRunId}-logs.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Pipeline Execution Logs
            </CardTitle>
            <CardDescription>
              {parsedLogs.length} log entries
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={downloadLogs}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter logs..."
              className="w-full pl-9 pr-3 py-2 border rounded-md bg-background"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border rounded-md bg-background"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warn">Warning</option>
            <option value="error">Error</option>
            <option value="debug">Debug</option>
          </select>
        </div>

        <div className="bg-black rounded-lg p-4 h-[500px] overflow-y-auto font-mono text-sm">
          {filteredLogs.length === 0 ? (
            <p className="text-gray-500">No logs available</p>
          ) : (
            filteredLogs.map((log, i) => (
              <div key={i} className="flex gap-3 mb-1 hover:bg-gray-900 px-2 py-1">
                <span className="text-gray-500 flex-shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <Badge
                  variant="outline"
                  className={`flex-shrink-0 ${getLevelColor(log.level)}`}
                >
                  {log.level.toUpperCase()}
                </Badge>
                <span className="text-gray-300 break-all">{log.message}</span>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">
            {filteredLogs.filter(l => l.level === 'error').length} errors
          </Badge>
          <Badge variant="outline">
            {filteredLogs.filter(l => l.level === 'warn').length} warnings
          </Badge>
          <Badge variant="outline">
            {filteredLogs.filter(l => l.level === 'info').length} info
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
