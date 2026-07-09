import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import MemberLayout  from './layouts/MemberLayout';
import ManagerLayout from './layouts/ManagerLayout';

// Auth pages
import Login    from './pages/auth/Login';
import Register from './pages/auth/Register';

// Member pages
import Reports       from './pages/member/Reports';
import WeeklyReport  from './pages/member/WeeklyReport';
import ReportHistory from './pages/member/ReportHistory';
import ProjectsPage  from './pages/member/ProjectsPage';

// Manager pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import TeamReports      from './pages/manager/TeamReports';
import ProjectsManager  from './pages/manager/ProjectsManager';

// Smart root redirect — sends logged-in users to their correct home
function RootRedirect() {
    const { user, loading } = useContext(AuthContext);
    if (loading) return null; // spinner handled by ProtectedRoute
    if (!user)                return <Navigate to="/login"            replace />;
    if (user.role === 'Manager') return <Navigate to="/manager/dashboard" replace />;
    return                    <Navigate to="/member/reports"          replace />;
}

function App() {
    return (
        <Router>
            <Routes>

                {/* ── Root smart redirect ── */}
                <Route path="/" element={<RootRedirect />} />

                {/* ── Public routes (redirect to home if already logged in) ── */}
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* ── Member-only routes ── */}
                <Route element={<ProtectedRoute allowedRole="Member" />}>
                    <Route path="/member" element={<MemberLayout />}>
                        <Route index element={<Navigate to="reports" replace />} />
                        <Route path="reports"  element={<Reports />} />
                        <Route path="weekly"   element={<WeeklyReport />} />
                        <Route path="history"  element={<ReportHistory />} />
                        <Route path="projects" element={<ProjectsPage />} />
                    </Route>
                </Route>

                {/* ── Manager-only routes ── */}
                <Route element={<ProtectedRoute allowedRole="Manager" />}>
                    <Route path="/manager" element={<ManagerLayout />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<ManagerDashboard />} />
                        <Route path="reports"   element={<TeamReports />} />
                        <Route path="projects"  element={<ProjectsManager />} />
                    </Route>
                </Route>

                {/* ── 404 fallback ── */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </Router>
    );
}

export default App;