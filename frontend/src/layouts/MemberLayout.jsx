// frontend/src/layouts/MemberLayout.jsx
import { useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Settings, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MemberLayout() {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Overview', path: '/member/reports', icon: Home },
        { name: 'Weekly Report', path: '/member/weekly' },
        { name: 'Reports History', path: '/member/history' },
        { name: 'Projects', path: '/member/projects' },
    ];

    return (
        <div className="min-h-screen bg-[#fbfcff] font-sans">

            {/* Top Horizontal Navigation */}
            <header className="h-[72px] bg-white border-b border-border/40 px-6 flex items-center justify-between sticky top-0 z-50">

                {/* Logo */}
                <div className="flex items-center w-[200px]">
                    <h1 className="text-xl font-bold tracking-tight text-foreground">MeetSync</h1>
                </div>

                {/* Centered Pill Navigation */}
                <nav className="hidden md:flex items-center gap-1 bg-muted/40 p-1.5 rounded-full">
                    {navLinks.map((link) => {
                        const isActive = location.pathname.includes(link.path);
                        const Icon = link.icon;

                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${isActive
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }`}
                            >
                                {Icon && <Icon className="w-4 h-4" />}
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center justify-end gap-3 w-[200px]">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted/50 rounded-full">
                        <Settings className="w-5 h-5" />
                    </Button>

                    {/* Replaced Bell with Logout */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                        title="Log Out"
                    >
                        <LogOut className="w-5 h-5" />
                    </Button>

                    {/* User Avatar Placeholder */}
                    <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm ml-2">
                        {user?.name?.charAt(0) || 'M'}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-[1200px] mx-auto p-8">
                <Outlet />
            </main>

        </div>
    );
}