import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Loader2, FolderOpen, Layers } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await API.get('/projects');
                setProjects(data);
            } catch {
                toast.error('Failed to load projects');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div>
                <h1 className="text-[2.5rem] font-bold tracking-tight text-foreground leading-tight">Projects</h1>
                <p className="text-muted-foreground text-base mt-1">
                    Active projects and categories you can tag in your weekly reports.
                </p>
            </div>

            {loading ? (
                <div className="flex items-center gap-3 py-16 justify-center text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" /> Loading projects...
                </div>
            ) : projects.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 border border-border/40 shadow-sm text-center">
                    <FolderOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-foreground mb-1">No projects yet</h3>
                    <p className="text-sm text-muted-foreground">Ask your manager to add projects so you can tag them in reports.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {projects.map(project => (
                        <div
                            key={project._id}
                            className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                <Layers className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-base font-bold text-foreground mb-1">{project.name}</h3>
                            {project.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                            )}
                            <div className="mt-4 pt-4 border-t border-border/30">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                    Active
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
