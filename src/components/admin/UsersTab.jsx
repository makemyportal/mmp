import React, { useState } from 'react';
import { Search, UserCheck, Shield, Mail, Trash2, UserX, AlertTriangle } from 'lucide-react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const UsersTab = ({ users, loading, showToast }) => {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const filtered = users.filter(u => {
        const matchSearch = (u.name || '').toLowerCase().includes(search.toLowerCase()) || (u.email || '').toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'all' || (u.role || 'customer') === roleFilter;
        return matchSearch && matchRole;
    });

    const toggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'customer' : 'admin';
        if (!window.confirm(`Change this user's role to "${newRole}"?`)) return;
        try {
            await updateDoc(doc(db, 'users', userId), { role: newRole });
            showToast(`User role updated to ${newRole}`, 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to update role', 'error');
        }
    };

    const handleDeleteUser = async (user) => {
        if (deleteConfirm !== user.id) {
            setDeleteConfirm(user.id);
            return;
        }
        try {
            await deleteDoc(doc(db, 'users', user.id));
            showToast(`User "${user.name || user.email}" deleted from records`, 'success');
            setDeleteConfirm(null);
        } catch (err) {
            console.error(err);
            showToast('Failed to delete user', 'error');
        }
    };

    const getJoinDate = (user) => {
        if (user.createdAt?.toDate) return user.createdAt.toDate().toLocaleDateString();
        if (typeof user.createdAt === 'string') return new Date(user.createdAt).toLocaleDateString();
        return 'N/A';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white font-heading">User Management</h2>
                    <p className="text-sm text-gray-500 mt-1">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
                            className="pl-10 pr-4 py-2.5 bg-dark-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-primary transition-colors w-48" />
                    </div>
                    <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                        className="px-4 py-2.5 bg-dark-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none cursor-pointer">
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="customer">Customer</option>
                    </select>
                </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-dark-800 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-blue-500/10"><UserCheck className="w-5 h-5 text-blue-400" /></div>
                    <div><p className="text-xs text-gray-500">Total Users</p><p className="text-xl font-black text-white">{users.length}</p></div>
                </div>
                <div className="bg-dark-800 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-brand-primary/10"><Shield className="w-5 h-5 text-brand-primary" /></div>
                    <div><p className="text-xs text-gray-500">Admins</p><p className="text-xl font-black text-white">{users.filter(u => u.role === 'admin').length}</p></div>
                </div>
                <div className="bg-dark-800 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10"><Mail className="w-5 h-5 text-emerald-400" /></div>
                    <div><p className="text-xs text-gray-500">Customers</p><p className="text-xl font-black text-white">{users.filter(u => (u.role || 'customer') === 'customer').length}</p></div>
                </div>
            </div>

            <div className="bg-dark-800 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-white/5">
                                <th className="px-6 py-3 text-left font-semibold">User</th>
                                <th className="px-6 py-3 text-left font-semibold">Email</th>
                                <th className="px-6 py-3 text-left font-semibold">Organization</th>
                                <th className="px-6 py-3 text-left font-semibold">Role</th>
                                <th className="px-6 py-3 text-left font-semibold">Joined</th>
                                <th className="px-6 py-3 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">Loading users...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                    <UserX className="w-10 h-10 mx-auto text-gray-700 mb-2" />
                                    No users found
                                </td></tr>
                            ) : filtered.map(user => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow ${user.role === 'admin' ? 'bg-gradient-to-br from-brand-primary to-brand-secondary' : 'bg-gradient-to-br from-blue-500 to-cyan-500'}`}>
                                                {(user.name || user.email || '?')[0].toUpperCase()}
                                            </div>
                                            <p className="text-sm font-medium text-white">{user.name || 'No name'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{user.organization || '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${user.role === 'admin' ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                            {user.role === 'admin' ? '🛡️ Admin' : '👤 Customer'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">{getJoinDate(user)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => toggleRole(user.id, user.role || 'customer')}
                                                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                                                {user.role === 'admin' ? 'Make Customer' : 'Make Admin'}
                                            </button>
                                            <button onClick={() => handleDeleteUser(user)}
                                                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${deleteConfirm === user.id ? 'bg-red-500 text-white animate-pulse' : 'text-gray-600 hover:text-red-400 hover:bg-red-500/10'}`}
                                                title={deleteConfirm === user.id ? 'Click again to confirm delete' : 'Delete user'}>
                                                {deleteConfirm === user.id ? <AlertTriangle className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {deleteConfirm && (
                <p className="text-xs text-amber-400 text-center animate-pulse">⚠️ Click the red button again to confirm deletion. This only removes Firestore data, not the Auth account.</p>
            )}
        </div>
    );
};

export default UsersTab;
