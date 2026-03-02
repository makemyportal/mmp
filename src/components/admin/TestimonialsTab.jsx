import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X, Save, Star, AlertTriangle, Quote } from 'lucide-react';

const TestimonialsTab = ({ testimonials, addTestimonial, updateTestimonial, deleteTestimonial, showToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({ name: '', role: '', text: '', rating: 5 });
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const deleteTimer = useRef(null);

    const openModal = (item = null) => {
        if (item) {
            setEditing(item);
            setFormData({ name: item.name, role: item.role || '', text: item.text || '', rating: item.rating || 5 });
        } else {
            setEditing(null);
            setFormData({ name: '', role: '', text: '', rating: 5 });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = { ...formData, rating: Number(formData.rating) };
            if (editing) {
                await updateTestimonial(editing.id, submitData);
                showToast(`Review by "${formData.name}" updated!`, 'success');
            } else {
                await addTestimonial(submitData);
                showToast(`Review by "${formData.name}" added!`, 'success');
            }
            setIsModalOpen(false);
            setEditing(null);
        } catch (err) {
            showToast('Error saving testimonial', 'error');
        }
    };

    const handleDelete = async (e, item) => {
        e.stopPropagation();
        if (deleteConfirm === item.id) {
            clearTimeout(deleteTimer.current);
            try {
                await deleteTestimonial(item.id);
                showToast(`Review by "${item.name}" removed`, 'success');
            } catch { showToast('Delete failed', 'error'); }
            setDeleteConfirm(null);
        } else {
            setDeleteConfirm(item.id);
            clearTimeout(deleteTimer.current);
            deleteTimer.current = setTimeout(() => setDeleteConfirm(null), 3000);
        }
    };

    const filtered = testimonials.filter(t => t.name?.toLowerCase().includes(search.toLowerCase()) || t.text?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 font-heading">Testimonials</h2>
                    <p className="text-sm text-gray-500 mt-1">{testimonials.length} reviews</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reviews..."
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" />
                    </div>
                    <button onClick={() => openModal()}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white font-semibold text-sm hover:bg-opacity-90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                        <Plus className="w-4 h-4" /> Add Review
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(item => (
                    <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-gray-50 border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition-all group relative">
                        <Quote className="w-8 h-8 text-brand-primary/10 absolute top-4 right-4" />
                        <div className="flex gap-1 mb-3">
                            {[...Array(item.rating || 5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                            {[...Array(5 - (item.rating || 5))].map((_, j) => <Star key={`e-${j}`} className="w-3.5 h-3.5 text-gray-200" />)}
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-3 mb-4 leading-relaxed font-medium">"{item.text}"</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                    {item.name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                    {item.role && <p className="text-[11px] text-gray-500">{item.role}</p>}
                                </div>
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                                <button onClick={() => openModal(item)} className="p-2 rounded-lg bg-white border border-gray-100 text-gray-600 hover:text-brand-primary transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                <button onClick={(e) => handleDelete(e, item)}
                                    className={`p-2 rounded-lg border transition-all ${deleteConfirm === item.id ? 'bg-red-500 text-white border-red-500 animate-pulse' : 'bg-white border-gray-100 text-red-400 hover:bg-red-50'}`}>
                                    {deleteConfirm === item.id ? <AlertTriangle className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                    <Quote className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-900 font-semibold mb-1">No testimonials yet</p>
                    <p className="text-sm">Add client reviews to showcase on the homepage</p>
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
                                <h3 className="text-xl font-bold text-gray-900 font-heading">{editing ? 'Edit Review' : 'Add New Review'}</h3>
                                <button onClick={() => { setIsModalOpen(false); setEditing(null); }} className="text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="p-6 overflow-y-auto">
                                <form id="testimonialForm" onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-600 ml-1">Name *</label>
                                            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" placeholder="e.g., Rahul Sharma" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-600 ml-1">Role / Title</label>
                                            <input type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary transition-colors" placeholder="e.g., CEO, TechStartup" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-600 ml-1">Review Text *</label>
                                        <textarea required value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} rows={4}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary transition-colors resize-none" placeholder="What did the client say about your service?" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-600 ml-1">Rating</label>
                                        <div className="flex gap-2 items-center">
                                            {[1, 2, 3, 4, 5].map(n => (
                                                <button key={n} type="button" onClick={() => setFormData({ ...formData, rating: n })}
                                                    className="focus:outline-none">
                                                    <Star className={`w-7 h-7 transition-colors ${n <= formData.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 hover:text-amber-200'}`} />
                                                </button>
                                            ))}
                                            <span className="text-sm text-gray-500 ml-2">{formData.rating}/5</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="p-6 border-t border-gray-200 bg-white/50 flex justify-end gap-3 shrink-0">
                                <button type="button" onClick={() => { setIsModalOpen(false); setEditing(null); }}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-900 hover:bg-gray-100 transition-colors font-medium">Cancel</button>
                                <button type="submit" form="testimonialForm"
                                    className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-opacity-90 text-white font-medium flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                                    <Save className="w-4 h-4" />{editing ? 'Save Changes' : 'Add Review'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TestimonialsTab;
