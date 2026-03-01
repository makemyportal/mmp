import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Search, X } from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { useSearchParams } from 'react-router-dom';
import BookingModal from '../components/BookingModal';

const ServiceCard = ({ service, index, onBook }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
        className="glass-panel rounded-2xl flex flex-col h-full border-t border-white/10 hover:border-brand-primary/50 transition-all group relative overflow-hidden bg-dark-800"
    >
        {/* Service Image Header */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-transparent to-transparent z-10" />
            <img
                src={service.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop'}
                alt={service.title}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 opacity-90"
            />
            <div className="absolute top-4 right-4 z-20 glass-panel px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg border-white/20 bg-black/40 backdrop-blur-md">
                {service.category.replace(/[^a-zA-Z\s]/g, '')}
            </div>
        </div>

        <div className="p-6 sm:p-8 flex flex-col flex-grow relative z-20 -mt-8">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl md:text-2xl font-bold font-heading text-white bg-dark-900 px-3 py-1.5 -ml-3 rounded-lg border border-white/5 inline-block shadow-lg">{service.title}</h3>
            </div>

            <p className="text-gray-400 mb-6 flex-grow text-sm md:text-base">{service.description}</p>

            <div className="mb-8">
                <h4 className="text-sm font-semibold text-white/80 mb-3 uppercase tracking-wider">Includes</h4>
                <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-auto border-t border-white/10 pt-6">
                <div className="mb-4">
                    <span className="text-xs text-gray-400 block mb-1 uppercase tracking-wider font-bold">Investment</span>
                    <span className="text-3xl font-black text-white">{service.price}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <a
                        href={`https://wa.me/917017978807?text=Hi, I am interested in booking the *${service.title}* service for ${service.price}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-[#25D366]/20 border border-[#25D366]/50 hover:bg-[#25D366]/30 transition-colors text-sm"
                    >
                        <MessageCircle className="w-4 h-4 text-[#25D366]" /> WhatsApp
                    </a>
                    <button
                        onClick={() => onBook(service)}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary hover:to-blue-500 transition-all shadow-lg shadow-brand-primary/20 hover:scale-[1.02] text-sm"
                    >
                        Book Now <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
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
            {/* Header */}
            <section className="pt-32 pb-16 px-4 text-center max-w-4xl mx-auto relative z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-primary/20 blur-[100px] rounded-full pointer-events-none" />
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-black tracking-tight mb-6 font-heading">
                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Services</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="text-lg md:text-xl text-gray-400 font-medium mb-8">
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
                        className="w-full pl-12 pr-12 py-4 rounded-2xl bg-dark-800 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm font-medium"
                    />
                    {searchQuery && (
                        <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </motion.div>

                {searchQuery && (
                    <p className="text-sm text-gray-500 mt-4">
                        Showing <strong className="text-white">{filteredServices.length}</strong> result{filteredServices.length !== 1 ? 's' : ''} for "<strong className="text-brand-primary">{searchQuery}</strong>"
                    </p>
                )}
            </section>

            {/* Services Grouped by Category */}
            <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto space-y-24">
                {Object.entries(groupedServices).map(([category, items]) => (
                    <section key={category} className="relative">

                        {/* Category Divider/Header */}
                        <div className="flex items-center gap-6 mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white shrink-0 font-heading">
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
