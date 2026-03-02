import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X, Save, Package, AlertTriangle } from 'lucide-react';

const ServicesTab = ({ services, addService, updateService, deleteService, showToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({ title: '', description: '', price: '', imageUrl: '', category: '', features: '' });
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const deleteTimer = useRef(null);

    const openModal = (service = null) => {
        if (service) {
            setEditingService(service);
            setFormData({ title: service.title, description: service.description, price: service.price, imageUrl: service.imageUrl, category: service.category, features: service.features.join(', ') });
        } else {
            setEditingService(null);
            setFormData({ title: '', description: '', price: '', imageUrl: '', category: '', features: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const serviceData = { ...formData, features: formData.features.split(',').map(f => f.trim()).filter(f => f) };
        if (editingService) {
            updateService(editingService.id, serviceData);
            showToast(`"${formData.title}" updated successfully!`, 'success');
        } else {
            addService(serviceData);
            showToast(`"${formData.title}" added to catalog!`, 'success');
        }
        setIsModalOpen(false);
        setEditingService(null);
    };

    const handleDelete = (e, service) => {
        e.stopPropagation();
        if (deleteConfirm === service.id) {
            // Second click = confirm delete
            clearTimeout(deleteTimer.current);
            deleteService(service.id);
            showToast(`"${service.title}" removed from catalog`, 'success');
            setDeleteConfirm(null);
        } else {
            // First click = mark for deletion
            setDeleteConfirm(service.id);
            clearTimeout(deleteTimer.current);
            deleteTimer.current = setTimeout(() => setDeleteConfirm(null), 3000);
        }
    };

    const filtered = services.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()));

    const categories = [...new Set(services.map(s => s.category))];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 font-heading">Service Management</h2>
                    <p className="text-sm text-gray-500 mt-1">{services.length} services across {categories.length} categories</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services..."
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" />
                    </div>
                    <button onClick={() => openModal()}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white font-semibold text-sm hover:bg-opacity-90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                        <Plus className="w-4 h-4" /> Add Service
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(service => (
                    <motion.div key={service.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-200 transition-all group">
                        <div className="h-36 bg-white relative overflow-hidden">
                            {service.imageUrl ? (
                                <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                                    onError={(e) => { e.target.style.display = 'none'; }} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600"><Package className="w-10 h-10" /></div>
                            )}
                            <div className="absolute top-3 right-3 flex gap-1.5">
                                <button onClick={() => openModal(service)} className="p-2 rounded-lg bg-white/80 backdrop-blur text-gray-900 hover:bg-brand-primary transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                <button onClick={(e) => handleDelete(e, service)}
                                    className={`p-2 rounded-lg backdrop-blur transition-all ${deleteConfirm === service.id ? 'bg-red-500 text-white animate-pulse' : 'bg-white/80 text-red-400 hover:bg-red-500 hover:text-gray-900'}`}
                                    title={deleteConfirm === service.id ? 'Click again to confirm!' : 'Delete'}>
                                    {deleteConfirm === service.id ? <AlertTriangle className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider">{service.category}</span>
                            <h3 className="text-base font-bold text-gray-900 mt-1 mb-1">{service.title}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{service.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-emerald-400">{service.price}</span>
                                <span className="text-xs text-gray-600">{service.features?.length || 0} features</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-700" />
                    <p className="text-gray-900 font-semibold mb-1">No services found</p>
                    <p className="text-sm">Try a different search or add a new service</p>
                </div>
            )}

            {/* Service Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/80 backdrop-blur-sm" onClick={() => { setIsModalOpen(false); setEditingService(null); }} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-gray-50 border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white/50 shrink-0">
                                <h3 className="text-xl font-bold text-gray-900 font-heading">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
                                <button onClick={() => { setIsModalOpen(false); setEditingService(null); }} className="text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="p-6 overflow-y-auto">
                                <form id="serviceForm" onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1 md:col-span-2">
                                            <label className="text-sm font-medium text-gray-600 ml-1">Service Title *</label>
                                            <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" placeholder="e.g., Enterprise SEO Audit" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-600 ml-1">Price *</label>
                                            <input type="text" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" placeholder="₹50,000" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-600 ml-1">Category *</label>
                                            <input type="text" required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" placeholder="e.g., Marketing"
                                                list="categoryList" />
                                            <datalist id="categoryList">{categories.map(c => <option key={c} value={c} />)}</datalist>
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
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary resize-none transition-colors" placeholder="Describe the service..." />
                                        </div>
                                        <div className="space-y-1 md:col-span-2">
                                            <label className="text-sm font-medium text-gray-600 ml-1">Features (Comma Separated) *</label>
                                            <textarea required rows="2" value={formData.features} onChange={e => setFormData({ ...formData, features: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary resize-none text-sm font-mono transition-colors" placeholder="Feature 1, Feature 2, Feature 3" />
                                            <p className="text-xs text-gray-600 ml-1 mt-1">These appear as bullet points on the service page</p>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="p-6 border-t border-gray-200 bg-white/50 flex justify-end gap-3 shrink-0">
                                <button type="button" onClick={() => { setIsModalOpen(false); setEditingService(null); }}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-900 hover:bg-white/5 transition-colors font-medium">Cancel</button>
                                <button type="submit" form="serviceForm"
                                    className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-opacity-90 text-gray-900 font-medium flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                                    <Save className="w-4 h-4" />{editingService ? 'Save Changes' : 'Create Service'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ServicesTab;
