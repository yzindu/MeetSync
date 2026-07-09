import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MemberLayout from './layouts/MemberLayout';
import Reports from './pages/member/Reports';
import WeeklyReport from './pages/member/WeeklyReport';
import ReportHistory from './pages/member/ReportHistory';
import ProjectsPage from './pages/member/ProjectsPage';
import ManagerLayout from './layouts/ManagerLayout';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import TeamReports from './pages/manager/TeamReports';
import ProjectsManager from './pages/manager/ProjectsManager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Member Routes */}
        <Route path="/member" element={<MemberLayout />}>
          <Route index element={<Navigate to="reports" replace />} />
          <Route path="reports"  element={<Reports />} />
          <Route path="weekly"   element={<WeeklyReport />} />
          <Route path="history"  element={<ReportHistory />} />
          <Route path="projects" element={<ProjectsPage />} />
        </Route>

        {/* Manager Routes */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="reports"   element={<TeamReports />} />
          <Route path="projects"  element={<ProjectsManager />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;