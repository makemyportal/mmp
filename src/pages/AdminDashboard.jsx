import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, ShoppingCart, Package, Users, Settings, ChevronRight,
    Activity, Menu, Building2, FolderKanban, Wrench, MessageSquareQuote
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';
import { db } from '../firebase';
import { collection, onSnapshot, getDocs, doc, getDoc, query } from 'firebase/firestore';

// Admin Components
import AdminToast from '../components/admin/AdminToast';
import NotificationPanel from '../components/admin/NotificationPanel';
import OverviewTab from '../components/admin/OverviewTab';
import OrdersTab from '../components/admin/OrdersTab';
import ServicesTab from '../components/admin/ServicesTab';
import UsersTab from '../components/admin/UsersTab';
import SettingsTab from '../components/admin/SettingsTab';
import ClientsTab from '../components/admin/ClientsTab';
import ProjectsTab from '../components/admin/ProjectsTab';
import ToolsTab from '../components/admin/ToolsTab';
import TestimonialsTab from '../components/admin/TestimonialsTab';

// ─── Sidebar Items ───
const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'services', label: 'Services', icon: Package },
    { id: 'clients', label: 'Clients', icon: Building2 },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
];

// ═══════════════════════════════════════════════
// ─── MAIN SUPER ADMIN PANEL ───
// ═══════════════════════════════════════════════
const AdminDashboard = () => {
    const { services, addService, updateService, deleteService } = useServices();
    const { currentUser } = useAuth();
    const { clients, projects, tools, testimonials, addClient, updateClient, deleteClient, addProject, updateProject, deleteProject, addTool, updateTool, deleteTool, addTestimonial, updateTestimonial, deleteTestimonial } = usePortfolio();
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Data States
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);

    // Toast Notifications
    const [toasts, setToasts] = useState([]);
    const toastId = useRef(0);

    const showToast = useCallback((message, type = 'info') => {
        const id = ++toastId.current;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // Bell Notifications
    const [notifications, setNotifications] = useState([]);
    const prevOrderCount = useRef(null);
    const prevUserCount = useRef(null);
    const initializedOrders = useRef(false);
    const initializedUsers = useRef(false);

    const addNotification = useCallback((title, message, type) => {
        setNotifications(prev => [{
            id: Date.now() + Math.random(),
            title, message, type, read: false,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }, ...prev].slice(0, 20));
    }, []);

    const clearNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    // Website Settings
    const [siteSettings, setSiteSettings] = useState({
        businessName: 'MakeMyPortal',
        tagline: 'Premium Digital Solutions',
        phone: '',
        contactEmail: '',
        address: '',
        whatsapp: '',
        instagram: '',
        facebook: '',
        linkedin: '',
        youtube: '',
        emailNotifications: true,
        soundAlerts: false,
    });

    // Fetch site settings from Firestore
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const snap = await getDoc(doc(db, 'settings', 'website'));
                if (snap.exists()) {
                    setSiteSettings(prev => ({ ...prev, ...snap.data() }));
                }
            } catch (err) {
                console.warn('Firestore settings fetch failed:', err);
            }
        };
        fetchSettings();
    }, []);

    // Fetch all orders (realtime) — skip notification on initial load
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
            const data = [];
            snapshot.forEach(d => {
                const raw = d.data();
                data.push({
                    id: d.id, ...raw,
                    date: raw.createdAt?.toDate?.().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'N/A'
                });
            });
            data.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));

            // Only notify after initial load is done
            if (!initializedOrders.current) {
                initializedOrders.current = true;
                prevOrderCount.current = data.length;
            } else if (data.length > prevOrderCount.current) {
                const newest = data[0];
                addNotification('New Order Received!', `${newest.customerName || 'A customer'} ordered "${newest.serviceName}"`, 'order');
                showToast(`🎉 New order: "${newest.serviceName}"`, 'success');
                prevOrderCount.current = data.length;
            }

            setOrders(data);
            setLoadingOrders(false);
        });
        return () => unsubscribe();
    }, [addNotification, showToast]);

    // Fetch all users (realtime) — skip notification on initial load
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            const data = [];
            snapshot.forEach(d => data.push({ id: d.id, ...d.data() }));

            // Only notify after initial load is done
            if (!initializedUsers.current) {
                initializedUsers.current = true;
                prevUserCount.current = data.length;
            } else if (data.length > prevUserCount.current) {
                const newest = data[data.length - 1];
                addNotification('New User Registered!', `${newest.name || newest.email || 'Someone'} just signed up`, 'user');
                showToast(`👤 New user registered!`, 'info');
                prevUserCount.current = data.length;
            }

            setUsers(data);
            setLoadingUsers(false);
        });
        return () => unsubscribe();
    }, [addNotification, showToast]);

    // Render active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <OverviewTab orders={orders} users={users} services={services} loading={loadingOrders} setActiveTab={setActiveTab} />;
            case 'orders': return <OrdersTab orders={orders} loading={loadingOrders} showToast={showToast} />;
            case 'services': return <ServicesTab services={services} addService={addService} updateService={updateService} deleteService={deleteService} showToast={showToast} />;
            case 'clients': return <ClientsTab clients={clients} addClient={addClient} updateClient={updateClient} deleteClient={deleteClient} showToast={showToast} />;
            case 'projects': return <ProjectsTab projects={projects} addProject={addProject} updateProject={updateProject} deleteProject={deleteProject} showToast={showToast} />;
            case 'tools': return <ToolsTab tools={tools} addTool={addTool} updateTool={updateTool} deleteTool={deleteTool} showToast={showToast} />;
            case 'testimonials': return <TestimonialsTab testimonials={testimonials} addTestimonial={addTestimonial} updateTestimonial={updateTestimonial} deleteTestimonial={deleteTestimonial} showToast={showToast} />;
            case 'users': return <UsersTab users={users} loading={loadingUsers} showToast={showToast} />;
            case 'settings': return <SettingsTab showToast={showToast} siteSettings={siteSettings} setSiteSettings={setSiteSettings} />;
            default: return null;
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto h-screen w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg">
                            <Activity className="w-5 h-5 text-gray-900" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-gray-900 font-heading">{siteSettings.businessName || 'MakeMyPortal'}</h1>
                            <p className="text-[10px] text-brand-primary font-bold uppercase tracking-[0.2em]">Super Admin</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {sidebarItems.map(item => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        const badge = item.id === 'orders' && orders.filter(o => o.status === 'in-progress').length;
                        return (
                            <button key={item.id}
                                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${isActive ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]' : 'text-gray-500 hover:bg-white/5 hover:text-gray-900 border border-transparent'}`}>
                                <Icon className="w-5 h-5" />
                                {item.label}
                                {badge > 0 && <span className="ml-auto text-[10px] font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-md">{badge}</span>}
                                {isActive && !badge && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-gray-900 text-sm font-bold shadow">
                            {(currentUser?.email || 'A')[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">Admin</p>
                            <p className="text-[11px] text-gray-500 truncate">{currentUser?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-gray-500">
                            <Menu className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-bold text-gray-900 font-heading capitalize">{activeTab === 'overview' ? 'Dashboard' : activeTab}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <NotificationPanel notifications={notifications} clearNotification={clearNotification} clearAll={clearAllNotifications} />
                    </div>
                </header>

                <div className="p-6 lg:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Toast Notifications */}
            <AdminToast toasts={toasts} removeToast={removeToast} />
        </div>
    );
};

export default AdminDashboard;
