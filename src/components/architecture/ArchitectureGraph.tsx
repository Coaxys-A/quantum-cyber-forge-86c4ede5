import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ZoomIn, ZoomOut, Download, Plus } from 'lucide-react';

interface Node {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  health_status?: string;
}

interface Edge {
  id: string;
  source_id: string;
  target_id: string;
  label?: string;
}

interface ArchitectureGraphProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick?: (node: Node) => void;
  onAddNode?: () => void;
}

export function ArchitectureGraph({ nodes, edges, onNodeClick, onAddNode }: ArchitectureGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    drawGraph();
  }, [nodes, edges, scale, offset]);

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    // Draw edges
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source_id);
      const target = nodes.find(n => n.id === edge.target_id);
      
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const color = getNodeColor(node.health_status);
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 30, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#fff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.name.substring(0, 10), node.x, node.y + 50);
    });

    ctx.restore();
  };

  const getNodeColor = (status?: string) => {
    switch (status) {
      case 'HEALTHY': return '#10b981';
      case 'DEGRADED': return '#f59e0b';
      case 'CRITICAL': return '#ef4444';
      default: return '#6366f1';
    }
  };

  const handleZoomIn = () => setScale(Math.min(scale * 1.2, 3));
  const handleZoomOut = () => setScale(Math.max(scale / 1.2, 0.3));

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'architecture.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {nodes.length} Components
          </Badge>
          <Badge variant="outline">
            {edges.length} Connections
          </Badge>
        </div>
        <div className="flex gap-2">
          {onAddNode && (
            <Button size="sm" onClick={onAddNode}>
              <Plus className="h-4 w-4 mr-2" />
              Add Node
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full h-[600px] border rounded-lg bg-muted/20 cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </Card>
  );
}
