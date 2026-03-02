import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Search, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useServices } from '../context/ServiceContext';
import { useSearchParams } from 'react-router-dom';
import BookingModal from '../components/BookingModal';

const ServiceCard = ({ service, index, onBook }) => (
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
                <a
                    href={`https://wa.me/917017978807?text=Hi, I am interested in booking the *${service.title}* service for ${service.price}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors"
                >
                    <MessageCircle className="w-4 h-4 text-emerald-500" /> WhatsApp Us
                </a>
            </div>
        </div>
    </motion.div>
);

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
                <meta name="description" content="Explore our premium suite of digital products, consulting, and engineering services tailored for your scale, including custom websites and enterprise portals." />
                <link rel="canonical" href="https://makemyportal.com/services" />
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
