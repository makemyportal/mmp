import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    Check, Monitor, LayoutTemplate, Palette, GraduationCap, Bot, Lightbulb,
    CheckCircle2, Users, Layers, ArrowRight, Search, Star, Quote,
    MessageCircle, ChevronDown, ChevronUp, Zap, FileCheck, Rocket, Headphones,
    Shield, Clock, Heart, ShoppingCart
} from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';

const Home = () => {
    const navigate = useNavigate();
    const { services } = useServices();
    const { settings } = useSettings();
    const { currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [openFAQ, setOpenFAQ] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const whatsappNum = settings.whatsapp || '919999999999';

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

    const testimonials = [
        { name: 'Rahul Sharma', role: 'CEO, TechStartup', text: 'MakeMyPortal delivered a stunning website that exceeded our expectations. The team was professional and responsive throughout.', rating: 5 },
        { name: 'Priya Patel', role: 'Founder, EduLearn', text: 'Our EdTech platform was built flawlessly. Student engagement increased by 200% within the first month of launch.', rating: 5 },
        { name: 'Amit Kumar', role: 'Director, RetailMax', text: 'The e-commerce portal they built handles 10,000+ daily orders smoothly. Best investment we made for our business.', rating: 5 },
    ];

    return (
        <div className="relative w-full overflow-hidden bg-dark-900 text-white font-sans selection:bg-brand-primary selection:text-white">

            {/* --- BACKGROUND GLOWS --- */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#7c3aed]/20 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[#2563eb]/20 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-[#f59e0b]/10 rounded-full blur-[120px] pointer-events-none" />

            {/* ═══════════════════════════════════ HERO ═══════════════════════════════════ */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="flex-1 w-full max-w-2xl text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-semibold mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                        </span>
                        {settings.tagline || 'Premium Digital Solutions'}
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.15] mb-6 font-heading tracking-tight sm:leading-tight">
                        We Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-[#06b6d4]">Powerful Systems</span> For Modern Businesses.
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                        From High-End Branding to Advanced AI Portals — We deliver production-ready software that scales your business.
                    </p>

                    {/* ── SEARCH BAR ── */}
                    <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-xl mx-auto lg:mx-0 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search services... e.g., Website, Logo, SEO"
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-dark-800 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm font-medium"
                            />
                        </div>
                        <button type="submit" className="px-6 py-4 rounded-xl bg-gradient-to-r from-brand-primary to-blue-600 text-white font-bold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all hover:scale-105 active:scale-95 shrink-0">
                            Search
                        </button>
                    </form>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-primary to-blue-600 text-white font-bold hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                            Start Your Project <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/services" className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all font-semibold flex items-center justify-center">
                            View Catalog
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start">
                        {[{ icon: Shield, text: '100% Secure' }, { icon: Clock, text: 'On-Time Delivery' }, { icon: Heart, text: 'Free Support' }].map((b, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                                <b.icon className="w-3.5 h-3.5 text-emerald-400" /> {b.text}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Hero Dashboard Image */}
                <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex-1 w-full max-w-2xl relative mt-10 lg:mt-0">
                    <div className="relative rounded-2xl border border-white/10 bg-dark-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group">
                        <div className="h-8 bg-dark-900 border-b border-white/5 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                        </div>
                        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80" alt="Dashboard Software Interface"
                            className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700" />
                        <div className="absolute inset-0 border-2 border-brand-primary/20 rounded-2xl pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-brand-primary/30 to-blue-500/30 blur-2xl -z-10 group-hover:opacity-80 opacity-40 transition-opacity duration-700 rounded-[3rem]" />
                    </div>
                </motion.div>
            </section>

            {/* ═══════════════════════════════════ STATS BAR ═══════════════════════════════════ */}
            <div className="relative max-w-6xl mx-auto px-4 z-20 mb-24 mt-8">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
                    className="p-8 rounded-3xl bg-dark-800/80 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
                    {[
                        { num: '300+', label: 'Projects Delivered', icon: <CheckCircle2 className="w-6 h-6 text-brand-secondary" /> },
                        { num: '99%', label: 'Client Satisfaction', icon: <Users className="w-6 h-6 text-brand-primary" /> },
                        { num: '24/7', label: 'System Uptime', icon: <Monitor className="w-6 h-6 text-brand-accent" /> },
                        { num: '50+', label: 'Enterprise Apps', icon: <Layers className="w-6 h-6 text-blue-400" /> }
                    ].map((stat, i) => (
                        <div key={i} className={`flex-1 flex flex-col items-center justify-center w-full ${i > 0 ? 'pt-8 md:pt-0' : ''}`}>
                            <div className="p-3 rounded-2xl bg-white/5 mb-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:bg-white/10 transition-colors cursor-default">
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">{stat.num}</h3>
                            <p className="text-sm text-gray-400 font-semibold tracking-wider uppercase text-center">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* ═══════════════════════════════════ OUR SERVICES ═══════════════════════════════════ */}
            <section id="services" className="py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[150px] -z-10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-sm font-bold tracking-widest text-[#06b6d4] uppercase mb-3">What We Do</h2>
                        <h3 className="text-4xl md:text-5xl font-black font-heading mb-6 tracking-tight">A Suite of Premium Digital Services.</h3>
                        <p className="text-gray-400 text-lg">We combine high-end design with robust engineering to create platforms that dominate their markets.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: <Monitor className="w-7 h-7" />, title: 'Website Development', desc: 'Custom coded, ultra-fast websites with flawless UI/UX positioning.', color: 'from-blue-500 to-cyan-400' },
                            { icon: <LayoutTemplate className="w-7 h-7" />, title: 'Custom Web Portals', desc: 'Complex SaaS dashboards and scalable CRM architectures.', color: 'from-purple-600 to-brand-primary' },
                            { icon: <Palette className="w-7 h-7" />, title: 'Branding & Identity', desc: 'Visually stunning brand packages that command authority.', color: 'from-orange-500 to-amber-400' },
                            { icon: <GraduationCap className="w-7 h-7" />, title: 'EdTech Platforms', desc: 'LMS, CBT exams, and scalable management tools for institutions.', color: 'from-emerald-500 to-teal-400' },
                            { icon: <Bot className="w-7 h-7" />, title: 'AI Integration', desc: 'Automate workflows and build custom LLM-powered applications.', color: 'from-pink-500 to-rose-400' },
                            { icon: <Lightbulb className="w-7 h-7" />, title: 'Tech Consulting', desc: 'Fractional CTO services and architectural planning for start-ups.', color: 'from-indigo-500 to-blue-500' }
                        ].map((service, i) => (
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.1 }} key={i}
                                className="group relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent hover:from-brand-primary/50 transition-all duration-300 shadow-xl">
                                <div className="relative h-full bg-dark-800 p-8 rounded-[22px] z-10 flex flex-col border border-white/5 group-hover:border-white/10 hover:shadow-[inset_0_2px_20px_rgba(255,255,255,0.05)] transition-all">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${service.color} mb-6 shadow-lg transform group-hover:-translate-y-2 group-hover:rotate-3 transition-transform duration-300`}>
                                        <div className="text-white drop-shadow-md">{service.icon}</div>
                                    </div>
                                    <h4 className="text-2xl font-bold mb-3 text-white">{service.title}</h4>
                                    <p className="text-gray-400 leading-relaxed font-medium mb-6 flex-1 text-sm">{service.desc}</p>
                                    <Link to="/services" className="flex items-center text-sm font-bold text-white group-hover:text-brand-secondary transition-colors cursor-pointer mt-auto">
                                        Learn More <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════ FEATURED SERVICES (PURCHASABLE) ═══════════════════════════════════ */}
            <section className="py-24 relative">
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-secondary/5 rounded-full blur-[150px] -z-10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-sm font-bold tracking-widest text-brand-secondary uppercase mb-3">Popular Plans</h2>
                        <h3 className="text-4xl md:text-5xl font-black font-heading mb-6 tracking-tight">Start Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Today</span></h3>
                        <p className="text-gray-400 text-lg">Choose a plan that fits your needs. {currentUser ? 'Click Book Now to get started instantly.' : 'Sign in to book directly.'}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredServices.map((service, i) => (
                            <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="bg-dark-800 border border-white/10 rounded-2xl overflow-hidden hover:border-brand-primary/40 transition-all group">
                                {/* Image */}
                                <div className="h-40 overflow-hidden relative">
                                    <img src={service.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80'}
                                        alt={service.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent" />
                                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-dark-900/80 backdrop-blur text-white border border-white/10">
                                        {service.category.replace(/[^a-zA-Z\s]/g, '')}
                                    </span>
                                </div>

                                <div className="p-6">
                                    <h4 className="text-lg font-bold text-white mb-2">{service.title}</h4>
                                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{service.description}</p>

                                    {/* Features */}
                                    <ul className="space-y-1.5 mb-5">
                                        {service.features?.slice(0, 3).map((f, idx) => (
                                            <li key={idx} className="text-xs text-gray-300 flex items-center gap-2">
                                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {f}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Price + CTA */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <div>
                                            <span className="text-xs text-gray-500 block">Starting at</span>
                                            <span className="text-2xl font-black text-white">{service.price}</span>
                                        </div>
                                        <button onClick={() => handleBookNow(service)}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-blue-600 text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all hover:scale-105 active:scale-95">
                                            <ShoppingCart className="w-4 h-4" /> Book Now
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/services" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all hover:scale-105">
                            View All {services.length} Services <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════ HOW IT WORKS ═══════════════════════════════════ */}
            <section className="py-24 bg-dark-800 border-y border-white/5 relative">
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
                                <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                                <p className="text-sm text-gray-400 font-medium">{step.desc}</p>
                                {i < 3 && <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-brand-primary/30 to-transparent" />}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════ INDUSTRIES ═══════════════════════════════════ */}
            <section id="solutions" className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-sm font-bold tracking-widest text-[#10b981] uppercase mb-3">Industries</h2>
                            <h3 className="text-3xl md:text-5xl font-black font-heading tracking-tight sm:leading-tight">Tailored Solutions for Every Sector.</h3>
                        </div>
                        <Link to="/services" className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold transition-colors">
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
                                className={`group rounded-3xl overflow-hidden relative shadow-2xl bg-dark-900 border border-white/10 hover:border-brand-primary/50 transition-colors ${ind.span} ${i === 0 ? 'min-h-[300px] lg:min-h-[450px]' : 'min-h-[250px]'}`}>
                                <img src={ind.img} alt={ind.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent opacity-90" />
                                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-10">
                                    <h4 className="text-xl md:text-3xl font-bold text-white mb-3">{ind.title}</h4>
                                    <div className="h-1.5 w-12 bg-brand-primary rounded-full group-hover:w-24 group-hover:bg-[#06b6d4] transition-all duration-300" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════ TESTIMONIALS ═══════════════════════════════════ */}
            <section className="py-24 bg-dark-800 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold tracking-widest text-[#f59e0b] uppercase mb-3">Testimonials</h2>
                        <h3 className="text-4xl md:text-5xl font-black font-heading tracking-tight">What Our Clients Say</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="bg-dark-900 border border-white/10 rounded-2xl p-8 relative hover:border-brand-primary/30 transition-all group">
                                <Quote className="w-10 h-10 text-brand-primary/20 absolute top-6 right-6 group-hover:text-brand-primary/40 transition-colors" />
                                <div className="flex gap-1 mb-4">
                                    {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-sm font-bold">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{t.name}</p>
                                        <p className="text-xs text-gray-500">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════ PRICING ═══════════════════════════════════ */}
            <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <h2 className="text-sm font-bold tracking-widest text-[#f59e0b] uppercase mb-3">Pricing Plans</h2>
                    <h3 className="text-4xl md:text-5xl font-black font-heading mb-6 tracking-tight">Invest in Digital Excellence.</h3>
                    <p className="text-gray-400 text-lg">Transparent pricing for top-tier engineering. {currentUser ? 'Select a plan to get started.' : 'Sign in to purchase directly.'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {/* STARTER */}
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0 }}
                        className="rounded-[2rem] bg-dark-800 border border-white/10 p-8 shadow-xl hover:border-white/20 transition-all flex flex-col h-full bg-gradient-to-b from-dark-800 to-dark-900 group">
                        <h4 className="text-2xl font-bold mb-2 text-white">Starter</h4>
                        <p className="text-gray-400 text-sm mb-6 pb-6 border-b border-white/5">Perfect for small businesses establishing their online presence.</p>
                        <div className="mb-8"><span className="text-4xl font-black text-white">₹25k</span><span className="text-gray-500">/project</span></div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['Basic CMS Website', 'Premium Template Design', '5 Pages Included', 'Mobile Responsive', '1 Month Support'].map((feat, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-medium"><Check className="w-5 h-5 text-emerald-400 shrink-0" /> {feat}</li>
                            ))}
                        </ul>
                        <button onClick={() => handleBookNow({ id: 'plan-starter', title: 'Starter Plan — CMS Website', price: '₹25,000', description: 'Basic CMS website with premium template, 5 pages, mobile responsive design, and 1 month support.', features: ['Basic CMS Website', 'Premium Template Design', '5 Pages', 'Mobile Responsive', '1 Month Support'], category: 'Pricing Plan' })}
                            className="w-full py-4 rounded-xl border border-white/20 hover:bg-white/10 font-bold transition-all text-white group-hover:border-brand-primary/50 group-hover:shadow-lg group-hover:shadow-brand-primary/10 flex items-center justify-center gap-2">
                            <ShoppingCart className="w-4 h-4" /> Choose Starter
                        </button>
                    </motion.div>

                    {/* GROWTH — Popular */}
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                        className="rounded-[2rem] bg-gradient-to-b from-brand-primary/20 to-brand-secondary/10 border border-brand-primary p-8 shadow-[0_0_50px_rgba(124,58,237,0.15)] flex flex-col h-full transform md:-translate-y-4 relative overflow-hidden backdrop-blur-md group">
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-accent" />
                        <div className="absolute top-6 right-6 bg-brand-primary text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider text-white shadow-lg">Popular</div>
                        <h4 className="text-2xl font-bold mb-2 text-white">Growth</h4>
                        <p className="text-blue-100 text-sm mb-6 pb-6 border-b border-white/10">For scaling brands requiring custom features and ecommerce.</p>
                        <div className="mb-8"><span className="text-4xl font-black text-white">₹50k</span><span className="text-blue-200">/project</span></div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['Custom UI/UX Design', 'Full E-Commerce / Portal', 'Up to 15 Pages', 'Payment Gateway Integration', 'Advanced SEO Setup', '3 Months Support'].map((feat, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-white font-semibold"><Check className="w-5 h-5 text-brand-secondary shrink-0" /> {feat}</li>
                            ))}
                        </ul>
                        <button onClick={() => handleBookNow({ id: 'plan-growth', title: 'Growth Plan — E-Commerce / Portal', price: '₹50,000', description: 'Custom UI/UX design, full e-commerce or portal, up to 15 pages, payment gateway, advanced SEO, and 3 months support.', features: ['Custom UI/UX Design', 'Full E-Commerce / Portal', 'Up to 15 Pages', 'Payment Gateway', 'Advanced SEO', '3 Months Support'], category: 'Pricing Plan' })}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-primary to-blue-600 hover:from-brand-primary hover:to-blue-500 shadow-xl shadow-brand-primary/25 font-bold transition-all text-white hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                            <ShoppingCart className="w-4 h-4" /> Choose Growth
                        </button>
                    </motion.div>

                    {/* ENTERPRISE */}
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                        className="rounded-[2rem] bg-dark-800 border border-white/10 p-8 shadow-xl hover:border-white/20 transition-all flex flex-col h-full bg-gradient-to-b from-dark-800 to-dark-900 group">
                        <h4 className="text-2xl font-bold mb-2 text-white">Enterprise</h4>
                        <p className="text-gray-400 text-sm mb-6 pb-6 border-b border-white/5">Complex systems, SaaS platforms, and AI integrated architectures.</p>
                        <div className="mb-8"><span className="text-4xl font-black text-white">Custom</span><span className="text-gray-500">/quote</span></div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['Scalable Cloud Architecture', 'AI & ML Integrations', 'Custom Dashboards/CRM', 'Multi-tenant Support', 'Dedicated SLA 24/7'].map((feat, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-medium"><Check className="w-5 h-5 text-emerald-400 shrink-0" /> {feat}</li>
                            ))}
                        </ul>
                        <button onClick={() => handleBookNow({ id: 'plan-enterprise', title: 'Enterprise Plan — Custom Solution', price: 'Custom Quote', description: 'Scalable cloud architecture, AI/ML integrations, custom dashboards/CRM, multi-tenant support, and dedicated SLA 24/7.', features: ['Scalable Cloud Architecture', 'AI & ML Integrations', 'Custom Dashboards/CRM', 'Multi-tenant Support', 'Dedicated SLA 24/7'], category: 'Pricing Plan' })}
                            className="w-full py-4 rounded-xl border border-white/20 hover:bg-white/10 font-bold transition-all text-white group-hover:border-brand-primary/50 group-hover:shadow-lg group-hover:shadow-brand-primary/10 flex items-center justify-center gap-2">
                            <MessageCircle className="w-4 h-4" /> Get Custom Quote
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════ FAQ ═══════════════════════════════════ */}
            <section className="py-24 bg-dark-800 border-y border-white/5">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold tracking-widest text-[#06b6d4] uppercase mb-3">FAQ</h2>
                        <h3 className="text-4xl md:text-5xl font-black font-heading tracking-tight">Frequently Asked Questions</h3>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                                className="border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
                                <button onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left">
                                    <span className="text-sm font-bold text-white pr-4">{faq.q}</span>
                                    {openFAQ === i ? <ChevronUp className="w-5 h-5 text-brand-primary shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />}
                                </button>
                                {openFAQ === i && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ duration: 0.2 }}
                                        className="px-5 pb-5 text-sm text-gray-400 leading-relaxed font-medium border-t border-white/5 pt-4">
                                        {faq.a}
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════ CTA ═══════════════════════════════════ */}
            <section className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 blur-3xl" />
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-bold mb-6">
                            <Zap className="w-4 h-4" /> Limited Slots Available
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black font-heading tracking-tight mb-6">Ready to Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-[#06b6d4]">Extraordinary?</span></h3>
                        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Join 300+ businesses that have transformed their digital presence with MakeMyPortal. Start your project today.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register" className="px-10 py-4 rounded-xl bg-gradient-to-r from-brand-primary to-blue-600 text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] transition-all hover:scale-105 active:scale-95">
                                Get Free Consultation <ArrowRight className="w-5 h-5 inline ml-2" />
                            </Link>
                            <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noopener noreferrer"
                                className="px-8 py-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold hover:bg-emerald-500/20 transition-all">
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
