import { Routes, Route, Navigate } from 'react-router-dom';
import DocsLayout from './DocsLayout';
import DocsHomePage from './pages/DocsHomePage';
import DocPage from './pages/DocPage';

export default function DocsShell() {
  return (
    <DocsLayout>
      <Routes>
        <Route path="/" element={<DocsHomePage />} />
        <Route path="/:slug" element={<DocPage />} />
        <Route path="*" element={<Navigate to="/docs" replace />} />
      </Routes>
    </DocsLayout>
  );
}
