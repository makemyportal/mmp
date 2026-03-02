import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [organization, setOrganization] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, googleLogin } = useAuth();
    const navigate = useNavigate();

    const getFirebaseErrorMessage = (code) => {
        switch (code) {
            case 'auth/email-already-in-use':
                return 'An account with this email already exists. Try signing in.';
            case 'auth/weak-password':
                return 'Password is too weak. Use at least 6 characters.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/too-many-requests':
                return 'Too many attempts. Please try again later.';
            case 'auth/network-request-failed':
                return 'Network error. Please check your internet connection.';
            default:
                return 'Failed to create account. Please try again.';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters long');
        }

        setError('');
        setLoading(true);

        try {
            // 1. Create Auth User
            const userCredential = await signup(email, password);

            // 2. Save additional profile info to Firestore
            try {
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    name,
                    organization,
                    email,
                    role: 'customer',
                    createdAt: serverTimestamp()
                });
            } catch (firestoreErr) {
                console.warn('Profile save failed, user still created:', firestoreErr);
            }

            navigate('/dashboard');
        } catch (err) {
            setError(getFirebaseErrorMessage(err.code));
            console.error('Registration error:', err);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

            {/* Background Gradients */}
            <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-brand-secondary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-brand-primary/30 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl relative z-10"
            >
                <div className="glass-panel p-8 sm:p-10 rounded-3xl border-gray-200 shadow-2xl relative">

                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold font-heading mb-2">Create an Account</h2>
                        <p className="text-gray-500 text-sm">Join MakeMyPortal to access premium digital services.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span className="text-sm text-red-200">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-600 block ml-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-600 block ml-1">Organization / School</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Building className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        value={organization}
                                        onChange={(e) => setOrganization(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600 block ml-1">Email address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-600 block ml-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-600 block ml-1">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 mt-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-gray-900 bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-medium">OR</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Google Sign Up */}
                    <button
                        onClick={async () => {
                            setError('');
                            setLoading(true);
                            try {
                                const result = await googleLogin();
                                const userDoc = await getDoc(doc(db, 'users', result.user.uid));
                                if (userDoc.exists() && userDoc.data().role === 'admin') {
                                    navigate('/admin');
                                } else {
                                    navigate('/dashboard');
                                }
                            } catch (err) {
                                if (err.code !== 'auth/popup-closed-by-user') {
                                    setError('Google sign-up failed. Please try again.');
                                }
                            }
                            setLoading(false);
                        }}
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-gray-900 hover:text-brand-secondary transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
