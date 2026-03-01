import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit2, Trash2, X, CheckCircle2, MessageSquare, Phone, Mail } from 'lucide-react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { StatusBadge } from './OverviewTab';

const OrdersTab = ({ orders, loading, showToast }) => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [editingOrder, setEditingOrder] = useState(null);
    const [saving, setSaving] = useState(false);

    const filtered = orders.filter(o => {
        const matchSearch = (o.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
            (o.serviceName || '').toLowerCase().includes(search.toLowerCase()) ||
            (o.userEmail || '').toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const updateOrderStatus = async (orderId, newStatus, newStep) => {
        setSaving(true);
        try {
            const orderRef = doc(db, 'orders', orderId);
            const order = orders.find(o => o.id === orderId);
            const updatedSteps = order.steps.map((s, i) => ({ ...s, completed: i <= newStep }));
            await updateDoc(orderRef, { status: newStatus, currentStep: newStep, steps: updatedSteps, updatedAt: new Date() });
            showToast('Order status updated!', 'success');
            // Update the editingOrder's steps locally for immediate feedback
            setEditingOrder(prev => prev ? { ...prev, steps: updatedSteps, status: newStatus, currentStep: newStep } : null);
        } catch (err) {
            console.error(err);
            showToast('Failed to update order', 'error');
        }
        setSaving(false);
    };

    const deleteOrder = async (orderId) => {
        try {
            await deleteDoc(doc(db, 'orders', orderId));
            showToast('Order deleted successfully', 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to delete order', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white font-heading">Order Management</h2>
                    <p className="text-sm text-gray-500 mt-1">{filtered.length} order{filtered.length !== 1 ? 's' : ''} found</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..."
                            className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-dark-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-primary transition-colors" />
                    </div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 bg-dark-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none cursor-pointer">
                        <option value="all">All Status</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            <div className="bg-dark-800 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-white/5">
                                <th className="px-6 py-3 text-left font-semibold">Customer</th>
                                <th className="px-6 py-3 text-left font-semibold">Service</th>
                                <th className="px-6 py-3 text-left font-semibold">Price</th>
                                <th className="px-6 py-3 text-left font-semibold">Status</th>
                                <th className="px-6 py-3 text-left font-semibold">Progress</th>
                                <th className="px-6 py-3 text-left font-semibold">Date</th>
                                <th className="px-6 py-3 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">Loading orders...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No orders found</td></tr>
                            ) : filtered.map(order => (
                                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-white">{order.customerName || 'N/A'}</p>
                                        <p className="text-xs text-gray-500">{order.userEmail}</p>
                                        {order.phone && <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" />{order.phone}</p>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300 max-w-[150px] truncate">{order.serviceName}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-emerald-400">{order.price}</td>
                                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-dark-900 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all"
                                                    style={{ width: `${order.steps ? ((order.steps.filter(s => s.completed).length / order.steps.length) * 100) : 0}%` }} />
                                            </div>
                                            <span className="text-xs text-gray-500">{order.steps ? `${order.steps.filter(s => s.completed).length}/${order.steps.length}` : '0/0'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">{order.date}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => setEditingOrder(order)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Manage">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => deleteOrder(order.id)} className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Edit Modal */}
            <AnimatePresence>
                {editingOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm" onClick={() => setEditingOrder(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-lg bg-dark-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                            <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
                                <h3 className="text-xl font-bold text-white font-heading">Manage Order</h3>
                                <button onClick={() => setEditingOrder(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="p-6 space-y-5 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><p className="text-xs text-gray-500 mb-1">Customer</p><p className="text-sm font-medium text-white">{editingOrder.customerName || 'N/A'}</p></div>
                                    <div><p className="text-xs text-gray-500 mb-1">Email</p><p className="text-sm text-gray-300 flex items-center gap-1"><Mail className="w-3 h-3" />{editingOrder.userEmail}</p></div>
                                    <div><p className="text-xs text-gray-500 mb-1">Service</p><p className="text-sm font-medium text-white">{editingOrder.serviceName}</p></div>
                                    <div><p className="text-xs text-gray-500 mb-1">Price</p><p className="text-sm font-semibold text-emerald-400">{editingOrder.price}</p></div>
                                    {editingOrder.phone && <div><p className="text-xs text-gray-500 mb-1">Phone</p><p className="text-sm text-gray-300 flex items-center gap-1"><Phone className="w-3 h-3" />{editingOrder.phone}</p></div>}
                                    {editingOrder.company && <div><p className="text-xs text-gray-500 mb-1">Company</p><p className="text-sm text-gray-300">{editingOrder.company}</p></div>}
                                </div>
                                {editingOrder.requirements && (
                                    <div><p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MessageSquare className="w-3 h-3" />Requirements</p>
                                        <p className="text-sm text-gray-300 bg-dark-900 p-3 rounded-xl border border-white/5">{editingOrder.requirements}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">Update Progress Steps</p>
                                    <div className="space-y-2">
                                        {editingOrder.steps && editingOrder.steps.map((step, idx) => (
                                            <button key={idx}
                                                onClick={() => updateOrderStatus(editingOrder.id, idx >= editingOrder.steps.length - 1 ? 'completed' : 'in-progress', idx)}
                                                disabled={saving}
                                                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left text-sm ${step.completed ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' : 'border-white/10 bg-dark-900 text-gray-400 hover:border-brand-primary/30 hover:text-white'}`}>
                                                <CheckCircle2 className={`w-5 h-5 shrink-0 ${step.completed ? 'text-emerald-400' : 'text-gray-600'}`} />
                                                <span className="font-medium">{step.title}</span>
                                                {step.completed && <span className="ml-auto text-xs text-emerald-500 font-bold">✓ Done</span>}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-600 mt-3">Click a step to mark it and all previous steps as completed</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrdersTab;
