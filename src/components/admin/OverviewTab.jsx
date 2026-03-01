import React from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign, ShoppingCart, Clock, UserCheck, ArrowUpRight, ArrowDownRight,
    Activity, Package, TrendingUp, Eye
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendUp, color }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-dark-800 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-opacity-10 ${color}`}>
                <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
            </div>
            {trend && (
                <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {trend}
                </span>
            )}
        </div>
        <p className="text-2xl font-black text-white mb-1">{value}</p>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
    </motion.div>
);

const StatusBadge = ({ status }) => {
    const config = {
        'completed': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Delivered' },
        'in-progress': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'In Progress' },
        'pending': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: 'Pending' },
    };
    const c = config[status] || config['pending'];
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${c.bg} ${c.text} ${c.border}`}>{c.label}</span>;
};

const OverviewTab = ({ orders, users, services, loading, setActiveTab }) => {
    const totalRevenue = orders.reduce((acc, o) => acc + (parseInt((o.price || '0').replace(/[^0-9]/g, '')) || 0), 0);
    const activeOrders = orders.filter(o => o.status !== 'completed').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white font-heading">Dashboard Overview</h2>
                    <p className="text-gray-500 text-sm mt-1">Welcome back, Super Admin</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-dark-900 px-3 py-2 rounded-xl border border-white/5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" /> <span>Live</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={DollarSign} trend="+12%" trendUp color="bg-emerald-500" />
                <StatCard title="Total Orders" value={orders.length.toString()} icon={ShoppingCart} trend="+8%" trendUp color="bg-brand-primary" />
                <StatCard title="Active Projects" value={activeOrders.toString()} icon={Clock} color="bg-amber-500" />
                <StatCard title="Total Users" value={users.length.toString()} icon={UserCheck} trend="+5%" trendUp color="bg-blue-500" />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Add Service', icon: Package, color: 'from-brand-primary to-purple-600', tab: 'services' },
                    { label: 'Manage Orders', icon: ShoppingCart, color: 'from-emerald-500 to-teal-600', tab: 'orders' },
                    { label: 'View Users', icon: UserCheck, color: 'from-blue-500 to-indigo-600', tab: 'users' },
                    { label: 'Website Settings', icon: TrendingUp, color: 'from-amber-500 to-orange-600', tab: 'settings' },
                ].map(action => (
                    <button key={action.label} onClick={() => setActiveTab(action.tab)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/10 hover:border-white/20 bg-dark-800 hover:bg-dark-700 transition-all group">
                        <div className={`p-2.5 rounded-lg bg-gradient-to-br ${action.color} shadow-lg group-hover:scale-110 transition-transform`}>
                            <action.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{action.label}</span>
                    </button>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-dark-800 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-brand-primary hover:text-white font-semibold flex items-center gap-1 transition-colors">
                        View All <Eye className="w-3 h-3" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-white/5">
                                <th className="px-6 py-3 text-left font-semibold">Customer</th>
                                <th className="px-6 py-3 text-left font-semibold">Service</th>
                                <th className="px-6 py-3 text-left font-semibold">Price</th>
                                <th className="px-6 py-3 text-left font-semibold">Status</th>
                                <th className="px-6 py-3 text-left font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                    <Package className="w-10 h-10 mx-auto mb-3 text-gray-700" />
                                    <p className="text-white font-semibold mb-1">No orders yet</p>
                                    <p className="text-xs">Orders will appear here when customers book services</p>
                                </td></tr>
                            ) : orders.slice(0, 5).map(order => (
                                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-white">{order.customerName || 'N/A'}</p>
                                        <p className="text-xs text-gray-500">{order.userEmail}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{order.serviceName}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-emerald-400">{order.price}</td>
                                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                                    <td className="px-6 py-4 text-xs text-gray-500">{order.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Service Stats Summary */}
            <div className="bg-dark-800 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Service Categories</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Object.entries(services.reduce((acc, s) => { acc[s.category] = (acc[s.category] || 0) + 1; return acc; }, {})).map(([cat, count]) => (
                        <div key={cat} className="flex items-center gap-3 p-3 rounded-xl bg-dark-900 border border-white/5">
                            <span className="text-lg">{cat.split(' ')[0]}</span>
                            <div>
                                <p className="text-xs text-gray-400 leading-tight">{cat.replace(/^[^\s]+\s/, '')}</p>
                                <p className="text-sm font-bold text-white">{count} services</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export { StatusBadge };
export default OverviewTab;
