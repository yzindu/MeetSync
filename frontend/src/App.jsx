import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MemberLayout from './layouts/MemberLayout';
import Reports from './pages/member/Reports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* member Route paths */}
        <Route path="/member" element={<MemberLayout />}>
          {/* Automatically redirect /member to /member/reports */}
          <Route index element={<Navigate to="reports" replace />} />
          <Route path="reports" element={<Reports />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;