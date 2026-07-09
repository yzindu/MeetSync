// frontend/src/pages/manager/ManagerDashboard.jsx
import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Loader2, Users, CheckCircle2, Clock, AlertTriangle, TrendingUp, BarChart2 } from 'lucide-react';
import {
    ResponsiveContainer,
    PieChart, Pie, Cell, Tooltip, Legend,
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    BarChart, Bar,
} from 'recharts';
import { format, parseISO } from 'date-fns';

/* ── colour palette ───────────────────────────── */
const COLORS = {
    submitted: '#4f86f7',
    pending:   '#f59e0b',
    late:      '#ef4444',
};
const BAR_COLORS = ['#4f86f7', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

/* ── tiny helpers ─────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, accent, loading }) => (
    <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm flex flex-col gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
            <Icon className="w-5 h-5" />
        </div>
        {loading
            ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            : <p className="text-4xl font-bold tracking-tighter text-foreground">{value}</p>
        }
        <p className="text-sm font-medium text-muted-foreground -mt-2">{label}</p>
    </div>
);

const SectionTitle = ({ children }) => (
    <h2 className="text-xl font-semibold text-foreground tracking-tight">{children}</h2>
);

const CUSTOM_TOOLTIP = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-border/40 px-4 py-3 text-sm">
                {label && <p className="font-semibold text-foreground mb-1">{label}</p>}
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }} className="font-medium">
                        {p.name}: {p.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function ManagerDashboard() {
    const [metrics,   setMetrics]   = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const [mRes, cRes] = await Promise.all([
                    API.get('/reports/metrics'),
                    API.get('/reports/charts'),
                ]);
                setMetrics(mRes.data);
                setChartData(cRes.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    /* ── Derived data for charts ──────────────────────── */
    const pieData = metrics ? [
        { name: 'Submitted', value: metrics.submittedReports },
        { name: 'Pending',   value: metrics.pendingReports },
        { name: 'Other',     value: Math.max(0, metrics.totalReports - metrics.submittedReports - metrics.pendingReports) },
    ].filter(d => d.value > 0) : [];

    const trendData = (chartData?.tasksTrend ?? []).map(d => ({
        week: format(parseISO(d._id), 'MMM d'),
        tasks: d.totalTasks,
        reports: d.reportCount,
    }));

    const workloadData = (chartData?.workloadByProject ?? []).map(d => ({
        project: d.projectName?.length > 14 ? d.projectName.slice(0, 13) + '…' : d.projectName,
        reports: d.reportCount,
        tasks: d.totalTasks,
    }));

    const teamData = (chartData?.statusByMember ?? []).map(d => ({
        name: d.memberName,
        submitted: d.submitted,
        pending:   d.pending,
        late:      d.late,
    }));

    if (error) return (
        <div className="flex items-center justify-center h-60 text-red-500 font-medium">{error}</div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* ── Header ── */}
            <div>
                <h1 className="text-[2.4rem] font-bold tracking-tight text-foreground leading-tight">
                    Manager Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                    Real-time overview of team performance and submission compliance.
                </p>
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard icon={BarChart2}   label="Total Reports"     value={metrics?.totalReports     ?? '—'} accent="bg-blue-100 text-blue-600"    loading={loading} />
                <StatCard icon={CheckCircle2} label="Submitted"         value={metrics?.submittedReports ?? '—'} accent="bg-emerald-100 text-emerald-600" loading={loading} />
                <StatCard icon={Clock}        label="Pending"           value={metrics?.pendingReports   ?? '—'} accent="bg-amber-100 text-amber-600"   loading={loading} />
                <StatCard icon={TrendingUp}   label="Compliance Rate"   value={metrics?.complianceRate   ?? '—'} accent="bg-violet-100 text-violet-600"  loading={loading} />
            </div>

            {/* ── Charts row 1 ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Pie: Submission Status */}
                <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm">
                    <SectionTitle>Submission Compliance</SectionTitle>
                    <p className="text-sm text-muted-foreground mb-4 mt-0.5">Overall status distribution</p>
                    {loading
                        ? <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-muted-foreground" /></div>
                        : pieData.length === 0
                            ? <p className="text-center text-muted-foreground py-12">No report data yet.</p>
                            : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110}
                                            dataKey="value" paddingAngle={3} stroke="none">
                                            {pieData.map((entry, i) => (
                                                <Cell key={i} fill={
                                                    entry.name === 'Submitted' ? COLORS.submitted
                                                    : entry.name === 'Pending' ? COLORS.pending
                                                    : COLORS.late
                                                } />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CUSTOM_TOOLTIP />} />
                                        <Legend iconType="circle" iconSize={8}
                                            formatter={(v) => <span className="text-sm text-foreground">{v}</span>} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )
                    }
                </div>

                {/* Line: Tasks completed trend */}
                <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm">
                    <SectionTitle>Tasks Completed — Weekly Trend</SectionTitle>
                    <p className="text-sm text-muted-foreground mb-4 mt-0.5">Across all submitted reports</p>
                    {loading
                        ? <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-muted-foreground" /></div>
                        : trendData.length === 0
                            ? <p className="text-center text-muted-foreground py-12">No trend data yet.</p>
                            : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <LineChart data={trendData} margin={{ top: 4, right: 16, bottom: 0, left: -20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#888' }} />
                                        <YAxis tick={{ fontSize: 12, fill: '#888' }} />
                                        <Tooltip content={<CUSTOM_TOOLTIP />} />
                                        <Line type="monotone" dataKey="tasks" name="Tasks" stroke={COLORS.submitted}
                                            strokeWidth={2.5} dot={{ r: 4, fill: COLORS.submitted }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            )
                    }
                </div>
            </div>

            {/* ── Charts row 2 ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Bar: Workload by Project */}
                <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm">
                    <SectionTitle>Workload by Project</SectionTitle>
                    <p className="text-sm text-muted-foreground mb-4 mt-0.5">Number of reports submitted per project</p>
                    {loading
                        ? <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-muted-foreground" /></div>
                        : workloadData.length === 0
                            ? <p className="text-center text-muted-foreground py-12">No project data yet.</p>
                            : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart data={workloadData} margin={{ top: 4, right: 16, bottom: 0, left: -20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="project" tick={{ fontSize: 11, fill: '#888' }} />
                                        <YAxis tick={{ fontSize: 12, fill: '#888' }} />
                                        <Tooltip content={<CUSTOM_TOOLTIP />} />
                                        <Bar dataKey="reports" name="Reports" radius={[6, 6, 0, 0]}>
                                            {workloadData.map((_, i) => (
                                                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )
                    }
                </div>

                {/* Table: Team submission status */}
                <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm">
                    <SectionTitle>Team Submission Status</SectionTitle>
                    <p className="text-sm text-muted-foreground mb-4 mt-0.5">Per-member breakdown</p>

                    {loading
                        ? <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-muted-foreground" /></div>
                        : teamData.length === 0
                            ? <p className="text-center text-muted-foreground py-12">No team data yet.</p>
                            : (
                                <div className="divide-y divide-border/40">
                                    {teamData.map((m, i) => {
                                        const total = m.submitted + m.pending + m.late;
                                        const pct = total > 0 ? Math.round((m.submitted / total) * 100) : 0;
                                        return (
                                            <div key={i} className="py-3 flex items-center gap-4">
                                                {/* Avatar */}
                                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                                                    {m.name?.charAt(0)?.toUpperCase() ?? '?'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                                                    <div className="h-1.5 mt-1.5 rounded-full bg-muted overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full bg-primary transition-all"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0 text-xs font-medium">
                                                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">{m.submitted} done</span>
                                                    {m.pending > 0 && <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">{m.pending} pending</span>}
                                                    {m.late    > 0 && <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700">{m.late} late</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                    }
                </div>
            </div>

        </div>
    );
}
