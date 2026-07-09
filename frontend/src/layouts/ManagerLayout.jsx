// frontend/src/layouts/ManagerLayout.jsx
import { useContext, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    LayoutDashboard,
    FileText,
    FolderKanban,
    LogOut,
    Settings,
    ChevronRight,
    Users,
    Menu,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
    { name: 'Dashboard',  path: '/manager/dashboard', icon: LayoutDashboard },
    { name: 'Team Reports', path: '/manager/reports',   icon: FileText },
    { name: 'Projects',   path: '/manager/projects',  icon: FolderKanban },
];

export default function ManagerLayout() {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate  = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : 'M';

    return (
        <div className="min-h-screen bg-[#f5f6fa] flex font-sans">

            {/* ─── Sidebar ─── */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 flex flex-col
                w-[240px] bg-white border-r border-border/40
                transition-transform duration-300
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:relative lg:translate-x-0 lg:flex
            `}>
                {/* Logo */}
                <div className="h-[72px] flex items-center px-6 border-b border-border/40 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                            <Users className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-foreground">MeetSync</span>
                    </div>
                    {/* Close button (mobile) */}
                    <button
                        className="ml-auto lg:hidden text-muted-foreground"
                        onClick={() => setMobileOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Role badge */}
                <div className="px-4 pt-5 pb-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-primary/70 px-2">
                        Manager Panel
                    </span>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-3 space-y-1">
                    {navLinks.map(({ name, path, icon: Icon }) => {
                        const active = location.pathname.startsWith(path);
                        return (
                            <Link
                                key={name}
                                to={path}
                                onClick={() => setMobileOpen(false)}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                                    transition-all duration-150 group
                                    ${active
                                        ? 'bg-primary text-white shadow-sm shadow-primary/30'
                                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                                    }
                                `}
                            >
                                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} />
                                <span className="flex-1">{name}</span>
                                {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom: user card + logout */}
                <div className="p-4 border-t border-border/40 space-y-2 shrink-0">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{user?.name || 'Manager'}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{user?.email || ''}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ─── Main content ─── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Top bar */}
                <header className="h-[72px] bg-white border-b border-border/40 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
                    <button
                        className="lg:hidden text-muted-foreground"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Page title (derives from nav) */}
                    <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-foreground font-semibold">
                            {navLinks.find(n => location.pathname.startsWith(n.path))?.name ?? 'Manager'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted/50 rounded-full">
                            <Settings className="w-5 h-5" />
                        </Button>
                        <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {initials}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
