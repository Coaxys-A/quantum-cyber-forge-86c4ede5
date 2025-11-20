import { Routes, Route, Navigate } from 'react-router-dom';
import BlogLayout from './BlogLayout';
import BlogHomePage from './pages/BlogHomePage';
import PostPage from './pages/PostPage';

export default function BlogShell() {
  return (
    <BlogLayout>
      <Routes>
        <Route path="/" element={<BlogHomePage />} />
        <Route path="/post/:slug" element={<PostPage />} />
        <Route path="*" element={<Navigate to="/blog" replace />} />
      </Routes>
    </BlogLayout>
  );
}
