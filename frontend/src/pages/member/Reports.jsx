import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { format, parseISO } from 'date-fns';
import { Plus, ListFilter, ClipboardList, CheckCircle2, Clock, AlertTriangle, Eye, ArrowRight, Loader2, TrendingUp } from 'lucide-react';

export default function Reports() {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data } = await API.get('/reports/me');
                setReports(data);
            } catch (err) {
                console.error('Failed to fetch reports', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const pendingCount = reports.filter(r => r.status === 'Pending').length;
    const submittedCount = reports.filter(r => r.status === 'Submitted').length;
    const lateCount = reports.filter(r => r.status === 'Late').length;
    const complianceRate = reports.length > 0
        ? Math.round((submittedCount / reports.length) * 100)
        : 100;

    const recentReports = reports.slice(0, 6);

    const getStatusConfig = (status) => {
        if (status === 'Submitted') return {
            icon: <CheckCircle2 className="w-3 h-3" />,
            className: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
            borderClass: 'border-border/40',
            actionLabel: 'View', actionIcon: <Eye className="w-4 h-4" />
        };
        if (status === 'Late') return {
            icon: <AlertTriangle className="w-3 h-3" />,
            className: 'bg-red-50 text-red-600 border border-red-100',
            borderClass: 'border-red-200',
            actionLabel: 'Submit Now', actionIcon: <ArrowRight className="w-4 h-4" />
        };
        return {
            icon: <Clock className="w-3 h-3" />,
            className: 'bg-orange-50 text-orange-600 border border-orange-100',
            borderClass: 'border-border/40',
            actionLabel: 'Complete', actionIcon: <ArrowRight className="w-4 h-4" />
        };
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[2.5rem] font-bold tracking-tight text-foreground leading-tight">My Reports</h1>
                    <p className="text-muted-foreground text-base mt-1">Manage your submitted reports and track upcoming deadlines.</p>
                </div>
                <Button
                    onClick={() => navigate('/member/weekly')}
                    className="gap-2 h-11 px-6 rounded-lg shadow-md bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02]"
                >
                    <Plus className="w-5 h-5" /> Submit New Report
                </Button>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Pending Card */}
                <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm flex flex-col justify-between h-[160px]">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <ClipboardList className="w-4 h-4 text-orange-500" />
                        </div>
                        Pending / Late
                    </div>
                    <div className="flex items-baseline gap-2 mt-4">
                        {loading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : (
                            <>
                                <span className="text-5xl font-bold tracking-tighter">{pendingCount + lateCount}</span>
                                <span className="text-muted-foreground text-sm font-medium">reports due</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Submitted Card */}
                <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm flex flex-col justify-between h-[160px]">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        Submitted
                    </div>
                    <div className="flex items-baseline gap-2 mt-4">
                        {loading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : (
                            <>
                                <span className="text-5xl font-bold tracking-tighter">{submittedCount}</span>
                                <span className="text-muted-foreground text-sm font-medium">total</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Compliance Card */}
                <div className="bg-linear-to-br from-[#eef0f6] to-[#e4e7f1] rounded-2xl p-6 border border-white/50 shadow-sm flex flex-col justify-center h-[160px]">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-semibold text-muted-foreground">Compliance Rate</h3>
                    </div>
                    {loading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mt-2" /> : (
                        <>
                            <p className="text-4xl font-bold text-foreground mt-1">{complianceRate}%</p>
                            <p className="text-muted-foreground text-sm leading-relaxed mt-1">
                                {complianceRate === 100 ? 'Perfect submission record!' : `${submittedCount} of ${reports.length} reports submitted`}
                            </p>
                        </>
                    )}
                </div>

            </div>

            {/* Recent Reports Section */}
            <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Recent Reports</h2>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 h-9 rounded-md bg-muted/30 border-border/50"
                        onClick={() => navigate('/member/history')}
                    >
                        <ListFilter className="w-4 h-4" /> View All
                    </Button>
                </div>

                {loading ? (
                    <div className="flex items-center gap-3 py-12 justify-center text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin" /> Loading reports...
                    </div>
                ) : recentReports.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 border border-border/40 shadow-sm text-center">
                        <ClipboardList className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-foreground mb-1">No reports yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">Submit your first weekly report to get started.</p>
                        <Button
                            onClick={() => navigate('/member/weekly')}
                            className="gap-2 bg-primary hover:bg-primary/90"
                        >
                            <Plus className="w-4 h-4" /> Create Report
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentReports.map(report => {
                            const config = getStatusConfig(report.status);
                            const isActionable = report.status !== 'Submitted';
                            return (
                                <div key={report._id} className={`bg-white rounded-2xl p-6 border ${config.borderClass} shadow-sm flex flex-col relative overflow-hidden`}>
                                    {report.status === 'Late' && <div className="absolute top-0 left-0 w-full h-1 bg-red-400/30" />}

                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            {format(parseISO(report.weekStartDate), 'MMM d')} – {format(parseISO(report.weekEndDate), 'MMM d, yyyy')}
                                        </span>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold ${config.className}`}>
                                            {config.icon} {report.status}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-semibold mb-1 leading-snug">{report.projectId?.name || 'Unknown Project'}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-auto flex-1">
                                        {Array.isArray(report.tasksCompleted)
                                            ? report.tasksCompleted.join(' · ')
                                            : report.tasksCompleted}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-4">
                                        {report.hoursWorked ? (
                                            <span className="text-xs text-muted-foreground font-medium">{report.hoursWorked} hrs logged</span>
                                        ) : <span />}
                                        <button
                                            onClick={() => isActionable
                                                ? navigate(`/member/weekly?edit=${report._id}`)
                                                : navigate(`/member/history`)}
                                            className={`text-sm font-bold flex items-center gap-1 hover:underline ${isActionable ? 'text-primary' : 'text-slate-500 hover:text-slate-800'}`}
                                        >
                                            {config.actionLabel} {config.actionIcon}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}