import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Check, Monitor, LayoutTemplate, Palette, GraduationCap, Bot, Lightbulb,
    CheckCircle2, Users, Layers, ArrowRight, Search, Star, Quote,
    MessageCircle, ChevronDown, ChevronUp, Zap, FileCheck, Rocket, Headphones,
    Shield, Clock, Heart, ShoppingCart, ExternalLink, Wrench, FolderKanban
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';
import BookingModal from '../components/BookingModal';

const Home = () => {
    const navigate = useNavigate();
    const { services } = useServices();
    const { settings } = useSettings();
    const { currentUser } = useAuth();
    const { clients, projects, tools, testimonials } = usePortfolio();
    const [searchQuery, setSearchQuery] = useState('');
    const [openFAQ, setOpenFAQ] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [heroActiveTab, setHeroActiveTab] = useState('SaaS Platforms');
    const whatsappNum = settings.whatsapp || '918077162909';

    const handleBookNow = (service) => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setSelectedService(service);
        setIsBookingOpen(true);
    };

    // Featured services - first 6 for homepage display
    const featuredServices = services.slice(0, 6);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const faqs = [
        { q: 'How long does it take to build a website?', a: 'Depending on complexity, a standard website takes 5-10 business days. Custom portals and SaaS platforms may take 2-6 weeks. We provide a clear timeline before starting.' },
        { q: 'Do you offer post-launch support?', a: 'Yes! All our plans include post-launch support ranging from 1 to 6 months. We also offer extended maintenance contracts for ongoing support.' },
        { q: 'Can I see a demo before starting?', a: 'Absolutely. We provide free consultations and can show you relevant portfolio pieces. We also create mockups before development begins.' },
        { q: 'What payment methods do you accept?', a: 'We accept UPI, bank transfers, and international payments. Projects start with a 50% advance, with the balance due on completion.' },
        { q: 'Do you provide source code access?', a: 'Yes, you receive full ownership level access of all source code and assets upon project completion. No lock-in.' },
    ];



    return (
        <div className="relative w-full overflow-hidden bg-white text-gray-900 font-sans selection:bg-brand-primary selection:text-gray-900">
            <Helmet>
                <title>MakeMyPortal | Premium Web Development & Digital Solutions</title>
                <meta name="description" content="MakeMyPortal delivers production-ready portals, AI applications, EdTech platforms, and custom websites for modern businesses." />
                <link rel="canonical" href="https://makemyportal.in/" />
            </Helmet>

            {/* --- ANIMATED BACKGROUND --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Gradient Mesh Blobs */}
                <motion.div animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.15, 0.95, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-[#7c3aed]/15 rounded-full blur-[120px]" />
                <motion.div animate={{ x: [0, -30, 25, 0], y: [0, 25, -35, 0], scale: [1, 0.9, 1.1, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-[15%] right-[-8%] w-[45%] h-[45%] bg-[#2563eb]/15 rounded-full blur-[120px]" />
                <motion.div animate={{ x: [0, 20, -25, 0], y: [0, -20, 30, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                    className="absolute bottom-[-5%] left-[25%] w-[35%] h-[35%] bg-[#06b6d4]/10 rounded-full blur-[100px]" />

                {/* Floating Service Pills */}
                {[
                    { text: '🌐 Web Dev', x: '8%', y: '18%', delay: 0, dur: 14 },
                    { text: '🎨 Branding', x: '82%', y: '15%', delay: 2, dur: 16 },
                    { text: '🤖 AI Portals', x: '75%', y: '65%', delay: 1, dur: 13 },
                    { text: '🛒 E-Commerce', x: '5%', y: '70%', delay: 3, dur: 15 },
                    { text: '📱 Mobile Apps', x: '88%', y: '40%', delay: 4, dur: 17 },
                    { text: '🎓 EdTech', x: '15%', y: '45%', delay: 1.5, dur: 12 },
                    { text: '📊 SaaS', x: '70%', y: '85%', delay: 2.5, dur: 14 },
                    { text: '⚡ SEO', x: '25%', y: '85%', delay: 0.5, dur: 16 },
                ].map((pill, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                            opacity: [0.25, 0.5, 0.25],
                            y: [0, -15, 5, -10, 0],
                            x: [0, 8, -5, 3, 0],
                            rotate: [0, 3, -2, 1, 0],
                            scale: [0.95, 1.05, 0.98, 1.02, 0.95],
                        }}
                        transition={{
                            duration: pill.dur,
                            repeat: Infinity,
                            delay: pill.delay,
                            ease: 'easeInOut',
                        }}
                        className="absolute hidden md:flex px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-sm text-xs font-bold text-gray-600 select-none"
                        style={{ left: pill.x, top: pill.y }}
                    >
                        {pill.text}
                    </motion.div>
                ))}

                {/* Decorative Dots */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={`dot-${i}`}
                        animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 6 + i * 2, repeat: Infinity, delay: i * 1.2 }}
                        className="absolute w-2 h-2 rounded-full bg-brand-primary/30"
                        style={{
                            left: `${15 + i * 15}%`,
                            top: `${20 + (i % 3) * 25}%`,
                        }}
                    />
                ))}
            </div>

            {/* ═══════════════════════════════════ HERO SECTION ═══════════════════════════════════ */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center z-10 flex flex-col items-center">

                {/* ═══ PREMIUM TECH PATTERN — ORBITING RINGS + GEOMETRIC SHAPES ═══ */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ maskImage: 'radial-gradient(ellipse 85% 75% at 50% 45%, black 20%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 50% 45%, black 20%, transparent 70%)' }}>

                    {/* Orbiting Concentric Rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        {[
                            { size: 320, dur: 30, opacity: 0.08, dash: '8 16', width: 1.5, dir: false },
                            { size: 480, dur: 45, opacity: 0.06, dash: '4 20', width: 1, dir: true },
                            { size: 640, dur: 60, opacity: 0.05, dash: '12 24', width: 0.8, dir: false },
                            { size: 800, dur: 80, opacity: 0.03, dash: '6 30', width: 0.5, dir: true },
                        ].map((ring, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full hero-orbit"
                                style={{
                                    width: ring.size,
                                    height: ring.size,
                                    top: -ring.size / 2,
                                    left: -ring.size / 2,
                                    border: `${ring.width}px dashed rgba(124, 58, 237, ${ring.opacity * 3})`,
                                    animationDuration: `${ring.dur}s`,
                                    animationDirection: ring.dir ? 'reverse' : 'normal',
                                }}
                            />
                        ))}

                        {/* Center Glow Orb */}
                        <div className="absolute -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-brand-primary/20 via-blue-500/15 to-cyan-400/10 blur-[60px] hero-glow-pulse" />
                    </div>

                    {/* Floating Geometric Shapes */}
                    {[
                        { shape: 'hexagon', x: '15%', y: '20%', size: 50, dur: 22, delay: 0, rot: 60, color: 'rgba(124,58,237,0.08)' },
                        { shape: 'triangle', x: '80%', y: '25%', size: 40, dur: 18, delay: 2, rot: -45, color: 'rgba(37,99,235,0.07)' },
                        { shape: 'diamond', x: '75%', y: '70%', size: 35, dur: 25, delay: 1, rot: 45, color: 'rgba(6,182,212,0.08)' },
                        { shape: 'circle', x: '10%', y: '65%', size: 45, dur: 20, delay: 3, rot: 0, color: 'rgba(124,58,237,0.06)' },
                        { shape: 'square', x: '88%', y: '50%', size: 30, dur: 28, delay: 1.5, rot: 30, color: 'rgba(37,99,235,0.06)' },
                        { shape: 'hexagon', x: '25%', y: '80%', size: 35, dur: 24, delay: 4, rot: -30, color: 'rgba(6,182,212,0.07)' },
                        { shape: 'triangle', x: '55%', y: '10%', size: 30, dur: 16, delay: 2.5, rot: 90, color: 'rgba(124,58,237,0.05)' },
                    ].map((geo, i) => (
                        <motion.div
                            key={`geo-${i}`}
                            animate={{
                                y: [0, -12, 5, -8, 0],
                                rotate: [geo.rot, geo.rot + 90, geo.rot + 180, geo.rot + 270, geo.rot + 360],
                                scale: [1, 1.08, 0.95, 1.04, 1],
                            }}
                            transition={{
                                duration: geo.dur,
                                repeat: Infinity,
                                delay: geo.delay,
                                ease: 'easeInOut',
                            }}
                            className="absolute"
                            style={{ left: geo.x, top: geo.y }}
                        >
                            <svg width={geo.size} height={geo.size} viewBox="0 0 50 50" className="drop-shadow-sm">
                                {geo.shape === 'hexagon' && (
                                    <polygon points="25,2 46,14 46,36 25,48 4,36 4,14" fill="none" stroke={geo.color} strokeWidth="1.5" />
                                )}
                                {geo.shape === 'triangle' && (
                                    <polygon points="25,5 45,42 5,42" fill="none" stroke={geo.color} strokeWidth="1.5" />
                                )}
                                {geo.shape === 'diamond' && (
                                    <polygon points="25,2 48,25 25,48 2,25" fill="none" stroke={geo.color} strokeWidth="1.5" />
                                )}
                                {geo.shape === 'circle' && (
                                    <circle cx="25" cy="25" r="22" fill="none" stroke={geo.color} strokeWidth="1.5" strokeDasharray="4 6" />
                                )}
                                {geo.shape === 'square' && (
                                    <rect x="5" y="5" width="40" height="40" rx="4" fill="none" stroke={geo.color} strokeWidth="1.5" />
                                )}
                            </svg>
                        </motion.div>
                    ))}

                    {/* Shooting Stars / Comets */}
                    {[
                        { x1: '10%', y1: '30%', angle: 25, len: 120, dur: 4, delay: 0 },
                        { x1: '70%', y1: '15%', angle: 155, len: 100, dur: 5, delay: 2 },
                        { x1: '30%', y1: '75%', angle: 340, len: 90, dur: 4.5, delay: 3.5 },
                    ].map((star, i) => (
                        <div
                            key={`star-${i}`}
                            className="absolute hero-shooting-star"
                            style={{
                                left: star.x1,
                                top: star.y1,
                                width: star.len,
                                height: 2,
                                background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.4) 40%, rgba(37,99,235,0.6) 70%, transparent 100%)',
                                transform: `rotate(${star.angle}deg)`,
                                animationDuration: `${star.dur}s`,
                                animationDelay: `${star.delay}s`,
                                borderRadius: 4,
                            }}
                        />
                    ))}

                    {/* Tiny Floating Particles */}
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={`particle-${i}`}
                            animate={{
                                y: [0, -(10 + Math.random() * 20), 0],
                                x: [0, (Math.random() - 0.5) * 15, 0],
                                opacity: [0.15, 0.4, 0.15],
                            }}
                            transition={{
                                duration: 4 + Math.random() * 6,
                                repeat: Infinity,
                                delay: i * 0.6,
                                ease: 'easeInOut',
                            }}
                            className="absolute rounded-full"
                            style={{
                                width: 3 + Math.random() * 4,
                                height: 3 + Math.random() * 4,
                                left: `${8 + i * 7.5}%`,
                                top: `${15 + (i % 4) * 20}%`,
                                background: i % 3 === 0 ? '#7c3aed' : i % 3 === 1 ? '#2563eb' : '#06b6d4',
                            }}
                        />
                    ))}
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="w-full flex flex-col items-center">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-lg border border-gray-200/80 text-gray-600 text-sm font-semibold mb-8 shadow-lg shadow-black/5"
                    >
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        Premium Digital Studio
                    </motion.div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] mb-6 font-heading tracking-tighter">
                        We Build <br className="hidden sm:block" />
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={heroActiveTab}
                                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-blue-600 to-[#06b6d4]"
                            >
                                {heroActiveTab}
                            </motion.span>
                        </AnimatePresence>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        Stop using templates. We engineer bespoke, production-ready software that scales your business and dominates your market.
                    </motion.p>

                    {/* Interactive Selector with glow */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative flex flex-wrap items-center justify-center gap-2 mb-12 p-2 rounded-2xl md:rounded-full bg-white/70 backdrop-blur-xl border border-gray-200/80 shadow-xl shadow-black/5"
                    >
                        {['SaaS Platforms', 'AI Portals', 'E-Commerce', 'Websites'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setHeroActiveTab(tab)}
                                className="relative px-6 py-3 rounded-xl md:rounded-full text-sm font-bold transition-all duration-300"
                            >
                                {heroActiveTab === tab && (
                                    <motion.div
                                        layoutId="heroTabBg"
                                        className="absolute inset-0 bg-gradient-to-r from-brand-primary to-blue-600 rounded-xl md:rounded-full shadow-lg shadow-brand-primary/25"
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className={`relative z-10 transition-colors duration-300 ${heroActiveTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                                    {tab}
                                </span>
                            </button>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
                    >
                        <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gray-900 text-white font-bold hover:bg-brand-primary hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
                            Start Your Project <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/services" className="w-full sm:w-auto px-8 py-4 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300 font-bold text-gray-900 flex items-center justify-center">
                            Explore Systems
                        </Link>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap items-center gap-6 mt-12 justify-center"
                    >
                        {[{ icon: Shield, text: 'Enterprise Grade', clr: 'text-emerald-500' }, { icon: Zap, text: 'Built for Speed', clr: 'text-amber-500' }, { icon: CheckCircle2, text: 'Custom Engineered', clr: 'text-blue-500' }].map((b, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 + i * 0.1 }}
                                className="flex items-center gap-2 text-xs text-gray-700 font-bold uppercase tracking-wider px-3 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-gray-100"
                            >
                                <b.icon className={`w-4 h-4 ${b.clr}`} /> {b.text}
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══════════════════════════════════ MOBILE QUICK CATEGORIES (TECH UI) ═══════════════════════════════════ */}
            <div className="md:hidden w-full px-4 mb-10 relative z-20">
                <div className="grid grid-cols-4 gap-3">
                    {[
                        { icon: <Monitor className="w-6 h-6" />, label: 'Websites', bg: 'bg-blue-50', color: 'text-blue-600' },
                        { icon: <ShoppingCart className="w-6 h-6" />, label: 'E-Comm', bg: 'bg-emerald-50', color: 'text-emerald-600' },
                        { icon: <Bot className="w-6 h-6" />, label: 'AI Portals', bg: 'bg-brand-primary/10', color: 'text-brand-primary' },
                        { icon: <Palette className="w-6 h-6" />, label: 'Branding', bg: 'bg-orange-50', color: 'text-orange-500' },
                        { icon: <LayoutTemplate className="w-6 h-6" />, label: 'SaaS App', bg: 'bg-purple-50', color: 'text-purple-600' },
                        { icon: <GraduationCap className="w-6 h-6" />, label: 'EdTech', bg: 'bg-teal-50', color: 'text-teal-600' },
                        { icon: <Search className="w-6 h-6" />, label: 'Tech SEO', bg: 'bg-pink-50', color: 'text-pink-600' },
                        { icon: <Layers className="w-6 h-6" />, label: 'All Svcs', bg: 'bg-gray-100', color: 'text-gray-700' },
                    ].map((cat, i) => (
                        <div key={i} onClick={() => navigate('/services')} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                            <div className={`w-[60px] h-[60px] rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 ${cat.bg} group-active:scale-95 transition-transform`}>
                                <div className={cat.color}>{cat.icon}</div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 text-center uppercase tracking-tight">{cat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════ STATS BAR ═══════════════════════════════════ */}
            <div className="relative max-w-6xl mx-auto px-4 z-20 mb-16 md:mb-24 mt-4 md:mt-8">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
                    className="p-8 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-gray-700 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-700">
                    {[
                        { num: '300+', label: 'Projects Delivered', icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" /> },
                        { num: '99%', label: 'Client Satisfaction', icon: <Users className="w-6 h-6 text-violet-400" /> },
                        { num: '24/7', label: 'System Uptime', icon: <Monitor className="w-6 h-6 text-cyan-400" /> },
                        { num: '50+', label: 'Enterprise Apps', icon: <Layers className="w-6 h-6 text-amber-400" /> }
                    ].map((stat, i) => (
                        <div key={i} className={`flex-1 flex flex-col items-center justify-center w-full ${i > 0 ? 'pt-8 md:pt-0' : ''}`}>
                            <div className="p-3 rounded-2xl bg-white/10 mb-4 hover:bg-white/15 transition-colors cursor-default">
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">{stat.num}</h3>
                            <p className="text-sm text-gray-400 font-semibold tracking-wider uppercase text-center">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* ═══════════════════════════════════ OUR SERVICES ═══════════════════════════════════ */}
            <section id="services" className="py-12 md:py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[150px] -z-10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-sm font-bold tracking-widest text-[#06b6d4] uppercase mb-3">What We Do</h2>
                        <h3 className="text-4xl md:text-5xl font-black font-heading mb-6 tracking-tight">A Suite of Premium Digital Services.</h3>
                        <p className="text-gray-600 text-lg">We combine high-end design with robust engineering to create platforms that dominate their markets.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 relative z-10">
                        {[
                            { icon: <LayoutTemplate className="w-6 h-6" />, title: 'SaaS & Web Portals', desc: 'Dashboards, CRMs & enterprise apps.', iconBg: 'bg-gradient-to-br from-violet-500 to-indigo-600', color: 'from-violet-600 to-indigo-600' },
                            { icon: <Bot className="w-6 h-6" />, title: 'AI Integration', desc: 'Custom LLM-powered business tools.', iconBg: 'bg-gradient-to-br from-pink-500 to-rose-500', color: 'from-pink-500 to-rose-500' },
                            { icon: <Monitor className="w-6 h-6" />, title: 'Website Dev', desc: 'Ultra-fast, bespoke corporate sites.', iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500', color: 'from-blue-500 to-cyan-500' },
                            { icon: <ShoppingCart className="w-6 h-6" />, title: 'E-Commerce', desc: 'Scalable online stores & marketplaces.', iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500', color: 'from-emerald-500 to-teal-500' },
                            { icon: <GraduationCap className="w-6 h-6" />, title: 'EdTech', desc: 'LMS platforms & exam systems.', iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500', color: 'from-amber-500 to-orange-500' },
                            { icon: <Palette className="w-6 h-6" />, title: 'Branding', desc: 'Logos, identity & brand packages.', iconBg: 'bg-gradient-to-br from-fuchsia-500 to-purple-600', color: 'from-fuchsia-500 to-purple-600' }
                        ].map((service, i) => (
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.1 }} key={i}
                                className="group relative p-5 md:p-8 rounded-2xl md:rounded-3xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-xl flex flex-col overflow-hidden"
                            >
                                {/* Background Accent */}
                                <div className={`absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br ${service.color} opacity-[0.03] group-hover:opacity-[0.08] rounded-full blur-3xl -mr-10 -mt-10 transition-opacity duration-700 pointer-events-none`} />

                                <div className={`w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl flex items-center justify-center ${service.iconBg} mb-4 md:mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500 z-10`}>
                                    <div className="text-white">
                                        {service.icon}
                                    </div>
                                </div>

                                <div className="z-10 flex flex-col h-full w-full">
                                    <h4 className="text-base md:text-xl font-black mb-1 md:mb-2 text-gray-900 tracking-tight leading-tight">{service.title}</h4>
                                    <p className="text-gray-600 font-medium mb-4 md:mb-6 flex-1 text-xs md:text-sm leading-relaxed">{service.desc}</p>
                                    <Link to="/services" className="inline-flex items-center text-[11px] md:text-sm font-bold text-brand-primary group-hover:text-violet-700 transition-colors mt-auto w-fit">
                                        Explore <ArrowRight className="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-1.5 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════ FEATURED SERVICES (PURCHASABLE) ═══════════════════════════════════ */}
            <section className="py-12 md:py-24 relative">
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-secondary/5 rounded-full blur-[150px] -z-10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-sm font-bold tracking-widest text-brand-secondary uppercase mb-3">Popular Plans</h2>
                        <h3 className="text-4xl md:text-5xl font-black font-heading mb-6 tracking-tight">Start Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Today</span></h3>
                        <p className="text-gray-600 text-lg">Choose a plan that fits your needs. {currentUser ? 'Click Book Now to get started instantly.' : 'Sign in to book directly.'}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                        {featuredServices.map((service, i) => (
                            <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(124,58,237,0.12)] hover:border-violet-200 transition-all duration-500 group flex flex-col">
                                {/* Image */}
                                <div className="h-44 overflow-hidden relative shrink-0">
                                    <img src={service.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80'}
                                        alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                                    <span className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-md text-gray-900 shadow-sm uppercase tracking-wider">
                                        {service.category.replace(/[^a-zA-Z\s]/g, '')}
                                    </span>
                                    <div className="absolute bottom-3 right-3">
                                        <span className="px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-md text-sm font-black text-gray-900 shadow-sm">{service.price}</span>
                                    </div>
                                </div>

                                <div className="p-5 md:p-6 flex flex-col flex-1">
                                    <h4 className="text-lg font-black text-gray-900 mb-2 tracking-tight leading-snug">{service.title}</h4>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{service.description}</p>

                                    {/* Features */}
                                    <ul className="space-y-2 mb-5 flex-1">
                                        {service.features?.slice(0, 3).map((f, idx) => (
                                            <li key={idx} className="text-sm text-gray-700 flex items-center gap-2.5 font-medium">
                                                <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                                    <Check className="w-3 h-3 text-emerald-500" />
                                                </div>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    <button onClick={() => handleBookNow(service)}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-sm shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-auto">
                                        <ShoppingCart className="w-4 h-4" /> Book Now
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/services" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-bold hover:border-violet-300 hover:shadow-lg transition-all hover:scale-105">
                            View All {services.length} Services <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════ HOW IT WORKS ═══════════════════════════════════ */}
            <section className="py-12 md:py-24 bg-gray-50 border-y border-gray-200 relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold tracking-widest text-brand-primary uppercase mb-3">Process</h2>
                        <h3 className="text-4xl md:text-5xl font-black font-heading tracking-tight">How It Works</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: MessageCircle, title: 'Consultation', desc: 'Share your vision with us through a free consultation call.', step: '01' },
                            { icon: FileCheck, title: 'Planning', desc: 'We create a detailed roadmap with milestones and timelines.', step: '02' },
                            { icon: Rocket, title: 'Development', desc: 'Our team builds your solution with regular progress updates.', step: '03' },
                            { icon: Headphones, title: 'Launch & Support', desc: 'We deploy, test, and provide ongoing maintenance support.', step: '04' },
                        ].map((step, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="relative text-center group">
                                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-brand-primary/40 transition-all duration-300">
                                    <step.icon className="w-8 h-8 text-brand-primary" />
                                </div>
                                <span className="text-xs font-black text-brand-primary/50 uppercase tracking-widest block mb-2">Step {step.step}</span>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                                <p className="text-sm text-gray-700 font-medium">{step.desc}</p>
                                {i < 3 && <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-brand-primary/30 to-transparent" />}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════ INDUSTRIES ═══════════════════════════════════ */}
            <section id="solutions" className="py-12 md:py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-sm font-bold tracking-widest text-[#10b981] uppercase mb-3">Industries</h2>
                            <h3 className="text-3xl md:text-5xl font-black font-heading tracking-tight sm:leading-tight">Tailored Solutions for Every Sector.</h3>
                        </div>
                        <Link to="/services" className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-gray-200 font-bold transition-colors">
                            View All Services <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { title: 'Tech Startups', img: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80', span: 'col-span-1 sm:col-span-2 lg:col-span-2 row-span-2' },
                            { title: 'Educational Institutes', img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&q=80', span: 'col-span-1' },
                            { title: 'E-Commerce', img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&q=80', span: 'col-span-1' },
                            { title: 'Personal Brands', img: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=500&q=80', span: 'col-span-1 sm:col-span-2 lg:col-span-2' }
                        ].map((ind, i) => (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }} key={i}
                                className={`group rounded-3xl overflow-hidden relative shadow-2xl bg-white border border-gray-200 hover:border-brand-primary/50 transition-colors ${ind.span} ${i === 0 ? 'min-h-[300px] lg:min-h-[450px]' : 'min-h-[250px]'}`}>
                                <img src={ind.img} alt={ind.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent opacity-90" />
                                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-10">
                                    <h4 className="text-xl md:text-3xl font-bold text-gray-900 mb-3">{ind.title}</h4>
                                    <div className="h-1.5 w-12 bg-brand-primary rounded-full group-hover:w-24 group-hover:bg-[#06b6d4] transition-all duration-300" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════ OUR CLIENTS ═══════════════════════════════════ */}
            {clients.length > 0 && (
                <section className="py-12 md:py-20 bg-gray-50 border-y border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <h2 className="text-sm font-bold tracking-widest text-brand-primary uppercase mb-3">Trusted By</h2>
                            <h3 className="text-3xl md:text-4xl font-black font-heading tracking-tight">Our Clients</h3>
                        </div>
                        <div className="flex flex-wrap gap-6 md:gap-8 items-center justify-center">
                            {clients.map((client, i) => (
                                <motion.a key={client.id} href={client.website || '#'} target={client.website ? '_blank' : '_self'} rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                                    className="flex flex-col items-center gap-2.5 group cursor-pointer">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden group-hover:border-brand-primary/30 group-hover:shadow-lg transition-all">
                                        {client.logo ? (
                                            <img src={client.logo} alt={client.name} className="w-full h-full object-contain p-3 transition-transform group-hover:scale-110" />
                                        ) : (
                                            <span className="text-2xl font-black text-violet-400">{client.name?.[0]}</span>
                                        )}
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors text-center max-w-[80px] truncate">{client.name}</span>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════ OUR PROJECTS ═══════════════════════════════════ */}
            {projects.length > 0 && (
                <section className="py-12 md:py-24 relative">
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] -z-10" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12 max-w-3xl mx-auto">
                            <h2 className="text-sm font-bold tracking-widest text-blue-500 uppercase mb-3">Portfolio</h2>
                            <h3 className="text-4xl md:text-5xl font-black font-heading tracking-tight">Our Projects</h3>
                            <p className="text-gray-600 text-lg mt-4">Real projects we've shipped for real businesses.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                            {projects.map((project, i) => (
                                <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all">
                                    <div className="h-36 md:h-48 bg-gray-100 relative overflow-hidden">
                                        {project.imageUrl ? (
                                            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center"><FolderKanban className="w-10 h-10 text-gray-300" /></div>
                                        )}
                                        {project.category && (
                                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur text-gray-900 border border-gray-200 uppercase tracking-wider">
                                                {project.category}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4 md:p-5">
                                        <h4 className="text-base md:text-lg font-bold text-gray-900 mb-1">{project.title}</h4>
                                        <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mb-3">{project.description}</p>
                                        {project.techStack?.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {project.techStack.slice(0, 3).map((t, idx) => (
                                                    <span key={idx} className="px-2 py-0.5 text-[10px] font-bold bg-violet-50 text-violet-600 rounded-md">{t}</span>
                                                ))}
                                            </div>
                                        )}
                                        {project.liveUrl && (
                                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-bold text-brand-primary hover:text-violet-700 transition-colors">
                                                <ExternalLink className="w-3.5 h-3.5 mr-1" /> View Live
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════ OUR TOOLS ═══════════════════════════════════ */}
            {tools.length > 0 && (
                <section className="py-12 md:py-24 bg-gray-50 border-y border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12 max-w-3xl mx-auto">
                            <h2 className="text-sm font-bold tracking-widest text-emerald-500 uppercase mb-3">Built By Us</h2>
                            <h3 className="text-4xl md:text-5xl font-black font-heading tracking-tight">Our Tools</h3>
                            <p className="text-gray-600 text-lg mt-4">Free and premium tools we've crafted for the community.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {tools.map((tool, i) => (
                                <motion.a key={tool.id} href={tool.link || '#'} target={tool.link ? '_blank' : '_self'} rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        {tool.icon ? (
                                            <img src={tool.icon} alt={tool.name} className="w-6 h-6 object-contain" />
                                        ) : (
                                            <Wrench className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                    <h4 className="text-sm md:text-base font-bold text-gray-900 mb-1">{tool.name}</h4>
                                    {tool.category && <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2">{tool.category}</span>}
                                    <p className="text-xs text-gray-600 line-clamp-2 flex-1">{tool.description}</p>
                                    {tool.link && (
                                        <span className="inline-flex items-center text-xs font-bold text-emerald-600 mt-3">
                                            <ExternalLink className="w-3 h-3 mr-1" /> Open Tool
                                        </span>
                                    )}
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════ TESTIMONIALS ═══════════════════════════════════ */}
            {testimonials.length > 0 && (
                <section className="py-12 md:py-24 bg-gray-50 border-y border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-bold tracking-widest text-[#f59e0b] uppercase mb-3">Testimonials</h2>
                            <h3 className="text-4xl md:text-5xl font-black font-heading tracking-tight">What Our Clients Say</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((t, i) => (
                                <motion.div key={t.id || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    className="bg-white border border-gray-200 rounded-2xl p-8 relative hover:border-brand-primary/30 transition-all group">
                                    <Quote className="w-10 h-10 text-brand-primary/20 absolute top-6 right-6 group-hover:text-brand-primary/40 transition-colors" />
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(t.rating || 5)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed mb-6 font-medium">"{t.text}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-gray-900 text-sm font-bold">
                                            {t.name?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{t.name}</p>
                                            <p className="text-xs text-gray-500">{t.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════ PRICING ═══════════════════════════════════ */}
            <section id="pricing" className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-10 md:mb-20 max-w-3xl mx-auto">
                    <h2 className="text-sm font-bold tracking-widest text-[#f59e0b] uppercase mb-3">Pricing Plans</h2>
                    <h3 className="text-4xl md:text-5xl font-black font-heading mb-6 tracking-tight">Invest in Digital Excellence.</h3>
                    <p className="text-gray-600 text-lg">Transparent pricing for top-tier engineering. {currentUser ? 'Select a plan to get started.' : 'Sign in to purchase directly.'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {/* STARTER */}
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0 }}
                        className="rounded-[2rem] bg-gray-50 border border-gray-200 p-8 shadow-xl hover:border-gray-200 transition-all flex flex-col h-full bg-gradient-to-b from-gray-50 to-white group">
                        <h4 className="text-2xl font-bold mb-2 text-gray-900">Starter</h4>
                        <p className="text-gray-600 text-sm mb-6 pb-6 border-b border-gray-200">Perfect for small businesses establishing their online presence.</p>
                        <div className="mb-8"><span className="text-4xl font-black text-gray-900">₹25k</span><span className="text-gray-500">/project</span></div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['Basic CMS Website', 'Premium Template Design', '5 Pages Included', 'Mobile Responsive', '1 Month Support'].map((feat, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-medium"><Check className="w-5 h-5 text-emerald-400 shrink-0" /> {feat}</li>
                            ))}
                        </ul>
                        <button onClick={() => handleBookNow({ id: 'plan-starter', title: 'Starter Plan — CMS Website', price: '₹25,000', description: 'Basic CMS website with premium template, 5 pages, mobile responsive design, and 1 month support.', features: ['Basic CMS Website', 'Premium Template Design', '5 Pages', 'Mobile Responsive', '1 Month Support'], category: 'Pricing Plan' })}
                            className="w-full py-4 rounded-xl border border-gray-200 hover:bg-white/10 font-bold transition-all text-gray-900 group-hover:border-brand-primary/50 group-hover:shadow-lg group-hover:shadow-brand-primary/10 flex items-center justify-center gap-2">
                            <ShoppingCart className="w-4 h-4" /> Choose Starter
                        </button>
                    </motion.div>

                    {/* GROWTH — Popular */}
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                        className="rounded-[2rem] bg-gradient-to-b from-brand-primary/20 to-brand-secondary/10 border border-brand-primary p-8 shadow-[0_0_50px_rgba(124,58,237,0.15)] flex flex-col h-full transform md:-translate-y-4 relative overflow-hidden backdrop-blur-md group">
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-accent" />
                        <div className="absolute top-6 right-6 bg-brand-primary text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider text-gray-900 shadow-lg">Popular</div>
                        <h4 className="text-2xl font-bold mb-2 text-gray-900">Growth</h4>
                        <p className="text-gray-700 text-sm mb-6 pb-6 border-b border-brand-primary/20">For scaling brands requiring custom features and ecommerce.</p>
                        <div className="mb-8"><span className="text-4xl font-black text-gray-900">₹50k</span><span className="text-blue-200">/project</span></div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['Custom UI/UX Design', 'Full E-Commerce / Portal', 'Up to 15 Pages', 'Payment Gateway Integration', 'Advanced SEO Setup', '3 Months Support'].map((feat, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-900 font-semibold"><Check className="w-5 h-5 text-brand-secondary shrink-0" /> {feat}</li>
                            ))}
                        </ul>
                        <button onClick={() => handleBookNow({ id: 'plan-growth', title: 'Growth Plan — E-Commerce / Portal', price: '₹50,000', description: 'Custom UI/UX design, full e-commerce or portal, up to 15 pages, payment gateway, advanced SEO, and 3 months support.', features: ['Custom UI/UX Design', 'Full E-Commerce / Portal', 'Up to 15 Pages', 'Payment Gateway', 'Advanced SEO', '3 Months Support'], category: 'Pricing Plan' })}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-primary to-blue-600 hover:from-brand-primary hover:to-blue-500 shadow-xl shadow-brand-primary/25 font-bold transition-all text-gray-900 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                            <ShoppingCart className="w-4 h-4" /> Choose Growth
                        </button>
                    </motion.div>

                    {/* ENTERPRISE */}
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                        className="rounded-[2rem] bg-gray-50 border border-gray-200 p-8 shadow-xl hover:border-gray-200 transition-all flex flex-col h-full bg-gradient-to-b from-gray-50 to-white group">
                        <h4 className="text-2xl font-bold mb-2 text-gray-900">Enterprise</h4>
                        <p className="text-gray-600 text-sm mb-6 pb-6 border-b border-gray-200">Complex systems, SaaS platforms, and AI integrated architectures.</p>
                        <div className="mb-8"><span className="text-4xl font-black text-gray-900">Custom</span><span className="text-gray-500">/quote</span></div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['Scalable Cloud Architecture', 'AI & ML Integrations', 'Custom Dashboards/CRM', 'Multi-tenant Support', 'Dedicated SLA 24/7'].map((feat, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-medium"><Check className="w-5 h-5 text-emerald-400 shrink-0" /> {feat}</li>
                            ))}
                        </ul>
                        <button onClick={() => handleBookNow({ id: 'plan-enterprise', title: 'Enterprise Plan — Custom Solution', price: 'Custom Quote', description: 'Scalable cloud architecture, AI/ML integrations, custom dashboards/CRM, multi-tenant support, and dedicated SLA 24/7.', features: ['Scalable Cloud Architecture', 'AI & ML Integrations', 'Custom Dashboards/CRM', 'Multi-tenant Support', 'Dedicated SLA 24/7'], category: 'Pricing Plan' })}
                            className="w-full py-4 rounded-xl border border-gray-200 hover:bg-white/10 font-bold transition-all text-gray-900 group-hover:border-brand-primary/50 group-hover:shadow-lg group-hover:shadow-brand-primary/10 flex items-center justify-center gap-2">
                            <MessageCircle className="w-4 h-4" /> Get Custom Quote
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════ FAQ ═══════════════════════════════════ */}
            <section className="py-12 md:py-24 bg-gray-50 border-y border-gray-200">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 md:mb-16">
                        <h2 className="text-sm font-bold tracking-widest text-[#06b6d4] uppercase mb-3">FAQ</h2>
                        <h3 className="text-3xl md:text-5xl font-black font-heading tracking-tight">Frequently Asked Questions</h3>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                                className="border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors">
                                <button onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left">
                                    <span className="text-sm font-bold text-gray-900 pr-4">{faq.q}</span>
                                    {openFAQ === i ? <ChevronUp className="w-5 h-5 text-brand-primary shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />}
                                </button>
                                {openFAQ === i && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ duration: 0.2 }}
                                        className="px-5 pb-5 text-sm text-gray-700 leading-relaxed font-medium border-t border-gray-200 pt-4">
                                        {faq.a}
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════ CTA ═══════════════════════════════════ */}
            <section className="py-12 md:py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 blur-3xl" />
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-bold mb-6">
                            <Zap className="w-4 h-4" /> Limited Slots Available
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black font-heading tracking-tight mb-6">Ready to Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-[#06b6d4]">Extraordinary?</span></h3>
                        <p className="text-gray-700 text-lg mb-10 max-w-2xl mx-auto">Join 300+ businesses that have transformed their digital presence with MakeMyPortal. Start your project today.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register" className="px-10 py-4 rounded-xl bg-gradient-to-r from-brand-primary to-blue-600 text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] transition-all hover:scale-105 active:scale-95">
                                Get Free Consultation <ArrowRight className="w-5 h-5 inline ml-2" />
                            </Link>
                            <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noopener noreferrer"
                                className="px-8 py-4 rounded-xl border border-emerald-500/40 bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 transition-all">
                                💬 WhatsApp Us
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div id="contact" className="h-10" />
            <div id="portfolio" className="h-20" />

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                service={selectedService}
            />
        </div>
    );
};

export default Home;
