import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';

const HorizontalScrollSection = ({ title, items, isTemplate = false, onBook }) => {
    const scrollRef = useRef(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    return (
        <div className="py-12 relative w-full overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold font-heading text-gray-900">{title}</h2>
                    {isTemplate && <p className="text-brand-secondary text-sm mt-1 font-semibold">Download Instantly</p>}
                </div>

                <div className="flex gap-2 hidden sm:flex">
                    <button onClick={scrollLeft} className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors border-gray-200">
                        <ArrowLeft className="w-5 h-5 text-gray-900" />
                    </button>
                    <button onClick={scrollRight} className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors border-gray-200">
                        <ArrowRight className="w-5 h-5 text-gray-900" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-6 px-4 sm:px-6 lg:px-8 pb-10 pt-4 max-w-[1400px] mx-auto scrollbar-hide snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {items.map((item, index) => (
                    <Tilt
                        key={item.id}
                        tiltMaxAngleX={10}
                        tiltMaxAngleY={10}
                        perspective={1000}
                        transitionSpeed={1500}
                        scale={1.02}
                        className="flex-shrink-0 snap-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative glass-panel rounded-2xl overflow-hidden group border border-gray-200 hover:border-brand-primary/50 transition-colors
                ${isTemplate ? 'w-[280px] sm:w-[320px] h-[360px]' : 'w-[320px] sm:w-[400px] h-[480px]'}
              `}
                        >
                            {/* Image Section */}
                            <div className={`w-full overflow-hidden relative ${isTemplate ? 'h-48' : 'h-56'}`}>
                                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent z-10" />
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 z-20 glass-panel px-3 py-1.5 rounded-full text-xs font-bold text-gray-900 shadow-lg border-gray-200 backdrop-blur-xl bg-black/40">
                                    {item.price}
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-6 relative z-20 flex flex-col h-[calc(100%-12rem)] md:h-[calc(100%-14rem)]">
                                <h3 className="text-xl font-bold text-gray-900 font-heading mb-2 line-clamp-1 group-hover:text-brand-primary transition-colors">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                    {item.description}
                                </p>

                                <div className="mt-auto">
                                    <button
                                        onClick={() => onBook && onBook(item)}
                                        className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-gray-900 bg-white/5 border border-gray-200 hover:bg-white/10 hover:border-brand-primary/50 transition-all text-sm group/btn"
                                    >
                                        {isTemplate ? 'View Template' : 'Learn More'}
                                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* Shine effect overlay */}
                            <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700"
                                style={{ background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.1) 25%, transparent 30%)' }}
                            />
                        </motion.div>
                    </Tilt>
                ))}
            </div>
        </div>
    );
};

export default HorizontalScrollSection;
