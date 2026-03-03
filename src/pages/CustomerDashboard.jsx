import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, ShieldCheck, DollarSign, CheckCircle2, CircleDashed, FileText, LifeBuoy, ChevronRight, Clock, X, UserCircle, Camera, Save, KeyRound, MapPin, Phone, Building, Mail, CalendarDays, ShoppingBag, Headphones, ArrowRight, Loader2, Gift, Copy, Share2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { generateInvoice } from '../utils/generateInvoice';

// Inline toast notification component
const Toast = ({ message, type, onClose }) => (
    <AnimatePresence>
        {message && (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm border ${type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-50 border-brand-primary/30 text-gray-700'}`}
            >
                <span className="text-sm font-medium">{message}</span>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors shrink-0">
                    <X className="w-4 h-4" />
                </button>
            </motion.div>
        )}
    </AnimatePresence>
);

const CustomerDashboard = () => {
    const { userData, currentUser, refreshUserData } = useAuth();
    const [activeTab, setActiveTab] = useState('tracking');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ message: '', type: '' });
    const [siteSettings, setSiteSettings] = useState({});

    // Profile state
    const [profileForm, setProfileForm] = useState({
        name: '',
        organization: '',
        phone: '',
        address: '',
        city: '',
        state: '',
    });
    const [profileSaving, setProfileSaving] = useState(false);
    const [photoUploading, setPhotoUploading] = useState(false);
    const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
    const fileInputRef = useRef(null);

    // Populate profile form when userData loads
    useEffect(() => {
        if (userData) {
            setProfileForm({
                name: userData.name || '',
                organization: userData.organization || '',
                phone: userData.phone || '',
                address: userData.address || '',
                city: userData.city || '',
                state: userData.state || '',
            });
            setProfilePhotoPreview(userData.profilePhoto || null);
        }
    }, [userData]);

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

    const showToast = useCallback((msg, type = 'info') => {
        setToast({ message: msg, type });
        setTimeout(() => setToast({ message: '', type: '' }), 4000);
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

    // Compress image to base64 data URL
    const compressImage = (file, maxWidth = 300, quality = 0.7) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    if (width > maxWidth) {
                        height = (maxWidth / width) * height;
                        width = maxWidth;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.onerror = reject;
                img.src = event.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Profile photo upload handler — compresses and stores as base64 in Firestore
    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            showToast('Please select an image file', 'error');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showToast('Image must be under 5MB', 'error');
            return;
        }

        setPhotoUploading(true);
        try {
            // Compress image to ~300px wide JPEG
            const compressedBase64 = await compressImage(file);

            // Save directly to Firestore user doc
            await setDoc(doc(db, 'users', currentUser.uid), {
                profilePhoto: compressedBase64,
                updatedAt: serverTimestamp()
            }, { merge: true });

            setProfilePhotoPreview(compressedBase64);
            await refreshUserData();
            showToast('Profile photo updated! 📸', 'success');
        } catch (err) {
            console.error('Photo upload error:', err);
            showToast('Failed to upload photo. Please try again.', 'error');
        }
        setPhotoUploading(false);
    };

    // Save profile info
    const handleProfileSave = async (e) => {
        e.preventDefault();
        if (!profileForm.name.trim()) {
            showToast('Name is required', 'error');
            return;
        }

        setProfileSaving(true);
        try {
            await setDoc(doc(db, 'users', currentUser.uid), {
                name: profileForm.name.trim(),
                organization: profileForm.organization.trim(),
                phone: profileForm.phone.trim(),
                address: profileForm.address.trim(),
                city: profileForm.city.trim(),
                state: profileForm.state.trim(),
                updatedAt: serverTimestamp()
            }, { merge: true });
            await refreshUserData();
            showToast('Profile updated successfully! ✅', 'success');
        } catch (err) {
            console.error('Profile save error:', err);
            showToast('Failed to save profile. Please try again.', 'error');
        }
        setProfileSaving(false);
    };

    // Password reset
    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, currentUser.email);
            showToast(`Password reset email sent to ${currentUser.email}`, 'success');
        } catch (err) {
            console.error('Password reset error:', err);
            showToast('Failed to send reset email. Try again later.', 'error');
        }
    };

    // Get initials for avatar fallback
    const getInitials = () => {
        const name = userData?.name || currentUser?.email || '';
        if (name.includes('@')) return name.charAt(0).toUpperCase();
        return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
    };

    const memberSince = userData?.createdAt?.toDate
        ? userData.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Recently';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-8"
            >
                {/* Header Profile Section */}
                <div className="glass-panel p-8 rounded-[2rem] border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                        <div className="flex items-center gap-5">
                            {/* Profile Avatar in Header */}
                            <div className="relative shrink-0">
                                {profilePhotoPreview || userData?.profilePhoto ? (
                                    <img
                                        src={profilePhotoPreview || userData?.profilePhoto}
                                        alt="Profile"
                                        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-brand-primary/20 shadow-lg"
                                    />
                                ) : (
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-xl md:text-2xl">{getInitials()}</span>
                                    </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white" title="Online" />
                            </div>
                            <div>
                                <p className="text-brand-secondary font-bold text-sm tracking-widest uppercase mb-1">Client Portal</p>
                                <h1 className="text-3xl md:text-4xl font-black font-heading mb-1 text-gray-900">Welcome back, {userData?.name || currentUser?.email?.split('@')[0]}</h1>
                                <p className="text-gray-500 font-medium text-sm">Manage your digital assets, track project progress, and view invoices.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setActiveTab('profile')} className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors font-bold text-sm text-gray-900 flex items-center gap-2">
                                <UserCircle className="w-4 h-4" />
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
                        <div key={i} className="glass-panel p-6 rounded-2xl flex items-center gap-5 border border-gray-200 hover:border-brand-primary/30 transition-colors bg-gray-50">
                            <div className="p-3.5 bg-white rounded-xl shadow-inner border border-gray-200">{stat.icon}</div>
                            <div>
                                <p className="text-sm text-gray-500 font-semibold mb-1">{stat.title}</p>
                                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area with Internal Tabs */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar Nav */}
                    <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide snap-x">
                        {[
                            { id: 'profile', icon: <UserCircle className="w-5 h-5" />, label: 'My Profile' },
                            { id: 'tracking', icon: <Clock className="w-5 h-5" />, label: 'Order Tracking' },
                            { id: 'invoices', icon: <FileText className="w-5 h-5" />, label: 'Invoices & Billing' },
                            { id: 'referral', icon: <Gift className="w-5 h-5" />, label: 'Refer & Earn' },
                            { id: 'support', icon: <LifeBuoy className="w-5 h-5" />, label: 'Support Tickets' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-5 py-4 rounded-xl font-bold transition-all text-sm whitespace-nowrap lg:w-full text-left shrink-0 snap-start ${activeTab === tab.id ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30' : 'text-gray-500 hover:bg-white/5 hover:text-gray-900 border border-transparent'}`}
                            >
                                {tab.icon} {tab.label}
                                {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="lg:col-span-9">
                        <div className="glass-panel p-6 sm:p-8 rounded-[2rem] border border-gray-200 bg-gray-50 min-h-[500px]">

                            {/* ═══════════════════ PROFILE TAB ═══════════════════ */}
                            {activeTab === 'profile' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
                                    <h2 className="text-2xl font-bold font-heading text-gray-900 border-b border-gray-200 pb-4">My Profile</h2>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                        {/* Left Column — Photo & Account Info */}
                                        <div className="flex flex-col gap-6">
                                            {/* Profile Photo Card */}
                                            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center gap-4 shadow-sm">
                                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                                    {profilePhotoPreview ? (
                                                        <img
                                                            src={profilePhotoPreview}
                                                            alt="Profile"
                                                            className="w-28 h-28 rounded-2xl object-cover border-2 border-brand-primary/20 shadow-md group-hover:opacity-80 transition-opacity"
                                                        />
                                                    ) : (
                                                        <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-md group-hover:opacity-80 transition-opacity">
                                                            <span className="text-white font-bold text-3xl">{getInitials()}</span>
                                                        </div>
                                                    )}
                                                    {/* Camera Overlay */}
                                                    <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {photoUploading ? (
                                                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                                                        ) : (
                                                            <Camera className="w-6 h-6 text-white" />
                                                        )}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={handlePhotoUpload}
                                                        accept="image/*"
                                                        className="hidden"
                                                    />
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-bold text-gray-900">{userData?.name || 'User'}</p>
                                                    <p className="text-xs text-gray-500">{currentUser?.email}</p>
                                                </div>
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={photoUploading}
                                                    className="w-full text-center px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                >
                                                    {photoUploading ? 'Uploading...' : 'Change Photo'}
                                                </button>
                                            </div>

                                            {/* Account Info Card */}
                                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Account Info</h3>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <CalendarDays className="w-4 h-4 text-gray-400" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Member Since</p>
                                                            <p className="text-sm font-semibold text-gray-900">{memberSince}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Account Type</p>
                                                            <p className="text-sm font-semibold text-gray-900 capitalize">{userData?.role || 'Customer'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <ShoppingBag className="w-4 h-4 text-brand-primary" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Total Orders</p>
                                                            <p className="text-sm font-semibold text-gray-900">{orders.length}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <DollarSign className="w-4 h-4 text-blue-500" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Total Investment</p>
                                                            <p className="text-sm font-semibold text-gray-900">₹{totalInvestment.toLocaleString('en-IN')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quick Actions Card */}
                                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Quick Actions</h3>
                                                <div className="flex flex-col gap-2">
                                                    <Link to="/services" className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                                        <div className="flex items-center gap-3">
                                                            <ShoppingBag className="w-4 h-4 text-brand-primary" />
                                                            <span className="text-sm font-semibold text-gray-700">Browse Services</span>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-primary transition-colors" />
                                                    </Link>
                                                    <button onClick={() => setActiveTab('tracking')} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group w-full">
                                                        <div className="flex items-center gap-3">
                                                            <Clock className="w-4 h-4 text-amber-500" />
                                                            <span className="text-sm font-semibold text-gray-700">Track Orders</span>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-primary transition-colors" />
                                                    </button>
                                                    <a href="https://wa.me/917017978807?text=Hi, I need help with my MakeMyPortal account." target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                                        <div className="flex items-center gap-3">
                                                            <Headphones className="w-4 h-4 text-[#25D366]" />
                                                            <span className="text-sm font-semibold text-gray-700">Contact Support</span>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-primary transition-colors" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column — Edit Form */}
                                        <div className="lg:col-span-2">
                                            <form onSubmit={handleProfileSave} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                                                <div className="flex items-center justify-between mb-6">
                                                    <h3 className="font-bold text-gray-900 text-lg">Personal Information</h3>
                                                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Edit Mode</span>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                    {/* Full Name */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-semibold text-gray-600 flex items-center gap-1.5">
                                                            <UserCircle className="w-3.5 h-3.5" /> Full Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={profileForm.name}
                                                            onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-sm"
                                                            placeholder="Your full name"
                                                        />
                                                    </div>

                                                    {/* Organization */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-semibold text-gray-600 flex items-center gap-1.5">
                                                            <Building className="w-3.5 h-3.5" /> Organization
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={profileForm.organization}
                                                            onChange={(e) => setProfileForm(p => ({ ...p, organization: e.target.value }))}
                                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-sm"
                                                            placeholder="Company / School"
                                                        />
                                                    </div>

                                                    {/* Email (Read Only) */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-semibold text-gray-600 flex items-center gap-1.5">
                                                            <Mail className="w-3.5 h-3.5" /> Email Address
                                                        </label>
                                                        <input
                                                            type="email"
                                                            value={currentUser?.email || ''}
                                                            readOnly
                                                            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed text-sm"
                                                            title="Email cannot be changed"
                                                        />
                                                    </div>

                                                    {/* Phone */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-semibold text-gray-600 flex items-center gap-1.5">
                                                            <Phone className="w-3.5 h-3.5" /> Phone Number
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            value={profileForm.phone}
                                                            onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-sm"
                                                            placeholder="+91 XXXXX XXXXX"
                                                        />
                                                    </div>

                                                    {/* Address */}
                                                    <div className="sm:col-span-2 space-y-1.5">
                                                        <label className="text-sm font-semibold text-gray-600 flex items-center gap-1.5">
                                                            <MapPin className="w-3.5 h-3.5" /> Address
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={profileForm.address}
                                                            onChange={(e) => setProfileForm(p => ({ ...p, address: e.target.value }))}
                                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-sm"
                                                            placeholder="Street address"
                                                        />
                                                    </div>

                                                    {/* City */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-semibold text-gray-600">City</label>
                                                        <input
                                                            type="text"
                                                            value={profileForm.city}
                                                            onChange={(e) => setProfileForm(p => ({ ...p, city: e.target.value }))}
                                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-sm"
                                                            placeholder="City"
                                                        />
                                                    </div>

                                                    {/* State */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-semibold text-gray-600">State</label>
                                                        <input
                                                            type="text"
                                                            value={profileForm.state}
                                                            onChange={(e) => setProfileForm(p => ({ ...p, state: e.target.value }))}
                                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-sm"
                                                            placeholder="State"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Save Button */}
                                                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                                                    <button
                                                        type="submit"
                                                        disabled={profileSaving}
                                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-blue-600 text-white font-bold text-sm shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                                                    >
                                                        {profileSaving ? (
                                                            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                                        ) : (
                                                            <><Save className="w-4 h-4" /> Save Changes</>
                                                        )}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handlePasswordReset}
                                                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
                                                    >
                                                        <KeyRound className="w-4 h-4" /> Reset Password
                                                    </button>
                                                </div>

                                                <p className="text-xs text-gray-400 mt-4 text-center">
                                                    A password reset link will be sent to your registered email address.
                                                </p>
                                            </form>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ═══════════════════ ORDER TRACKING TAB ═══════════════════ */}
                            {activeTab === 'tracking' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
                                    <h2 className="text-2xl font-bold font-heading text-gray-900 border-b border-gray-200 pb-4">Live Order Tracking</h2>

                                    {loading ? (
                                        <div className="animate-pulse space-y-6">
                                            {[1, 2].map(i => <div key={i} className="h-48 bg-white/5 rounded-2xl border border-gray-200" />)}
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="text-center py-20 text-gray-500">
                                            <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                            <p className="text-lg font-semibold text-gray-900 mb-2">No orders yet</p>
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
                                                    <div key={order.id} className="border border-gray-200 rounded-2xl p-6 bg-white/50 shadow-inner">
                                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                                            <div>
                                                                <div className="flex items-center gap-3 mb-1">
                                                                    <h3 className="text-xl font-bold text-gray-900">{order.serviceName}</h3>
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
                                                            <div className="h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-200">
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
                                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-dark-900 transition-all ${step.completed ? 'bg-gradient-to-br from-brand-primary to-brand-secondary text-white' : order.currentStep === idx ? 'bg-gray-50 border-brand-primary text-brand-primary' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                                                                            {step.completed ? <CheckCircle2 className="w-5 h-5" /> : <CircleDashed className={`w-5 h-5 ${order.currentStep === idx ? 'animate-spin-slow' : ''}`} />}
                                                                        </div>
                                                                        <div className="text-left sm:text-center">
                                                                            <p className={`text-sm font-bold ${step.completed ? 'text-gray-900' : order.currentStep === idx ? 'text-brand-primary' : 'text-gray-500'}`}>{step.title}</p>
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

                            {/* ═══════════════════ INVOICES TAB ═══════════════════ */}
                            {activeTab === 'invoices' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h2 className="text-2xl font-bold font-heading text-gray-900 border-b border-gray-200 pb-4 mb-8">Invoices & Billing</h2>
                                    {loading ? (
                                        <div className="animate-pulse space-y-4">
                                            {[1, 2].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl border border-gray-200" />)}
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="text-center py-20 text-gray-500">
                                            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                            <p>No billing history found.</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            {orders.map((inv) => (
                                                <div key={inv.id} className="flex justify-between items-center p-4 rounded-xl border border-gray-200 bg-white/30 hover:bg-white/60 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-white/5 rounded-lg"><FileText className="w-5 h-5 text-brand-secondary" /></div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 text-sm">INV-{inv.id.substring(0, 6).toUpperCase()}</p>
                                                            <p className="text-xs text-gray-500">{inv.serviceName} • {inv.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <p className="font-bold text-gray-900 tracking-wide">{inv.price}</p>
                                                        <span className={`px-3 py-1 rounded-md text-xs font-bold ${inv.status === 'completed' || inv.status === 'delivered' ? 'bg-green-500/10 text-emerald-400' : 'bg-[#f59e0b]/10 text-[#f59e0b]'}`}>{inv.status === 'completed' || inv.status === 'delivered' ? 'Paid' : 'Pending'}</span>

                                                        {inv.status === 'completed' || inv.status === 'delivered' ? (
                                                            <button
                                                                className="text-brand-primary hover:text-gray-900 transition-colors text-sm font-bold flex items-center gap-1 bg-brand-primary/10 px-3 py-1.5 rounded-lg border border-brand-primary/30 hover:bg-brand-primary hover:border-brand-primary"
                                                                onClick={() => {
                                                                    generateInvoice(inv, siteSettings);
                                                                    showToast("Downloading Invoice PDF...");
                                                                }}
                                                            >
                                                                Download PDF
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="text-gray-500 cursor-not-allowed text-sm font-bold opacity-50 px-3 py-1.5 border border-gray-200 rounded-lg"
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

                            {/* ═══════════════════ REFER & EARN TAB ═══════════════════ */}
                            {activeTab === 'referral' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
                                    <h2 className="text-2xl font-bold font-heading text-gray-900 border-b border-gray-200 pb-4">Refer & Earn</h2>

                                    {/* Referral Hero */}
                                    <div className="bg-gradient-to-br from-brand-primary/10 via-blue-50 to-purple-50 rounded-2xl border border-brand-primary/20 p-8 text-center relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-brand-primary/10 rounded-full blur-[80px] pointer-events-none" />
                                        <div className="relative z-10">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center mx-auto mb-4 shadow-lg">
                                                <Gift className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-black text-gray-900 mb-2">Invite Friends, Earn Rewards!</h3>
                                            <p className="text-gray-600 max-w-md mx-auto mb-6 text-sm">Share your referral code with friends. When they place their first order, you both get exciting discounts on your next project!</p>
                                        </div>
                                    </div>

                                    {/* Referral Code Section */}
                                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Your Referral Code</h3>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 font-mono font-bold text-lg text-brand-primary tracking-widest text-center">
                                                {currentUser?.uid ? `MMP-${currentUser.uid.substring(0, 6).toUpperCase()}` : 'Loading...'}
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const code = `MMP-${currentUser.uid.substring(0, 6).toUpperCase()}`;
                                                    navigator.clipboard.writeText(code);
                                                    showToast('Referral code copied! 📋', 'success');
                                                }}
                                                className="px-5 py-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200 group"
                                                title="Copy Code"
                                            >
                                                <Copy className="w-5 h-5 text-gray-500 group-hover:text-brand-primary transition-colors" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Share Options */}
                                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Share With Friends</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <a
                                                href={`https://wa.me/?text=${encodeURIComponent(`🚀 MakeMyPortal pe amazing digital services milti hai — websites, logos, portfolios sab kuch! Mera referral code use karo aur discount pao: MMP-${currentUser?.uid?.substring(0, 6).toUpperCase() || ''} \n\nhttps://makemyportal.in`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-bold text-sm transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                                Share via WhatsApp
                                            </a>
                                            <button
                                                onClick={() => {
                                                    const text = `🚀 Check out MakeMyPortal for amazing websites, logos & digital services! Use my referral code: MMP-${currentUser?.uid?.substring(0, 6).toUpperCase() || ''} — https://makemyportal.in`;
                                                    navigator.clipboard.writeText(text);
                                                    showToast('Referral message copied! Share it anywhere 🎉', 'success');
                                                }}
                                                className="flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/30 text-brand-primary font-bold text-sm transition-colors"
                                            >
                                                <Share2 className="w-5 h-5" />
                                                Copy Share Message
                                            </button>
                                        </div>
                                    </div>

                                    {/* How It Works */}
                                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                        <h3 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider">How It Works</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                            {[
                                                { step: '1', title: 'Share Code', description: 'Share your unique referral code with friends & family', color: 'from-brand-primary to-purple-500' },
                                                { step: '2', title: 'Friend Orders', description: 'When they place their first order using your code', color: 'from-blue-500 to-cyan-500' },
                                                { step: '3', title: 'Both Earn!', description: 'You both get special discounts on your next project', color: 'from-emerald-500 to-green-500' },
                                            ].map((item) => (
                                                <div key={item.step} className="text-center">
                                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3 shadow-md`}>
                                                        <span className="text-white font-black text-lg">{item.step}</span>
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                                                    <p className="text-xs text-gray-500">{item.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ═══════════════════ SUPPORT TAB ═══════════════════ */}
                            {activeTab === 'support' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
                                    <h2 className="text-2xl font-bold font-heading text-gray-900 border-b border-gray-200 pb-4">Support Center</h2>

                                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                                            <LifeBuoy className="w-8 h-8 text-brand-primary" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Need Help?</h3>
                                        <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">Our engineering team is available via priority WhatsApp support. We typically respond within 30 minutes during business hours.</p>
                                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                            <a href="https://wa.me/917017978807?text=Hi, I need support for my MakeMyPortal account." target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm transition-colors shadow-md"
                                            >
                                                💬 Chat on WhatsApp
                                            </a>
                                            <a href="mailto:support@makemyportal.in" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm transition-colors">
                                                ✉️ Email Support
                                            </a>
                                        </div>
                                    </div>

                                    {/* FAQ Section */}
                                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Common Questions</h3>
                                        <div className="flex flex-col gap-3">
                                            {[
                                                { q: 'How long does a website project take?', a: 'Typically 7-14 business days depending on complexity and requirements.' },
                                                { q: 'Can I request revisions?', a: 'Yes! We offer revision rounds included in every package. Unlimited minor changes.' },
                                                { q: 'What payment methods do you accept?', a: 'UPI, Bank Transfer, and all major payment gateways.' },
                                                { q: 'Do you provide hosting & maintenance?', a: 'Yes, we offer AMC plans for hosting, maintenance, and regular updates.' },
                                            ].map((faq, idx) => (
                                                <details key={idx} className="group border border-gray-100 rounded-xl overflow-hidden">
                                                    <summary className="px-5 py-4 cursor-pointer font-semibold text-sm text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                                        {faq.q}
                                                        <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                                                    </summary>
                                                    <p className="px-5 pb-4 text-sm text-gray-500">{faq.a}</p>
                                                </details>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </div>
                    </div>

                </div>
            </motion.div>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
        </div>
    );
};

export default CustomerDashboard;
