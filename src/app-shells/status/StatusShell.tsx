import { Routes, Route } from 'react-router-dom';
import StatusLayout from './StatusLayout';
import StatusPage from './pages/StatusPage';
import IncidentPage from './pages/IncidentPage';

export default function StatusShell() {
  return (
    <StatusLayout>
      <Routes>
        <Route path="/" element={<StatusPage />} />
        <Route path="/incidents/:id" element={<IncidentPage />} />
      </Routes>
    </StatusLayout>
  );
}
