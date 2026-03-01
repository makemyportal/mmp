import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const getFirebaseErrorMessage = (code) => {
        switch (code) {
            case 'auth/user-not-found':
            case 'auth/invalid-credential':
                return 'Invalid email or password. Please try again.';
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again.';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later.';
            case 'auth/user-disabled':
                return 'This account has been disabled. Contact support.';
            case 'auth/network-request-failed':
                return 'Network error. Please check your internet connection.';
            default:
                return 'Failed to sign in. Please try again.';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        let userCredential;
        try {
            userCredential = await login(email, password);
        } catch (err) {
            setError(getFirebaseErrorMessage(err.code));
            console.error('Auth error:', err);
            setLoading(false);
            return;
        }

        // Auth succeeded — now try role-based routing (non-blocking)
        try {
            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
            if (userDoc.exists() && userDoc.data().role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            // Firestore error — user IS logged in, just navigate to default
            console.warn('Firestore role check failed, defaulting to dashboard:', err);
            navigate('/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-secondary/20 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-panel p-8 sm:p-10 rounded-3xl border-white/10 shadow-2xl relative">

                    <div className="flex justify-center mb-8 hidden">
                        <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary">
                            <Rocket className="text-white w-6 h-6 z-10" />
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold font-heading mb-2">Welcome Back</h2>
                        <p className="text-gray-400 text-sm">Sign in to your MakeMyPortal account</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span className="text-sm text-red-200">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300 block ml-1">Email address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-dark-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-sm font-medium text-gray-300">Password</label>
                                <a href="#" className="text-xs font-semibold text-brand-secondary hover:text-brand-primary transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-dark-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-white hover:text-brand-primary transition-colors">
                            Create one now
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
