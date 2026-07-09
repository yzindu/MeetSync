// frontend/src/pages/member/Reports.jsx
import { Button } from '@/components/ui/button';
import { Plus, ListFilter, ClipboardList, CheckCircle2, Clock, AlertTriangle, Eye, ArrowRight } from 'lucide-react';

export default function Reports() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[2.5rem] font-bold tracking-tight text-foreground leading-tight">My Reports</h1>
                    <p className="text-muted-foreground text-base mt-1">Manage your submitted reports and track upcoming deadlines.</p>
                </div>
                <Button className="gap-2 h-11 px-6 rounded-lg shadow-md bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02]">
                    <Plus className="w-5 h-5" /> Submit New Report
                </Button>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Pending Card */}
                <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm flex flex-col justify-between h-[160px]">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <ClipboardList className="w-4 h-4 text-primary" />
                        </div>
                        Pending
                    </div>
                    <div className="flex items-baseline gap-2 mt-4">
                        <span className="text-5xl font-bold tracking-tighter">3</span>
                        <span className="text-muted-foreground text-sm font-medium">reports due</span>
                    </div>
                </div>

                {/* Submitted Card */}
                <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm flex flex-col justify-between h-[160px]">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-slate-500" />
                        </div>
                        Submitted
                    </div>
                    <div className="flex items-baseline gap-2 mt-4">
                        <span className="text-5xl font-bold tracking-tighter">12</span>
                        <span className="text-muted-foreground text-sm font-medium">this month</span>
                    </div>
                </div>

                {/* On Track Card */}
                <div className="bg-gradient-to-br from-[#eef0f6] to-[#e4e7f1] rounded-2xl p-6 border border-white/50 shadow-sm flex flex-col justify-center h-[160px]">
                    <h3 className="text-xl font-semibold text-foreground mb-2">On Track</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed pr-4">
                        You have a 100% completion rate this quarter.
                    </p>
                </div>

            </div>

            {/* Recent Reports Section */}
            <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Recent Reports</h2>
                    <Button variant="outline" size="sm" className="gap-2 h-9 rounded-md bg-muted/30 border-border/50">
                        <ListFilter className="w-4 h-4" /> Filter
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Card 1: Pending */}
                    <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">OCT 23 - OCT 29</span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-50 text-orange-600 border border-orange-100">
                                <Clock className="w-3 h-3" /> Pending
                            </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 leading-snug">Q4 Alpha Release</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-8 flex-1">
                            Weekly progress update on alpha release features and QA testing metrics.
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-border/40">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white" />
                                <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white" />
                            </div>
                            <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                                Complete <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Card 2: Submitted */}
                    <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">OCT 16 - OCT 22</span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                <CheckCircle2 className="w-3 h-3" /> Submitted
                            </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 leading-snug">Project Nexus Setup</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-8 flex-1">
                            Infrastructure deployment status and initial security audit results.
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-border/40">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white" />
                            </div>
                            <button className="text-sm font-bold text-slate-500 flex items-center gap-1 hover:text-slate-800 transition-colors">
                                View <Eye className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Card 3: Late (Red Border) */}
                    <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm flex flex-col relative overflow-hidden">
                        {/* Subtle red glow on the edge */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-400/20" />

                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">OCT 09 - OCT 15</span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-50 text-red-600 border border-red-100">
                                <AlertTriangle className="w-3 h-3" /> Late
                            </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 leading-snug">Design System V2</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-8 flex-1">
                            Finalization of glassmorphic tokens and component documentation.
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-border/40">
                            <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> 2 days overdue
                            </span>
                            <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                                Submit Now <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}