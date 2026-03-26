import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X, Save, Wrench, AlertTriangle, ExternalLink } from 'lucide-react';
import ImageUploadField from './ImageUploadField';

const ToolsTab = ({ tools, addTool, updateTool, deleteTool, showToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({ name: '', description: '', icon: '', link: '', category: '' });
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const deleteTimer = useRef(null);

    const openModal = (tool = null) => {
        if (tool) {
            setEditing(tool);
            setFormData({ name: tool.name, description: tool.description || '', icon: tool.icon || '', link: tool.link || '', category: tool.category || '' });
        } else {
            setEditing(null);
            setFormData({ name: '', description: '', icon: '', link: '', category: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await updateTool(editing.id, formData);
                showToast(`"${formData.name}" updated!`, 'success');
            } else {
                await addTool(formData);
                showToast(`"${formData.name}" added!`, 'success');
            }
            setIsModalOpen(false);
            setEditing(null);
        } catch (err) {
            showToast('Error saving tool', 'error');
        }
    };

    const handleDelete = async (e, tool) => {
        e.stopPropagation();
        if (deleteConfirm === tool.id) {
            clearTimeout(deleteTimer.current);
            try {
                await deleteTool(tool.id);
                showToast(`"${tool.name}" removed`, 'success');
            } catch { showToast('Delete failed', 'error'); }
            setDeleteConfirm(null);
        } else {
            setDeleteConfirm(tool.id);
            clearTimeout(deleteTimer.current);
            deleteTimer.current = setTimeout(() => setDeleteConfirm(null), 3000);
        }
    };

    const filtered = tools.filter(t => t.name?.toLowerCase().includes(search.toLowerCase()) || t.category?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 font-heading">Tools Management</h2>
                    <p className="text-sm text-gray-500 mt-1">{tools.length} tools</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools..."
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" />
                    </div>
                    <button onClick={() => openModal()}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white font-semibold text-sm hover:bg-opacity-90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                        <Plus className="w-4 h-4" /> Add Tool
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(tool => (
                    <motion.div key={tool.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-gray-50 border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition-all group flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-primary/20 to-blue-500/20 border border-brand-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                            {tool.icon ? (
                                <img src={tool.icon} alt={tool.name} className="w-full h-full object-contain p-2" onError={e => { e.target.style.display = 'none'; }} />
                            ) : (
                                <Wrench className="w-6 h-6 text-brand-primary" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-gray-900">{tool.name}</h3>
                            {tool.category && <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">{tool.category}</span>}
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{tool.description}</p>
                            {tool.link && (
                                <a href={tool.link} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-primary font-medium flex items-center gap-1 mt-2 hover:underline">
                                    <ExternalLink className="w-3 h-3" /> Open Tool
                                </a>
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                            <button onClick={() => openModal(tool)} className="p-2 rounded-lg bg-white border border-gray-100 text-gray-600 hover:text-brand-primary transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={(e) => handleDelete(e, tool)}
                                className={`p-2 rounded-lg border transition-all ${deleteConfirm === tool.id ? 'bg-red-500 text-white border-red-500 animate-pulse' : 'bg-white border-gray-100 text-red-400 hover:bg-red-50'}`}>
                                {deleteConfirm === tool.id ? <AlertTriangle className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                    <Wrench className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-900 font-semibold mb-1">No tools found</p>
                    <p className="text-sm">Add tools that you've built to showcase your capabilities</p>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/80 backdrop-blur-sm" onClick={() => { setIsModalOpen(false); setEditing(null); }} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-gray-50 border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white/50 shrink-0">
                                <h3 className="text-xl font-bold text-gray-900 font-heading">{editing ? 'Edit Tool' : 'Add New Tool'}</h3>
                                <button onClick={() => { setIsModalOpen(false); setEditing(null); }} className="text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="p-6 overflow-y-auto">
                                <form id="toolForm" onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-600 ml-1">Tool Name *</label>
                                        <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" placeholder="e.g., AI Invoice Generator" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-600 ml-1">Description *</label>
                                        <textarea required rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary resize-none transition-colors" placeholder="What does this tool do?" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-600 ml-1">Category</label>
                                            <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" placeholder="e.g., AI" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-600 ml-1">Link</label>
                                            <input type="url" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" placeholder="https://..." />
                                        </div>
                                    </div>

                                    {/* Tool Icon Upload/Link */}
                                    <ImageUploadField
                                        value={formData.icon}
                                        onChange={(url) => setFormData({ ...formData, icon: url })}
                                        folder="tools"
                                        label="Tool Icon / Image"
                                        showToast={showToast}
                                        previewMode="contain"
                                    />
                                </form>
                            </div>
                            <div className="p-6 border-t border-gray-200 bg-white/50 flex justify-end gap-3 shrink-0">
                                <button type="button" onClick={() => { setIsModalOpen(false); setEditing(null); }}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-900 hover:bg-gray-100 transition-colors font-medium">Cancel</button>
                                <button type="submit" form="toolForm"
                                    className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-opacity-90 text-white font-medium flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                                    <Save className="w-4 h-4" />{editing ? 'Save Changes' : 'Add Tool'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ToolsTab;
