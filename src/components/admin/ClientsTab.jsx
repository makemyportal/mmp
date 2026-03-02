import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X, Save, Building2, AlertTriangle, ExternalLink } from 'lucide-react';

const ClientsTab = ({ clients, addClient, updateClient, deleteClient, showToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({ name: '', logo: '', industry: '', website: '' });
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const deleteTimer = useRef(null);

    const openModal = (client = null) => {
        if (client) {
            setEditing(client);
            setFormData({ name: client.name, logo: client.logo || '', industry: client.industry || '', website: client.website || '' });
        } else {
            setEditing(null);
            setFormData({ name: '', logo: '', industry: '', website: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await updateClient(editing.id, formData);
                showToast(`"${formData.name}" updated!`, 'success');
            } else {
                await addClient(formData);
                showToast(`"${formData.name}" added!`, 'success');
            }
            setIsModalOpen(false);
            setEditing(null);
        } catch (err) {
            showToast('Error saving client', 'error');
        }
    };

    const handleDelete = async (e, client) => {
        e.stopPropagation();
        if (deleteConfirm === client.id) {
            clearTimeout(deleteTimer.current);
            try {
                await deleteClient(client.id);
                showToast(`"${client.name}" removed`, 'success');
            } catch { showToast('Delete failed', 'error'); }
            setDeleteConfirm(null);
        } else {
            setDeleteConfirm(client.id);
            clearTimeout(deleteTimer.current);
            deleteTimer.current = setTimeout(() => setDeleteConfirm(null), 3000);
        }
    };

    const filtered = clients.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.industry?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 font-heading">Client Management</h2>
                    <p className="text-sm text-gray-500 mt-1">{clients.length} clients</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..."
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" />
                    </div>
                    <button onClick={() => openModal()}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white font-semibold text-sm hover:bg-opacity-90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                        <Plus className="w-4 h-4" /> Add Client
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(client => (
                    <motion.div key={client.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-gray-50 border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition-all group flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                            {client.logo ? (
                                <img src={client.logo} alt={client.name} className="w-full h-full object-contain p-2" onError={e => { e.target.style.display = 'none'; }} />
                            ) : (
                                <Building2 className="w-7 h-7 text-gray-400" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-gray-900 truncate">{client.name}</h3>
                            {client.industry && <p className="text-xs text-gray-500 mt-0.5">{client.industry}</p>}
                            {client.website && (
                                <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-primary font-medium flex items-center gap-1 mt-1 hover:underline">
                                    <ExternalLink className="w-3 h-3" /> Visit
                                </a>
                            )}
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                            <button onClick={() => openModal(client)} className="p-2 rounded-lg bg-white border border-gray-100 text-gray-600 hover:text-brand-primary transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={(e) => handleDelete(e, client)}
                                className={`p-2 rounded-lg border transition-all ${deleteConfirm === client.id ? 'bg-red-500 text-white border-red-500 animate-pulse' : 'bg-white border-gray-100 text-red-400 hover:bg-red-50'}`}>
                                {deleteConfirm === client.id ? <AlertTriangle className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                    <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-900 font-semibold mb-1">No clients found</p>
                    <p className="text-sm">Add your first client to showcase on the homepage</p>
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
                                <h3 className="text-xl font-bold text-gray-900 font-heading">{editing ? 'Edit Client' : 'Add New Client'}</h3>
                                <button onClick={() => { setIsModalOpen(false); setEditing(null); }} className="text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="p-6 overflow-y-auto">
                                <form id="clientForm" onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-600 ml-1">Client Name *</label>
                                        <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" placeholder="e.g., Acme Corp" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-600 ml-1">Logo URL</label>
                                        <input type="url" value={formData.logo} onChange={e => setFormData({ ...formData, logo: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" placeholder="https://..." />
                                        {formData.logo && <img src={formData.logo} alt="Preview" className="w-20 h-20 object-contain rounded-lg mt-2 border border-gray-200 p-2" onError={e => e.target.style.display = 'none'} />}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-600 ml-1">Industry</label>
                                            <input type="text" value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" placeholder="e.g., Tech" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-600 ml-1">Website</label>
                                            <input type="url" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" placeholder="https://..." />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="p-6 border-t border-gray-200 bg-white/50 flex justify-end gap-3 shrink-0">
                                <button type="button" onClick={() => { setIsModalOpen(false); setEditing(null); }}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-900 hover:bg-gray-100 transition-colors font-medium">Cancel</button>
                                <button type="submit" form="clientForm"
                                    className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-opacity-90 text-white font-medium flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                                    <Save className="w-4 h-4" />{editing ? 'Save Changes' : 'Add Client'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClientsTab;
