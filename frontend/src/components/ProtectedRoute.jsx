import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ allowedRole, redirectTo = '/login' }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fbfcff]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Not logged in go to login
    if (!user) {
        return <Navigate to={redirectTo} replace />;
    }

    // Logged in but wrong role redirect to the correct home
    if (allowedRole && user.role !== allowedRole) {
        const home = user.role === 'Manager' ? '/manager/dashboard' : '/member/reports';
        return <Navigate to={home} replace />;
    }

    return <Outlet />;
}
