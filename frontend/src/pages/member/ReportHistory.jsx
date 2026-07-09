import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { format, parseISO } from 'date-fns';
import { CheckCircle2, Clock, AlertTriangle, Pencil, Eye, Loader2, ClipboardList, Plus, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const STATUS_CONFIG = {
    Submitted: { icon: <CheckCircle2 className="w-3.5 h-3.5" />, className: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
    Pending:   { icon: <Clock className="w-3.5 h-3.5" />,        className: 'bg-orange-50 text-orange-500 border border-orange-100' },
    Late:      { icon: <AlertTriangle className="w-3.5 h-3.5" />, className: 'bg-red-50 text-red-600 border border-red-100' },
};

export default function ReportHistory() {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data } = await API.get('/reports/me');
                setReports(data);
            } catch {
                toast.error('Failed to load report history');
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const filtered = reports.filter(r => {
        const matchStatus = statusFilter === 'All' || r.status === statusFilter;
        const matchSearch = !search ||
            r.projectId?.name?.toLowerCase().includes(search.toLowerCase()) ||
            (Array.isArray(r.tasksCompleted) ? r.tasksCompleted.join(' ') : r.tasksCompleted || '').toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[2.5rem] font-bold tracking-tight text-foreground leading-tight">Report History</h1>
                    <p className="text-muted-foreground text-base mt-1">All your weekly reports in one place.</p>
                </div>
                <Button
                    onClick={() => navigate('/member/weekly')}
                    className="gap-2 h-11 px-6 rounded-lg shadow-md bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02]"
                >
                    <Plus className="w-5 h-5" /> New Report
                </Button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by project or task..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9 h-10 bg-white border-border/50 rounded-xl"
                    />
                </div>
                <div className="flex gap-2">
                    {['All', 'Submitted', 'Pending', 'Late'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                                statusFilter === s
                                    ? 'bg-primary text-white border-primary shadow-sm'
                                    : 'bg-white text-muted-foreground border-border/50 hover:border-primary/50 hover:text-foreground'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center gap-3 py-16 justify-center text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" /> Loading history...
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 border border-border/40 shadow-sm text-center">
                    <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                        {reports.length === 0 ? 'No reports yet' : 'No reports match your filters'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {reports.length === 0 ? 'Submit your first weekly report to see it here.' : 'Try changing the filter or search term.'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-border/40 shadow-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-[1fr_150px_100px_80px_120px] gap-4 px-6 py-3 border-b border-border/40 bg-muted/20">
                        <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Week</span>
                        <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Project</span>
                        <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Status</span>
                        <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Hours</span>
                        <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase text-right">Actions</span>
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-border/30">
                        {filtered.map((report, i) => {
                            const statusConf = STATUS_CONFIG[report.status] || STATUS_CONFIG.Pending;
                            const isEditable = report.status !== 'Submitted';
                            return (
                                <div
                                    key={report._id}
                                    className="grid grid-cols-[1fr_150px_100px_80px_120px] gap-4 px-6 py-4 items-center hover:bg-muted/10 transition-colors"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            {format(parseISO(report.weekStartDate), 'MMM d')} – {format(parseISO(report.weekEndDate), 'MMM d, yyyy')}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[280px]">
                                            {Array.isArray(report.tasksCompleted)
                                                ? report.tasksCompleted[0]
                                                : report.tasksCompleted}
                                        </p>
                                    </div>
                                    <span className="text-sm font-medium text-foreground truncate">
                                        {report.projectId?.name || '—'}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold w-fit ${statusConf.className}`}>
                                        {statusConf.icon} {report.status}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {report.hoursWorked ? `${report.hoursWorked}h` : '—'}
                                    </span>
                                    <div className="flex items-center gap-2 justify-end">
                                        {isEditable && (
                                            <button
                                                onClick={() => navigate(`/member/weekly?edit=${report._id}`)}
                                                className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                                                title="Edit report"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => navigate(`/member/weekly?edit=${report._id}`)}
                                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                            title="View report"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 border-t border-border/30 bg-muted/10">
                        <p className="text-xs text-muted-foreground">
                            Showing {filtered.length} of {reports.length} reports
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
