import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, ShoppingCart, UserCheck, Package, Clock } from 'lucide-react';

const NotificationPanel = ({ notifications, clearNotification, clearAll }) => {
    const [open, setOpen] = useState(false);
    const unread = notifications.filter(n => !n.read).length;

    return (
        <div className="relative">
            <button onClick={() => setOpen(!open)} className="relative p-2 rounded-xl hover:bg-white/5 text-gray-400 transition-colors">
                <Bell className="w-5 h-5" />
                {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 animate-pulse">
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-dark-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                                <h3 className="text-sm font-bold text-white">Notifications</h3>
                                {notifications.length > 0 && (
                                    <button onClick={() => { clearAll(); }} className="text-xs text-brand-primary hover:text-white font-semibold transition-colors">
                                        Clear All
                                    </button>
                                )}
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="py-12 text-center text-gray-500">
                                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                        <p className="text-sm">No notifications</p>
                                    </div>
                                ) : (
                                    notifications.map(n => (
                                        <div key={n.id} className={`flex items-start gap-3 px-5 py-3.5 border-b border-white/5 hover:bg-white/[0.02] transition-colors ${!n.read ? 'bg-brand-primary/5' : ''}`}>
                                            <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${n.type === 'order' ? 'bg-emerald-500/10 text-emerald-400' : n.type === 'user' ? 'bg-blue-500/10 text-blue-400' : 'bg-brand-primary/10 text-brand-primary'}`}>
                                                {n.type === 'order' ? <ShoppingCart className="w-4 h-4" /> : n.type === 'user' ? <UserCheck className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white leading-snug">{n.title}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                                                <p className="text-[10px] text-gray-600 mt-1 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {n.time}
                                                </p>
                                            </div>
                                            <button onClick={() => clearNotification(n.id)} className="text-gray-600 hover:text-gray-300 shrink-0">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationPanel;
