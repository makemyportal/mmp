import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X, Save, FolderKanban, AlertTriangle, ExternalLink } from 'lucide-react';

const ProjectsTab = ({ projects, addProject, updateProject, deleteProject, showToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({ title: '', description: '', imageUrl: '', category: '', techStack: '', liveUrl: '' });
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const deleteTimer = useRef(null);

    const openModal = (project = null) => {
        if (project) {
            setEditing(project);
            setFormData({
                title: project.title, description: project.description || '',
                imageUrl: project.imageUrl || '', category: project.category || '',
                techStack: (project.techStack || []).join(', '), liveUrl: project.liveUrl || ''
            });
        } else {
            setEditing(null);
            setFormData({ title: '', description: '', imageUrl: '', category: '', techStack: '', liveUrl: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...formData, techStack: formData.techStack.split(',').map(t => t.trim()).filter(t => t) };
        try {
            if (editing) {
                await updateProject(editing.id, data);
                showToast(`"${formData.title}" updated!`, 'success');
            } else {
                await addProject(data);
                showToast(`"${formData.title}" added!`, 'success');
            }
            setIsModalOpen(false);
            setEditing(null);
        } catch (err) {
            showToast('Error saving project', 'error');
        }
    };

    const handleDelete = async (e, project) => {
        e.stopPropagation();
        if (deleteConfirm === project.id) {
            clearTimeout(deleteTimer.current);
            try {
                await deleteProject(project.id);
                showToast(`"${project.title}" removed`, 'success');
            } catch { showToast('Delete failed', 'error'); }
            setDeleteConfirm(null);
        } else {
            setDeleteConfirm(project.id);
            clearTimeout(deleteTimer.current);
            deleteTimer.current = setTimeout(() => setDeleteConfirm(null), 3000);
        }
    };

    const filtered = projects.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 font-heading">Project Portfolio</h2>
                    <p className="text-sm text-gray-500 mt-1">{projects.length} projects</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" />
                    </div>
                    <button onClick={() => openModal()}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white font-semibold text-sm hover:bg-opacity-90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                        <Plus className="w-4 h-4" /> Add Project
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(project => (
                    <motion.div key={project.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-all group">
                        <div className="h-36 bg-white relative overflow-hidden">
                            {project.imageUrl ? (
                                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                                    onError={e => { e.target.style.display = 'none'; }} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400"><FolderKanban className="w-10 h-10" /></div>
                            )}
                            <div className="absolute top-3 right-3 flex gap-1.5">
                                <button onClick={() => openModal(project)} className="p-2 rounded-lg bg-white/80 backdrop-blur text-gray-900 hover:bg-brand-primary transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                <button onClick={(e) => handleDelete(e, project)}
                                    className={`p-2 rounded-lg backdrop-blur transition-all ${deleteConfirm === project.id ? 'bg-red-500 text-white animate-pulse' : 'bg-white/80 text-red-400 hover:bg-red-500 hover:text-white'}`}>
                                    {deleteConfirm === project.id ? <AlertTriangle className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                            {project.category && (
                                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/80 backdrop-blur text-gray-900 border border-gray-200 uppercase tracking-wider">
                                    {project.category}
                                </span>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="text-base font-bold text-gray-900 mb-1">{project.title}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{project.description}</p>
                            {project.techStack?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {project.techStack.slice(0, 4).map((t, i) => (
                                        <span key={i} className="px-2 py-0.5 text-[10px] font-bold bg-brand-primary/10 text-brand-primary rounded-md">{t}</span>
                                    ))}
                                </div>
                            )}
                            {project.liveUrl && (
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-primary font-medium flex items-center gap-1 hover:underline">
                                    <ExternalLink className="w-3 h-3" /> Live Demo
                                </a>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                    <FolderKanban className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-900 font-semibold mb-1">No projects found</p>
                    <p className="text-sm">Showcase your best work by adding projects</p>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/80 backdrop-blur-sm" onClick={() => { setIsModalOpen(false); setEditing(null); }} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-gray-50 border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white/50 shrink-0">
                                <h3 className="text-xl font-bold text-gray-900 font-heading">{editing ? 'Edit Project' : 'Add New Project'}</h3>
                                <button onClick={() => { setIsModalOpen(false); setEditing(null); }} className="text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="p-6 overflow-y-auto">
                                <form id="projectForm" onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1 md:col-span-2">
                                            <label className="text-sm font-medium text-gray-600 ml-1">Project Title *</label>
                                            <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" placeholder="e.g., E-Commerce Platform" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-600 ml-1">Category</label>
                                            <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" placeholder="e.g., Web App" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-600 ml-1">Live URL</label>
                                            <input type="url" value={formData.liveUrl} onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" placeholder="https://..." />
                                        </div>
                                        <div className="space-y-1 md:col-span-2">
                                            <label className="text-sm font-medium text-gray-600 ml-1">Image URL</label>
                                            <input type="url" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" placeholder="https://..." />
                                            {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="w-full h-24 object-cover rounded-lg mt-2 border border-gray-200" onError={e => e.target.style.display = 'none'} />}
                                        </div>
                                        <div className="space-y-1 md:col-span-2">
                                            <label className="text-sm font-medium text-gray-600 ml-1">Description *</label>
                                            <textarea required rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary resize-none transition-colors" placeholder="Describe the project..." />
                                        </div>
                                        <div className="space-y-1 md:col-span-2">
                                            <label className="text-sm font-medium text-gray-600 ml-1">Tech Stack (Comma Separated)</label>
                                            <input type="text" value={formData.techStack} onChange={e => setFormData({ ...formData, techStack: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary transition-colors font-mono text-sm" placeholder="React, Node.js, Firebase" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="p-6 border-t border-gray-200 bg-white/50 flex justify-end gap-3 shrink-0">
                                <button type="button" onClick={() => { setIsModalOpen(false); setEditing(null); }}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-900 hover:bg-gray-100 transition-colors font-medium">Cancel</button>
                                <button type="submit" form="projectForm"
                                    className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-opacity-90 text-white font-medium flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                                    <Save className="w-4 h-4" />{editing ? 'Save Changes' : 'Add Project'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectsTab;
