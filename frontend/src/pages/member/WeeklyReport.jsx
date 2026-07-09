import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../../api/axios';
import { format, addDays, parseISO } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

import { Calendar, History, CheckCircle2, TrendingUp, AlertTriangle, Send, RefreshCw, Clock, Loader2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

// Helper: parse textarea into array (split by newline, filter blanks)
const toArray = (str) => str.split('\n').map(s => s.trim()).filter(Boolean);
const toText = (arr) => (Array.isArray(arr) ? arr.join('\n') : arr || '');

export default function WeeklyReport() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    const isEditing = Boolean(editId);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [recentReports, setRecentReports] = useState([]);
    const [loadingReports, setLoadingReports] = useState(true);
    const [notes, setNotes] = useState('');

    // Form State
    const [date, setDate] = useState({
        from: new Date(),
        to: addDays(new Date(), 6),
    });
    const [projectId, setProjectId] = useState('');
    const [hours, setHours] = useState('');
    const [completed, setCompleted] = useState('');
    const [planned, setPlanned] = useState('');
    const [blockers, setBlockers] = useState('');

    // Load projects and recent reports on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projRes, repRes] = await Promise.all([
                    API.get('/projects'),
                    API.get('/reports/me')
                ]);
                setProjects(projRes.data);
                setRecentReports(repRes.data.slice(0, 3));
            } catch (err) {
                toast.error('Failed to load data');
            } finally {
                setLoadingProjects(false);
                setLoadingReports(false);
            }
        };
        fetchData();
    }, []);

    // If editing, load report data
    useEffect(() => {
        if (!editId) return;
        const fetchReport = async () => {
            try {
                const { data } = await API.get(`/reports/${editId}`);
                setProjectId(data.projectId?._id || data.projectId);
                setDate({ from: parseISO(data.weekStartDate), to: parseISO(data.weekEndDate) });
                setHours(data.hoursWorked?.toString() || '');
                setCompleted(toText(data.tasksCompleted));
                setPlanned(toText(data.tasksPlanned));
                setBlockers(toText(data.blockers));
                setNotes(data.notes || '');
            } catch {
                toast.error('Failed to load report for editing');
            }
        };
        fetchReport();
    }, [editId]);

    const handleSubmit = async (e, submitStatus) => {
        e.preventDefault();
        if (!projectId) { toast.error('Please select a project'); return; }
        if (!date?.from || !date?.to) { toast.error('Please select a week range'); return; }

        setIsSubmitting(true);
        const payload = {
            projectId,
            weekStartDate: date.from,
            weekEndDate: date.to,
            tasksCompleted: toArray(completed),
            tasksPlanned: toArray(planned),
            blockers: toArray(blockers),
            hoursWorked: hours ? Number(hours) : undefined,
            notes,
            status: submitStatus
        };

        try {
            if (isEditing) {
                await API.put(`/reports/${editId}`, payload);
                toast.success(submitStatus === 'Submitted' ? 'Report submitted!' : 'Draft saved!');
            } else {
                await API.post('/reports', payload);
                toast.success(submitStatus === 'Submitted' ? 'Weekly report submitted!' : 'Draft saved!');
            }
            navigate('/member/reports');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusStyles = (status) => {
        if (status === 'Submitted') return 'bg-emerald-50 text-emerald-600';
        if (status === 'Late') return 'bg-red-50 text-red-600';
        return 'bg-orange-50 text-orange-600';
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[2.5rem] font-bold tracking-tight text-foreground leading-tight">
                        {isEditing ? 'Edit Report' : 'Weekly Report'}
                    </h1>
                    <p className="text-muted-foreground text-base mt-1">
                        {isEditing
                            ? 'Update your report details below.'
                            : 'Update your team on progress, blockers, and upcoming priorities.'}
                    </p>
                </div>

                {/* Date Range Picker */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="gap-2 h-11 bg-white border-border/50 shadow-sm rounded-xl w-[260px] justify-start text-left font-medium">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-foreground">
                                {date?.from ? (
                                    date.to
                                        ? `Week of ${format(date.from, 'MMM d')} – ${format(date.to, 'MMM d')}`
                                        : format(date.from, 'MMM d')
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <CalendarComponent
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={1}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Main Layout Grid */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* Left Form Area */}
                <div className="flex-1 bg-white rounded-3xl p-8 border border-border/40 shadow-sm">
                    <form onSubmit={(e) => handleSubmit(e, 'Submitted')} className="space-y-8">

                        {/* Top Row: Project & Hours */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                    Primary Project
                                </label>
                                {loadingProjects ? (
                                    <div className="h-12 bg-[#f8f9fc] rounded-xl flex items-center px-4 text-sm text-muted-foreground gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Loading projects...
                                    </div>
                                ) : (
                                    <Select value={projectId} onValueChange={setProjectId}>
                                        <SelectTrigger className="h-12 bg-[#f8f9fc] border-transparent focus:bg-white focus:ring-1 focus:ring-primary transition-all rounded-xl shadow-none">
                                            <SelectValue placeholder="Select a project" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {projects.length === 0 ? (
                                                <SelectItem value="none" disabled>No projects available</SelectItem>
                                            ) : (
                                                projects.map(p => (
                                                    <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                    Hours Logged <span className="font-normal normal-case">(optional)</span>
                                </label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        min="0"
                                        max="168"
                                        placeholder="0"
                                        value={hours}
                                        onChange={(e) => setHours(e.target.value)}
                                        className="h-12 bg-[#f8f9fc] border-transparent focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-primary transition-all rounded-xl shadow-none pr-12 font-medium"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">hrs</span>
                                </div>
                            </div>
                        </div>

                        {/* Tasks Completed */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-muted-foreground uppercase mb-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Tasks Completed
                                <span className="ml-1 font-normal normal-case text-[10px] text-muted-foreground/60">(one per line)</span>
                            </label>
                            <Textarea
                                placeholder={"Finished landing page redesign\nFixed login bug\nReviewed PRs"}
                                value={completed}
                                onChange={(e) => setCompleted(e.target.value)}
                                required
                                className="min-h-[140px] resize-none bg-[#f8f9fc] border-transparent focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-primary transition-all rounded-2xl shadow-none p-4"
                            />
                        </div>

                        {/* Tasks Planned */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-muted-foreground uppercase mb-2">
                                <TrendingUp className="w-3.5 h-3.5 text-primary" /> Priorities for Next Week
                                <span className="ml-1 font-normal normal-case text-[10px] text-muted-foreground/60">(one per line)</span>
                            </label>
                            <Textarea
                                placeholder={"Deploy v2 to staging\nStart API documentation\nTeam sync meeting"}
                                value={planned}
                                onChange={(e) => setPlanned(e.target.value)}
                                required
                                className="min-h-[140px] resize-none bg-[#f8f9fc] border-transparent focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-primary transition-all rounded-2xl shadow-none p-4"
                            />
                        </div>

                        {/* Blockers */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-orange-500 uppercase mb-2">
                                <AlertTriangle className="w-3.5 h-3.5" /> Blockers & Risks
                                <span className="ml-1 font-normal normal-case text-[10px] text-muted-foreground/60">(optional, one per line)</span>
                            </label>
                            <Textarea
                                placeholder={"Waiting on design assets from UI team\nAPI rate limits blocking integration tests"}
                                value={blockers}
                                onChange={(e) => setBlockers(e.target.value)}
                                className="min-h-[120px] resize-none bg-[#f8f9fc] border-transparent focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-orange-500 transition-all rounded-2xl shadow-none p-4"
                            />
                        </div>

                        {/* Optional Notes / Links */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                Notes & Links <span className="font-normal normal-case">(optional)</span>
                            </label>
                            <Textarea
                                placeholder="Any additional context, PR links, doc links..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="min-h-[80px] resize-none bg-[#f8f9fc] border-transparent focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-primary transition-all rounded-2xl shadow-none p-4"
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-border/40 gap-4">
                            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                                <RefreshCw className="w-3.5 h-3.5" />
                                {isEditing ? 'Editing existing report' : 'Ready to submit'}
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-primary font-semibold hover:bg-primary/10"
                                    disabled={isSubmitting}
                                    onClick={(e) => handleSubmit(e, 'Pending')}
                                >
                                    Save Draft
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto gap-2 h-11 px-6 rounded-xl shadow-md bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02]"
                                >
                                    {isSubmitting
                                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                        : <>{isEditing ? 'Update Report' : 'Submit Report'} <Send className="w-4 h-4" /></>
                                    }
                                </Button>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Right Sidebar: Recent History */}
                <div className="w-full lg:w-[320px] bg-white rounded-3xl p-6 border border-border/40 shadow-sm h-fit">
                    <div className="flex items-center gap-2 mb-6">
                        <History className="w-5 h-5 text-foreground" />
                        <h2 className="text-xl font-semibold tracking-tight">Recent History</h2>
                    </div>

                    {loadingReports ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                            <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                        </div>
                    ) : recentReports.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">No reports submitted yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {recentReports.map(r => (
                                <div
                                    key={r._id}
                                    onClick={() => navigate(`/member/weekly?edit=${r._id}`)}
                                    className="bg-[#f8f9fc] p-4 rounded-2xl border border-transparent hover:border-border/50 transition-colors cursor-pointer"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-foreground">
                                            {format(parseISO(r.weekStartDate), 'MMM d')} – {format(parseISO(r.weekEndDate), 'MMM d')}
                                        </span>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${getStatusStyles(r.status)}`}>
                                            {r.status === 'Submitted' && <CheckCircle2 className="w-3 h-3" />}
                                            {r.status === 'Late' && <AlertTriangle className="w-3 h-3" />}
                                            {r.status === 'Pending' && <Clock className="w-3 h-3" />}
                                            {r.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium">{r.projectId?.name || 'No project'}</p>
                                    <p className="text-xs text-muted-foreground truncate mt-1">
                                        {Array.isArray(r.tasksCompleted) ? r.tasksCompleted[0] : r.tasksCompleted}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    <Button
                        variant="outline"
                        className="w-full h-11 rounded-xl bg-white shadow-sm border-border/50 font-semibold text-foreground mt-6"
                        onClick={() => navigate('/member/history')}
                    >
                        View All Reports
                    </Button>
                </div>

            </div>
        </div>
    );
}