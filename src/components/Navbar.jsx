import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Rocket } from 'lucide-react';
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

    // Filtered out meaningless tabs, kept core functional ones.
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Catalog', path: '/services' },
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
        }
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-panel py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group" onClick={() => window.scrollTo(0, 0)}>
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary overflow-hidden shadow-lg">
                            <Rocket className="text-white w-5 h-5 z-10 group-hover:scale-110 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-white/20 transform rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 blur-[2px]" />
                        </div>
                        <span className="font-heading font-bold text-xl tracking-tight text-white drop-shadow-md">
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
                                    className={`text-sm font-bold transition-colors hover:text-white relative group
                    ${location.pathname === link.path ? 'text-white' : 'text-[#A1B3D1]'}
                  `}
                                >
                                    {link.name}
                                    <span className={`absolute -bottom-1.5 left-0 w-full h-[2px] rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary transform origin-left transition-transform duration-300 ${location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                                </Link>
                            ))}
                        </div>

                        {currentUser ? (
                            <div className="flex gap-4 items-center">
                                <Link to={userData?.role === 'admin' ? '/admin' : '/dashboard'} className="text-sm font-bold text-[#A1B3D1] hover:text-white transition-colors">
                                    Dashboard
                                </Link>
                                <button onClick={handleLogout} className="relative group overflow-hidden rounded-xl bg-red-600/80 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-opacity-90 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.3)] border border-red-500/50">
                                    <span className="relative z-10 flex items-center gap-2">
                                        Sign Out
                                    </span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-4 items-center">
                                <Link to="/login" className="text-sm font-bold text-[#A1B3D1] hover:text-white transition-colors">
                                    Sign In
                                </Link>
                                <Link to="/register" className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-brand-primary to-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:scale-105 active:scale-95">
                                    <span className="relative z-10 flex items-center gap-2">
                                        Get Free Consultation
                                    </span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-[#A1B3D1] hover:text-white focus:outline-none p-2"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass-panel border-t border-white/5 mt-2 overflow-hidden mx-4 bg-dark-900/95"
                    >
                        <div className="px-4 py-6 space-y-4 flex flex-col">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={(e) => handleNavClick(e, link.path)}
                                    className="block px-3 py-2 rounded-lg text-base font-bold text-[#A1B3D1] hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {currentUser ? (
                                <div className="border-t border-white/10 pt-4 mt-2 flex flex-col gap-3">
                                    <Link to={userData?.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-bold text-center text-[#A1B3D1] hover:text-white hover:bg-white/5 transition-colors">
                                        Dashboard
                                    </Link>
                                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block px-3 py-2 rounded-xl text-base font-bold text-center text-white bg-red-600/80 hover:bg-opacity-90 transition-colors w-full border border-red-500/50">
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="border-t border-white/10 pt-4 mt-2 flex flex-col gap-3">
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-bold text-center text-[#A1B3D1] hover:text-white hover:bg-white/5 transition-colors">
                                        Sign In
                                    </Link>
                                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-base font-bold text-center text-white bg-gradient-to-r from-brand-primary to-blue-600 hover:opacity-90 transition-colors shadow-lg">
                                        Get Free Consultation
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
