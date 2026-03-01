import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, ShieldCheck, DollarSign, CheckCircle2, CircleDashed, FileText, LifeBuoy, CreditCard, ChevronRight, Clock, X } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { generateInvoice } from '../utils/generateInvoice';

// Inline toast notification component
const Toast = ({ message, onClose }) => (
    <AnimatePresence>
        {message && (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-6 right-6 z-50 bg-dark-800 border border-brand-primary/30 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm"
            >
                <span className="text-sm font-medium">{message}</span>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors shrink-0">
                    <X className="w-4 h-4" />
                </button>
            </motion.div>
        )}
    </AnimatePresence>
);

const CustomerDashboard = () => {
    const { userData, currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('tracking');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState('');
    const [siteSettings, setSiteSettings] = useState({});

    // Fetch Site Settings for Invoice Logo/Address
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const snap = await getDoc(doc(db, 'settings', 'website'));
                if (snap.exists()) {
                    setSiteSettings(snap.data());
                }
            } catch (err) {
                console.warn('Failed to fetch settings', err);
            }
        };
        fetchSettings();
    }, []);

    const showToast = useCallback((msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 4000);
    }, []);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'orders'),
            where('userEmail', '==', currentUser.email)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedOrders = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                fetchedOrders.push({
                    id: doc.id,
                    ...data,
                    date: data.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Just now',
                    price: data.price || 'Pending Setup'
                });
            });
            // Sort client-side by date descending
            fetchedOrders.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
            setOrders(fetchedOrders);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching orders:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // Calculate Stats
    const activeProjects = orders.filter(o => o.status !== 'completed').length;
    const completedProjects = orders.filter(o => o.status === 'completed').length;

    // Calculate rough investment from formatted strings if possible
    const totalInvestment = orders.reduce((acc, curr) => {
        const num = parseInt((curr.price || '0').replace(/[^0-9]/g, '')) || 0;
        return acc + num;
    }, 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-8"
            >
                {/* Header Profile Section */}
                <div className="glass-panel p-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-dark-800 to-dark-900 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                        <div>
                            <p className="text-brand-secondary font-bold text-sm tracking-widest uppercase mb-2">Client Portal</p>
                            <h1 className="text-4xl font-black font-heading mb-2 text-white">Welcome back, {userData?.name || currentUser?.email?.split('@')[0]}</h1>
                            <p className="text-gray-400 font-medium">Manage your digital assets, track project progress, and view invoices.</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => showToast("Profile Editor coming soon — stay tuned!")} className="px-5 py-2.5 rounded-xl border border-white/20 hover:bg-white/5 transition-colors font-bold text-sm text-white">
                                Edit Profile
                            </button>
                            <Link to="/services" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-blue-600 hover:opacity-90 transition-opacity font-bold text-sm text-white shadow-lg">
                                New Order
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[
                        { title: 'Active Projects', value: loading ? '-' : activeProjects.toString(), icon: <Package className="w-6 h-6 text-brand-primary" /> },
                        { title: 'Completed Projects', value: loading ? '-' : completedProjects.toString(), icon: <CheckCircle2 className="w-6 h-6 text-[#f59e0b]" /> },
                        { title: 'Account Security', value: 'Secured', icon: <ShieldCheck className="w-6 h-6 text-green-400" /> },
                        { title: 'Total Investment', value: loading ? '-' : `₹${totalInvestment.toLocaleString('en-IN')}`, icon: <DollarSign className="w-6 h-6 text-blue-400" /> },
                    ].map((stat, i) => (
                        <div key={i} className="glass-panel p-6 rounded-2xl flex items-center gap-5 border border-white/5 hover:border-brand-primary/30 transition-colors bg-dark-800">
                            <div className="p-3.5 bg-dark-900 rounded-xl shadow-inner border border-white/5">{stat.icon}</div>
                            <div>
                                <p className="text-sm text-gray-400 font-semibold mb-1">{stat.title}</p>
                                <p className="text-2xl font-black text-white">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area with Internal Tabs */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar Nav */}
                    <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide snap-x">
                        {[
                            { id: 'tracking', icon: <Clock className="w-5 h-5" />, label: 'Order Tracking' },
                            { id: 'invoices', icon: <FileText className="w-5 h-5" />, label: 'Invoices & Billing' },
                            { id: 'subscriptions', icon: <CreditCard className="w-5 h-5" />, label: 'Active Subscriptions' },
                            { id: 'support', icon: <LifeBuoy className="w-5 h-5" />, label: 'Support Tickets' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-5 py-4 rounded-xl font-bold transition-all text-sm whitespace-nowrap lg:w-full text-left shrink-0 snap-start ${activeTab === tab.id ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                            >
                                {tab.icon} {tab.label}
                                {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="lg:col-span-9">
                        <div className="glass-panel p-6 sm:p-8 rounded-[2rem] border border-white/10 bg-dark-800 min-h-[500px]">

                            {activeTab === 'tracking' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
                                    <h2 className="text-2xl font-bold font-heading text-white border-b border-white/10 pb-4">Live Order Tracking</h2>

                                    {loading ? (
                                        <div className="animate-pulse space-y-6">
                                            {[1, 2].map(i => <div key={i} className="h-48 bg-white/5 rounded-2xl border border-white/5" />)}
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="text-center py-20 text-gray-400">
                                            <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                            <p className="text-lg font-semibold text-white mb-2">No orders yet</p>
                                            <p className="text-sm">Browse our catalog and place your first order.</p>
                                            <Link to="/services" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-brand-primary/20 text-brand-primary font-bold text-sm border border-brand-primary/30 hover:bg-brand-primary/30 transition-colors">
                                                View Services
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-8">
                                            {orders.map((order) => {
                                                const completedSteps = order.steps?.filter(s => s.completed).length || 0;
                                                const totalSteps = order.steps?.length || 1;
                                                const progressPercent = Math.round((completedSteps / totalSteps) * 100);

                                                const statusConfig = {
                                                    'completed': { label: '✅ Delivered', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                                                    'delivered': { label: '✅ Delivered', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                                                    'in-progress': { label: '🔄 In Progress', bg: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' },
                                                    'pending': { label: '⏳ Pending', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                                                };
                                                const status = statusConfig[order.status] || statusConfig['pending'];

                                                return (
                                                    <div key={order.id} className="border border-white/10 rounded-2xl p-6 bg-dark-900/50 shadow-inner">
                                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                                            <div>
                                                                <div className="flex items-center gap-3 mb-1">
                                                                    <h3 className="text-xl font-bold text-white">{order.serviceName}</h3>
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${status.bg}`}>
                                                                        {status.label}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-500 font-medium">Order ID: {order.id.substring(0, 8)}... • Placed on {order.date} • {order.price}</p>
                                                            </div>
                                                            {order.status !== 'completed' && order.status !== 'delivered' && (
                                                                <a href={`https://wa.me/917017978807?text=Hi, I need an update on my order: ${order.serviceName} (ID: ${order.id})`}
                                                                    target="_blank" rel="noopener noreferrer"
                                                                    className="px-4 py-2 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-sm font-bold border border-[#25D366]/30 text-[#25D366] transition-colors shrink-0">
                                                                    💬 Message Team
                                                                </a>
                                                            )}
                                                        </div>

                                                        {/* Progress Bar */}
                                                        <div className="mb-6">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Progress</span>
                                                                <span className={`text-xs font-black ${progressPercent === 100 ? 'text-emerald-400' : 'text-brand-primary'}`}>{progressPercent}%</span>
                                                            </div>
                                                            <div className="h-2 bg-dark-800 rounded-full overflow-hidden border border-white/5">
                                                                <div className={`h-full rounded-full transition-all duration-700 ${progressPercent === 100 ? 'bg-gradient-to-r from-emerald-500 to-green-400' : 'bg-gradient-to-r from-brand-primary to-brand-secondary'}`}
                                                                    style={{ width: `${progressPercent}%` }} />
                                                            </div>
                                                            <p className="text-xs text-gray-600 mt-1.5">{completedSteps} of {totalSteps} steps completed</p>
                                                        </div>

                                                        {/* Steppers */}
                                                        <div className="relative">
                                                            <div className="absolute top-5 left-6 right-6 h-[2px] bg-white/10 hidden sm:block z-0" />

                                                            <div className="flex flex-col sm:flex-row justify-between gap-6 relative z-10">
                                                                {order.steps?.map((step, idx) => (
                                                                    <div key={idx} className="flex flex-row sm:flex-col items-center gap-4 sm:gap-3 flex-1">
                                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-dark-900 transition-all ${step.completed ? 'bg-gradient-to-br from-brand-primary to-brand-secondary text-white' : order.currentStep === idx ? 'bg-dark-800 border-brand-primary text-brand-primary' : 'bg-dark-800 border-white/10 text-gray-600'}`}>
                                                                            {step.completed ? <CheckCircle2 className="w-5 h-5" /> : <CircleDashed className={`w-5 h-5 ${order.currentStep === idx ? 'animate-spin-slow' : ''}`} />}
                                                                        </div>
                                                                        <div className="text-left sm:text-center">
                                                                            <p className={`text-sm font-bold ${step.completed ? 'text-white' : order.currentStep === idx ? 'text-brand-primary' : 'text-gray-500'}`}>{step.title}</p>
                                                                            {step.completed && <p className="text-xs text-emerald-500 mt-0.5">✓ Done</p>}
                                                                            {order.currentStep === idx && !step.completed && <p className="text-xs text-brand-secondary mt-0.5 animate-pulse">● Active</p>}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Last update time */}
                                                        {order.updatedAt && (
                                                            <p className="text-xs text-gray-600 mt-4 text-right">
                                                                Last updated: {order.updatedAt?.toDate?.() ? order.updatedAt.toDate().toLocaleString() : 'Recently'}
                                                            </p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'invoices' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h2 className="text-2xl font-bold font-heading text-white border-b border-white/10 pb-4 mb-8">Invoices & Billing</h2>
                                    {loading ? (
                                        <div className="animate-pulse space-y-4">
                                            {[1, 2].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl border border-white/5" />)}
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="text-center py-20 text-gray-400">
                                            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                            <p>No billing history found.</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            {orders.map((inv) => (
                                                <div key={inv.id} className="flex justify-between items-center p-4 rounded-xl border border-white/5 bg-dark-900/30 hover:bg-dark-900/60 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-white/5 rounded-lg"><FileText className="w-5 h-5 text-brand-secondary" /></div>
                                                        <div>
                                                            <p className="font-bold text-white text-sm">INV-{inv.id.substring(0, 6).toUpperCase()}</p>
                                                            <p className="text-xs text-gray-400">{inv.serviceName} • {inv.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <p className="font-bold text-white tracking-wide">{inv.price}</p>
                                                        <span className={`px-3 py-1 rounded-md text-xs font-bold ${inv.status === 'completed' || inv.status === 'delivered' ? 'bg-green-500/10 text-emerald-400' : 'bg-[#f59e0b]/10 text-[#f59e0b]'}`}>{inv.status === 'completed' || inv.status === 'delivered' ? 'Paid' : 'Pending'}</span>

                                                        {inv.status === 'completed' || inv.status === 'delivered' ? (
                                                            <button
                                                                className="text-brand-primary hover:text-white transition-colors text-sm font-bold flex items-center gap-1 bg-brand-primary/10 px-3 py-1.5 rounded-lg border border-brand-primary/30 hover:bg-brand-primary hover:border-brand-primary"
                                                                onClick={() => {
                                                                    generateInvoice(inv, siteSettings);
                                                                    showToast("Downloading Invoice PDF...");
                                                                }}
                                                            >
                                                                Download PDF
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="text-gray-500 cursor-not-allowed text-sm font-bold opacity-50 px-3 py-1.5 border border-white/5 rounded-lg"
                                                                disabled
                                                                title="Invoice generates upon completion"
                                                            >
                                                                Unavailable
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {(activeTab === 'subscriptions' || activeTab === 'support') && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full min-h-[400px] text-center opacity-60">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                                        {activeTab === 'subscriptions' ? <CreditCard className="w-8 h-8 text-gray-400" /> : <LifeBuoy className="w-8 h-8 text-gray-400" />}
                                    </div>
                                    <h3 className="text-2xl font-bold font-heading text-white mb-2">
                                        {activeTab === 'subscriptions' ? 'No Active Subscriptions' : 'Support Center'}
                                    </h3>
                                    <p className="text-gray-400 max-w-sm mb-6">
                                        {activeTab === 'subscriptions'
                                            ? 'You currently don\'t have any recurring AMC, hosting, or maintenance subscriptions active.'
                                            : 'Need help with your project? Our engineering team is available via priority support.'}
                                    </p>

                                    {activeTab === 'support' && (
                                        <a href="https://wa.me/917017978807?text=Hi, I need support for my Makemyportal account." target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors">
                                            Contact Support via WhatsApp
                                        </a>
                                    )}
                                </motion.div>
                            )}

                        </div>
                    </div>

                </div>
            </motion.div>
            <Toast message={toast} onClose={() => setToast('')} />
        </div>
    );
};

export default CustomerDashboard;
