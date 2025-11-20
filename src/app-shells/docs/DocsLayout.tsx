import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Book } from 'lucide-react';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="flex h-16 items-center px-4">
          <Link to="/docs" className="flex items-center gap-2 font-bold text-xl">
            <Book className="h-6 w-6" />
            Documentation
          </Link>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 border-r bg-card p-4">
          <nav className="space-y-1">
            <Link to="/docs/getting-started" className="block px-3 py-2 rounded-md hover:bg-accent">
              Getting Started
            </Link>
            <Link to="/docs/concepts" className="block px-3 py-2 rounded-md hover:bg-accent">
              Concepts
            </Link>
            <Link to="/docs/api" className="block px-3 py-2 rounded-md hover:bg-accent">
              API Reference
            </Link>
            <Link to="/docs/guides" className="block px-3 py-2 rounded-md hover:bg-accent">
              Guides
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
