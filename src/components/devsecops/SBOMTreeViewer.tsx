import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronDown, Package, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Component {
  name: string;
  version: string;
  type: string;
  dependencies?: string[];
  vulnerabilities?: number;
}

interface SBOMData {
  components: Component[];
  dependencies?: Record<string, string[]>;
  format: string;
  version: string;
}

interface SBOMTreeViewerProps {
  sbom: SBOMData;
}

export function SBOMTreeViewer({ sbom }: SBOMTreeViewerProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpand = (name: string) => {
    const next = new Set(expanded);
    if (next.has(name)) {
      next.delete(name);
    } else {
      next.add(name);
    }
    setExpanded(next);
  };

  const buildDependencyTree = () => {
    const componentMap = new Map<string, Component>();
    sbom.components.forEach(comp => {
      componentMap.set(comp.name, comp);
    });

    const rootComponents = sbom.components.filter(comp => {
      if (!sbom.dependencies) return true;
      return !Object.values(sbom.dependencies).some(deps => deps.includes(comp.name));
    });

    return rootComponents;
  };

  const renderComponent = (component: Component, level: number = 0) => {
    const isExpanded = expanded.has(component.name);
    const childDeps = sbom.dependencies?.[component.name] || [];
    const hasChildren = childDeps.length > 0;
    const matches = component.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (searchTerm && !matches && !childDeps.some(dep => 
      dep.toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return null;
    }

    return (
      <div key={component.name} style={{ marginLeft: `${level * 24}px` }}>
        <div className="flex items-center gap-2 py-2 hover:bg-muted px-2 rounded-md group">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => toggleExpand(component.name)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="w-6" />
          )}

          <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{component.name}</span>
              <Badge variant="outline" className="text-xs flex-shrink-0">
                {component.version}
              </Badge>
              {component.vulnerabilities && component.vulnerabilities > 0 && (
                <Badge variant="destructive" className="text-xs flex-shrink-0">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {component.vulnerabilities} CVE{component.vulnerabilities > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground capitalize">{component.type}</p>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div>
            {childDeps.map(depName => {
              const depComponent = sbom.components.find(c => c.name === depName);
              if (!depComponent) return null;
              return renderComponent(depComponent, level + 1);
            })}
          </div>
        )}
      </div>
    );
  };

  const rootComponents = buildDependencyTree();
  const totalVulnerabilities = sbom.components.reduce(
    (sum, comp) => sum + (comp.vulnerabilities || 0),
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Software Bill of Materials</CardTitle>
        <CardDescription>
          {sbom.format.toUpperCase()} v{sbom.version} - {sbom.components.length} components
          {totalVulnerabilities > 0 && ` - ${totalVulnerabilities} vulnerabilities`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search components..."
            className="w-full px-3 py-2 border rounded-md bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="border rounded-lg p-2 max-h-[600px] overflow-y-auto">
            {rootComponents.map(comp => renderComponent(comp))}
          </div>

          <div className="flex gap-4 text-sm text-muted-foreground">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(new Set(sbom.components.map(c => c.name)))}
            >
              Expand All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(new Set())}
            >
              Collapse All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
