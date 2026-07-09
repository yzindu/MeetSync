// frontend/src/pages/manager/ProjectsManager.jsx
import { useState, useEffect } from 'react';
import API from '../../api/axios';
import {
    Plus, Pencil, Trash2, Loader2, FolderKanban,
    X, Check, AlertTriangle, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';

/* ── helpers ── */
function Tag({ label, color }) {
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${color}`}>{label}</span>
    );
}

const STATUS_COLORS = {
    Active:    'bg-emerald-50 text-emerald-700',
    Completed: 'bg-blue-50 text-blue-700',
    OnHold:    'bg-amber-50 text-amber-700',
};

/* ── Project Form Modal ── */
function ProjectModal({ project, onClose, onSave }) {
    const isEdit = Boolean(project?._id);
    const [form, setForm] = useState({
        name:        project?.name        ?? '',
        description: project?.description ?? '',
        status:      project?.status      ?? 'Active',
    });
    const [saving, setSaving] = useState(false);
    const [error,  setError]  = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) { setError('Project name is required.'); return; }
        setSaving(true);
        setError('');
        try {
            if (isEdit) {
                const { data } = await API.put(`/projects/${project._id}`, form);
                onSave(data, 'edit');
            } else {
                const { data } = await API.post('/projects/create', form);
                onSave(data, 'create');
            }
            onClose();
        } catch (err) {
            setError(err.response?.data?.message ?? 'Something went wrong.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/40">
                    <h2 className="text-lg font-bold text-foreground">
                        {isEdit ? 'Edit Project' : 'New Project'}
                    </h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-lg px-4 py-3 text-sm border border-red-100">
                            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1.5">Project Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="e.g. Website Redesign"
                            className="w-full px-4 py-2.5 rounded-lg border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1.5">Description</label>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="Brief description of the project…"
                            className="w-full px-4 py-2.5 rounded-lg border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                        />
                    </div>

                    {isEdit && (
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-1.5">Status</label>
                            <select
                                value={form.status}
                                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                                className="w-full px-4 py-2.5 rounded-lg border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-white"
                            >
                                <option value="Active">Active</option>
                                <option value="Completed">Completed</option>
                                <option value="OnHold">On Hold</option>
                            </select>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} className="rounded-lg">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving} className="rounded-lg gap-2 bg-primary hover:bg-primary/90">
                            {saving
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                                : <><Check className="w-4 h-4" /> {isEdit ? 'Save Changes' : 'Create Project'}</>
                            }
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Delete Confirm Modal ── */
function DeleteModal({ project, onClose, onConfirm }) {
    const [deleting, setDeleting] = useState(false);
    const handleDelete = async () => {
        setDeleting(true);
        await onConfirm(project._id);
        setDeleting(false);
        onClose();
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-red-600" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">Delete Project?</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Are you sure you want to deactivate <span className="font-semibold text-foreground">"{project.name}"</span>?
                    This will hide the project from members but preserve historical report data.
                </p>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="rounded-lg">Cancel</Button>
                    <Button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="rounded-lg bg-destructive hover:bg-destructive/90 text-white gap-2"
                    >
                        {deleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</> : <><Trash2 className="w-4 h-4" /> Delete</>}
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* ── Toast ── */
function Toast({ msg, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-bottom-4 ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
            {type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {msg}
        </div>
    );
}

/* ── Main Page ── */
export default function ProjectsManager() {
    const [projects, setProjects] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [search,   setSearch]   = useState('');

    const [modalProject, setModalProject] = useState(null); // null = closed, {} = new, {_id,...} = edit
    const [modalOpen,    setModalOpen]    = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => setToast({ msg, type });

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/projects');
            setProjects(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    const handleSave = (savedProject, mode) => {
        if (mode === 'create') {
            setProjects(p => [savedProject, ...p]);
            showToast('Project created successfully!');
        } else {
            setProjects(p => p.map(x => x._id === savedProject._id ? savedProject : x));
            showToast('Project updated successfully!');
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/projects/${id}`);
            setProjects(p => p.filter(x => x._id !== id));
            showToast('Project deleted.');
        } catch (err) {
            showToast('Failed to delete project.', 'error');
        }
    };

    const filtered = projects.filter(p =>
        !search || p.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-[2.4rem] font-bold tracking-tight text-foreground leading-tight">Projects</h1>
                        <p className="text-muted-foreground mt-1">Create, update, and manage all team projects.</p>
                    </div>
                    <Button
                        onClick={() => { setModalProject({}); setModalOpen(true); }}
                        className="gap-2 h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 shadow-sm hover:scale-[1.02] transition-all"
                    >
                        <Plus className="w-4 h-4" /> New Project
                    </Button>
                </div>

                {/* Search */}
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search projects…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border/60 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition shadow-sm"
                    />
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Loading projects…
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                        <FolderKanban className="w-12 h-12 opacity-25" />
                        <p className="font-medium">{search ? 'No projects match your search.' : 'No projects yet. Create your first one!'}</p>
                        {!search && (
                            <Button onClick={() => { setModalProject({}); setModalOpen(true); }} className="mt-2 gap-2">
                                <Plus className="w-4 h-4" /> Create Project
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filtered.map(project => (
                            <ProjectCard
                                key={project._id}
                                project={project}
                                onEdit={() => { setModalProject(project); setModalOpen(true); }}
                                onDelete={() => setDeleteTarget(project)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {modalOpen && (
                <ProjectModal
                    project={modalProject}
                    onClose={() => { setModalOpen(false); setModalProject(null); }}
                    onSave={handleSave}
                />
            )}
            {deleteTarget && (
                <DeleteModal
                    project={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                />
            )}

            {/* Toast */}
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
}

/* ── Project Card ── */
function ProjectCard({ project, onEdit, onDelete }) {
    const statusColor = STATUS_COLORS[project.status] ?? 'bg-muted text-muted-foreground';
    const statusLabel = project.status === 'OnHold' ? 'On Hold' : project.status;

    return (
        <div className="bg-white rounded-2xl border border-border/40 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
            {/* Icon + status */}
            <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FolderKanban className="w-5 h-5 text-primary" />
                </div>
                <Tag label={statusLabel} color={statusColor} />
            </div>

            {/* Name + description */}
            <div>
                <h3 className="text-base font-bold text-foreground leading-snug">{project.name}</h3>
                {project.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {project.description}
                    </p>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-border/30 mt-auto">
                <p className="text-[11px] text-muted-foreground">
                    {project.createdAt ? `Created ${format(parseISO(project.createdAt), 'MMM d, yyyy')}` : ''}
                </p>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onEdit}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Edit"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
