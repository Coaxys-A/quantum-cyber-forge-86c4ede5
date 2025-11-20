import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper } from 'lucide-react';

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="flex h-16 items-center px-4">
          <Link to="/blog" className="flex items-center gap-2 font-bold text-xl">
            <Newspaper className="h-6 w-6" />
            Hyperion-Flux Blog
          </Link>
        </div>
      </header>
      <main className="container mx-auto p-6 max-w-4xl">
        {children}
      </main>
    </div>
  );
}
