// frontend/src/pages/manager/TeamReports.jsx
import { useState, useEffect, useCallback } from 'react';
import API from '../../api/axios';
import { format, parseISO } from 'date-fns';
import {
    Search, Filter, ChevronDown, X, Loader2, FileText,
    CheckCircle2, Clock, AlertTriangle, Eye, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ── helpers ── */
const STATUS_CONFIG = {
    Submitted: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle2 },
    Pending: { cls: 'bg-amber-50   text-amber-700   border-amber-100', icon: Clock },
    Late: { cls: 'bg-red-50     text-red-700     border-red-100', icon: AlertTriangle },
};

const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.Pending;
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${cfg.cls}`}>
            <Icon className="w-3 h-3" /> {status}
        </span>
    );
};

/* ── Detail Modal ── */
function ReportModal({ report, onClose }) {
    if (!report) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-border/40">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">{report.projectId?.name ?? 'Unknown Project'}</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {format(parseISO(report.weekStartDate), 'MMM d')} – {format(parseISO(report.weekEndDate), 'MMM d, yyyy')}
                            &nbsp;·&nbsp; by <span className="font-medium text-foreground">{report.userId?.name ?? 'Unknown'}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={report.status} />
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {/* Hours */}
                    {report.hoursWorked && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span><span className="font-semibold text-foreground">{report.hoursWorked}</span> hours worked</span>
                        </div>
                    )}

                    <Section title="✅ Tasks Completed" items={report.tasksCompleted} empty="None listed." />
                    <Section title="📋 Tasks Planned" items={report.tasksPlanned} empty="None listed." />
                    <Section title="🚧 Blockers" items={report.blockers} empty="No blockers." accent />

                    {report.notes && (
                        <div>
                            <p className="text-sm font-semibold text-foreground mb-1">📝 Notes</p>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{report.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Section({ title, items, empty, accent }) {
    const arr = Array.isArray(items) ? items : (items ? [items] : []);
    return (
        <div>
            <p className="text-sm font-semibold text-foreground mb-2">{title}</p>
            {arr.length === 0
                ? <p className="text-sm text-muted-foreground italic">{empty}</p>
                : (
                    <ul className="space-y-1">
                        {arr.map((item, i) => (
                            <li key={i} className={`text-sm flex items-start gap-2 ${accent ? 'text-red-700' : 'text-muted-foreground'}`}>
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                )
            }
        </div>
    );
}

/* ── Main component ── */
const PAGE_SIZE = 10;

export default function TeamReports() {
    const [reports, setReports] = useState([]);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    // Filters
    const [search, setSearch] = useState('');
    const [filterUser, setFilterUser] = useState('');
    const [filterProject, setFilterProject] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // Pagination
    const [page, setPage] = useState(1);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (filterUser) params.userId = filterUser;
            if (filterProject) params.projectId = filterProject;
            if (filterStatus) params.status = filterStatus;

            const [rRes, uRes, pRes] = await Promise.all([
                API.get('/reports', { params }),
                API.get('/users'),
                API.get('/projects'),
            ]);
            setReports(rRes.data);
            setUsers(uRes.data);
            setProjects(pRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filterUser, filterProject, filterStatus]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // Reset page on filter change
    useEffect(() => { setPage(1); }, [search, filterUser, filterProject, filterStatus]);

    // Client-side search (name / project)
    const filtered = reports.filter(r => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            r.userId?.name?.toLowerCase().includes(q) ||
            r.projectId?.name?.toLowerCase().includes(q)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const clearFilters = () => {
        setSearch('');
        setFilterUser('');
        setFilterProject('');
        setFilterStatus('');
    };
    const hasFilters = search || filterUser || filterProject || filterStatus;

    return (
        <>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Header */}
                <div>
                    <h1 className="text-[2.4rem] font-bold tracking-tight text-foreground leading-tight">Team Reports</h1>
                    <p className="text-muted-foreground mt-1">Browse, filter, and inspect all member submissions.</p>
                </div>

                {/* Filter bar */}
                <div className="bg-white rounded-2xl border border-border/40 shadow-sm p-4 flex flex-wrap gap-3 items-center">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search member or project…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border/60 text-sm bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                        />
                    </div>

                    {/* Member filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <select
                            value={filterUser}
                            onChange={e => setFilterUser(e.target.value)}
                            className="appearance-none pl-8 pr-8 py-2.5 rounded-lg border border-border/60 text-sm bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                        >
                            <option value="">All Members</option>
                            {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                    </div>

                    {/* Project filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <select
                            value={filterProject}
                            onChange={e => setFilterProject(e.target.value)}
                            className="appearance-none pl-8 pr-8 py-2.5 rounded-lg border border-border/60 text-sm bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                        >
                            <option value="">All Projects</option>
                            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                    </div>

                    {/* Status filter */}
                    <div className="relative">
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="appearance-none pl-4 pr-8 py-2.5 rounded-lg border border-border/60 text-sm bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                        >
                            <option value="">All Statuses</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Pending">Pending</option>
                            <option value="Late">Late</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                    </div>

                    {hasFilters && (
                        <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors">
                            <X className="w-3.5 h-3.5" /> Clear
                        </button>
                    )}

                    <span className="ml-auto text-sm text-muted-foreground font-medium">
                        {filtered.length} report{filtered.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-border/40 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" /> Loading…
                        </div>
                    ) : paginated.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                            <FileText className="w-10 h-10 opacity-30" />
                            <p>No reports match your filters.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/40 bg-muted/30">
                                        <th className="text-left px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Member</th>
                                        <th className="text-left px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project</th>
                                        <th className="text-left px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Week</th>
                                        <th className="text-left px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hours</th>
                                        <th className="text-left px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                        <th className="text-right px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {paginated.map(r => (
                                        <tr key={r._id} className="hover:bg-muted/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                                                        {r.userId?.name?.charAt(0)?.toUpperCase() ?? '?'}
                                                    </div>
                                                    <span className="font-medium text-foreground truncate max-w-[140px]">
                                                        {r.userId?.name ?? 'Unknown'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-foreground font-medium truncate max-w-[160px]">
                                                {r.projectId?.name ?? '—'}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                                {format(parseISO(r.weekStartDate), 'MMM d')} – {format(parseISO(r.weekEndDate), 'MMM d')}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {r.hoursWorked ? `${r.hoursWorked}h` : '—'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={r.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelected(r)}
                                                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-semibold text-xs transition-colors"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && filtered.length > PAGE_SIZE && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-border/40">
                            <p className="text-sm text-muted-foreground">
                                Page {page} of {totalPages}
                            </p>
                            <div className="flex items-center gap-1">
                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg"
                                    disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg"
                                    disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {selected && <ReportModal report={selected} onClose={() => setSelected(null)} />}
        </>
    );
}
