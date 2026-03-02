import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Rocket, Home, LayoutGrid, Phone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, userData, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (e) {
            console.error("Failed to log out:", e);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Services', path: '/services', icon: LayoutGrid },
        { name: 'Contact', path: '/contact', icon: Phone },
    ];

    const handleNavClick = (e, path) => {
        setMobileMenuOpen(false);
        if (path.startsWith('/#')) {
            e.preventDefault();
            const id = path.replace('/#', '');
            if (location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.scrollTo(0, 0);
        }
    };

    return (
        <>
            {/* Top Navbar */}
            <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'glass-panel py-3' : 'bg-transparent py-4'}`}>
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group" onClick={() => window.scrollTo(0, 0)}>
                            <div className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary overflow-hidden shadow-lg">
                                <Rocket className="text-white w-4 h-4 md:w-5 md:h-5 z-10 group-hover:scale-110 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-white/20 transform rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 blur-[2px]" />
                            </div>
                            <span className="font-heading font-bold text-lg md:text-xl tracking-tight text-gray-900 drop-shadow-md">
                                MakeMy<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-[#06b6d4]">Portal</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            <div className="flex gap-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={(e) => handleNavClick(e, link.path)}
                                        className={`text-sm font-bold transition-colors hover:text-gray-900 relative group
                        ${location.pathname === link.path ? 'text-gray-900' : 'text-gray-500'}
                    `}
                                    >
                                        {link.name}
                                        <span className={`absolute -bottom-1.5 left-0 w-full h-[2px] rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary transform origin-left transition-transform duration-300 ${location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                                    </Link>
                                ))}
                            </div>

                            {currentUser ? (
                                <div className="flex gap-4 items-center">
                                    <Link to={userData?.role === 'admin' ? '/admin' : '/dashboard'} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                                        Dashboard
                                    </Link>
                                    <button onClick={handleLogout} className="relative group overflow-hidden rounded-xl bg-red-100 px-5 py-2.5 text-sm font-bold text-red-600 transition-all hover:bg-red-200 hover:scale-105 active:scale-95 border border-red-200">
                                        <span className="relative z-10 flex items-center gap-2">
                                            Sign Out
                                        </span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-4 items-center">
                                    <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                                        Sign In
                                    </Link>
                                    <Link to="/register" className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-2.5 text-sm font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:scale-105 active:scale-95">
                                        <span className="relative z-10 flex items-center gap-2">
                                            Get Free Consultation
                                        </span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation (App style) */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-200 z-40 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around items-center px-2 py-3">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={(e) => handleNavClick(e, link.path)}
                                className="flex flex-col items-center gap-1 min-w-[64px]"
                            >
                                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-500 hover:text-gray-900'}`}>
                                    <Icon className={`w-5 h-5 ${isActive ? 'fill-brand-primary/20' : ''}`} />
                                </div>
                                <span className={`text-[10px] font-bold ${isActive ? 'text-brand-primary' : 'text-gray-500'}`}>
                                    {link.name}
                                </span>
                            </Link>
                        );
                    })}

                    {/* Auth / Profile Link */}
                    {currentUser ? (
                        <Link
                            to={userData?.role === 'admin' ? '/admin' : '/dashboard'}
                            className="flex flex-col items-center gap-1 min-w-[64px]"
                        >
                            <div className={`p-1.5 rounded-xl transition-all ${location.pathname.includes('/dashboard') || location.pathname.includes('/admin') ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-500 hover:text-gray-900'}`}>
                                <User className={`w-5 h-5 ${location.pathname.includes('/dashboard') || location.pathname.includes('/admin') ? 'fill-brand-primary/20' : ''}`} />
                            </div>
                            <span className={`text-[10px] font-bold ${location.pathname.includes('/dashboard') || location.pathname.includes('/admin') ? 'text-brand-primary' : 'text-gray-500'}`}>
                                Profile
                            </span>
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="flex flex-col items-center gap-1 min-w-[64px]"
                        >
                            <div className={`p-1.5 rounded-xl transition-all ${location.pathname === '/login' ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-500 hover:text-gray-900'}`}>
                                <User className={`w-5 h-5 ${location.pathname === '/login' ? 'fill-brand-primary/20' : ''}`} />
                            </div>
                            <span className={`text-[10px] font-bold ${location.pathname === '/login' ? 'text-brand-primary' : 'text-gray-500'}`}>
                                Login
                            </span>
                        </Link>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;
