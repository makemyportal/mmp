import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Search, X, Share2, Phone, Copy, Check } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useServices } from '../context/ServiceContext';
import { useSearchParams } from 'react-router-dom';
import BookingModal from '../components/BookingModal';

const ServiceCard = ({ service, index, onBook }) => {
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = `https://makemyportal.in/services?search=${encodeURIComponent(service.title)}`;
    const shareText = `🚀 Check out "${service.title}" on MakeMyPortal!\n\n${service.description}\n\n💰 ${service.price}\n\n👉 ${shareUrl}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
            className="bg-white rounded-2xl flex flex-col h-full border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(124,58,237,0.12)] hover:border-violet-200 transition-all duration-500 group relative overflow-hidden"
        >
            {/* Service Image Header */}
            <div className="relative h-44 sm:h-48 w-full overflow-hidden">
                <img
                    src={service.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop'}
                    alt={service.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <span className="absolute top-3 left-3 z-20 px-3 py-1.5 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-md text-gray-900 shadow-sm uppercase tracking-wider">
                    {service.category.replace(/[^a-zA-Z\s]/g, '')}
                </span>
                <span className="absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-md text-base font-black text-gray-900 shadow-sm">
                    {service.price}
                </span>
                {/* Share Button on Image */}
                <div className="absolute top-3 right-3 z-20">
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowShareMenu(!showShareMenu); }}
                        className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                        title="Share"
                    >
                        <Share2 className="w-4 h-4 text-gray-700" />
                    </button>
                    {/* Share Dropdown */}
                    {showShareMenu && (
                        <div className="absolute top-11 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 min-w-[180px] z-50 animate-in fade-in slide-in-from-top-2">
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-emerald-50 text-sm font-medium text-gray-700 transition-colors"
                                onClick={() => setShowShareMenu(false)}
                            >
                                <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                WhatsApp
                            </a>
                            <button
                                onClick={() => { handleCopyLink(); setShowShareMenu(false); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-violet-50 text-sm font-medium text-gray-700 transition-colors"
                            >
                                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-brand-primary" />}
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-5 sm:p-6 flex flex-col flex-grow relative z-20">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-violet-500 to-blue-500 opacity-[0.04] group-hover:opacity-[0.08] rounded-full blur-3xl -mr-10 -mt-10 transition-opacity duration-700 pointer-events-none" />

                <h3 className="text-lg md:text-xl font-black text-gray-900 mb-2 tracking-tight leading-snug">{service.title}</h3>
                <p className="text-sm text-gray-600 mb-5 flex-grow leading-relaxed line-clamp-2">{service.description}</p>

                <div className="mb-5">
                    <h4 className="text-[11px] font-bold text-gray-400 mb-3 uppercase tracking-widest">Includes</h4>
                    <ul className="space-y-2">
                        {service.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                                <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                </div>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-auto space-y-2.5">
                    <button
                        onClick={() => onBook(service)}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-sm shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    >
                        Book Now <ArrowRight className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                        <a
                            href={`https://wa.me/917017978807?text=Hi, I am interested in booking the *${service.title}* service for ${service.price}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors"
                        >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp
                        </a>
                        <a
                            href="tel:+917017978807"
                            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-xs text-blue-700 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors"
                        >
                            <Phone className="w-3.5 h-3.5 text-blue-500" /> Call Now
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Services = () => {
    const { services } = useServices();
    const [selectedService, setSelectedService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

    // Sync search param with URL
    useEffect(() => {
        const urlSearch = searchParams.get('search');
        if (urlSearch) setSearchQuery(urlSearch);
    }, [searchParams]);

    const handleBookNow = (service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchParams({});
    };

    // Filter services by search
    const filteredServices = searchQuery.trim()
        ? services.filter(s =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : services;

    // Group filtered services by category
    const groupedServices = filteredServices.reduce((acc, curr) => {
        if (!acc[curr.category]) acc[curr.category] = [];
        acc[curr.category].push(curr);
        return acc;
    }, {});

    return (
        <div className="min-h-screen pb-32">
            <Helmet>
                <title>Our Services | MakeMyPortal</title>
                <meta name="description" content="Explore our premium suite of digital services — websites, logos, portfolios, AI portals, school magazines & more. Book online or call us today!" />
                <link rel="canonical" href="https://makemyportal.in/services" />
                <meta property="og:title" content="Our Services — MakeMyPortal 🚀" />
                <meta property="og:description" content="Websites, Logos, Portfolios, AI Portals, School Magazines & more — all under one roof. Explore & book now!" />
                <meta property="og:url" content="https://makemyportal.in/services" />
                <meta property="og:image" content="https://makemyportal.in/preview.png" />
            </Helmet>
            {/* Header */}
            <section className="pt-32 pb-16 px-4 text-center max-w-4xl mx-auto relative z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-primary/20 blur-[100px] rounded-full pointer-events-none" />
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-black tracking-tight mb-6 font-heading">
                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Services</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="text-lg md:text-xl text-gray-500 font-medium mb-8">
                    Explore our premium suite of digital products, consulting, and engineering services tailored for your scale.
                </motion.p>

                {/* Search Bar */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="max-w-xl mx-auto relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); if (!e.target.value) setSearchParams({}); }}
                        placeholder="Search by name, category, or description..."
                        className="w-full pl-12 pr-12 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm font-medium"
                    />
                    {searchQuery && (
                        <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </motion.div>

                {searchQuery && (
                    <p className="text-sm text-gray-500 mt-4">
                        Showing <strong className="text-gray-900">{filteredServices.length}</strong> result{filteredServices.length !== 1 ? 's' : ''} for "<strong className="text-brand-primary">{searchQuery}</strong>"
                    </p>
                )}
            </section>

            {/* Services Grouped by Category */}
            <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto space-y-24">
                {Object.entries(groupedServices).map(([category, items]) => (
                    <section key={category} className="relative">

                        {/* Category Divider/Header */}
                        <div className="flex items-center gap-6 mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 shrink-0 font-heading">
                                {category}
                            </h2>
                            <div className="h-[1px] flex-grow bg-gradient-to-r from-white/20 to-transparent" />
                        </div>

                        {/* Category Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
                            {items.map((service, index) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    index={index}
                                    onBook={handleBookNow}
                                />
                            ))}
                        </div>

                    </section>
                ))}
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                service={selectedService}
            />
        </div>
    );
};

export default Services;
