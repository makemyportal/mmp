import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Building, MessageSquare, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ isOpen, onClose, service }) => {
    const { currentUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: currentUser?.email || '',
        phone: '',
        company: '',
        requirements: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await addDoc(collection(db, 'orders'), {
                userId: currentUser?.uid || null,
                userEmail: formData.email,
                customerName: formData.name,
                phone: formData.phone,
                company: formData.company,
                requirements: formData.requirements,
                serviceId: service.id,
                serviceName: service.title,
                price: service.price,
                status: 'in-progress',
                currentStep: 0,
                steps: [
                    { title: 'Requirements Gathering', completed: false },
                    { title: 'Design & Planning', completed: false },
                    { title: 'Development', completed: false },
                    { title: 'Final Delivery', completed: false }
                ],
                createdAt: serverTimestamp()
            });

            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setFormData({ name: '', email: currentUser?.email || '', phone: '', company: '', requirements: '' });
                onClose();
            }, 3000);
        } catch (error) {
            console.error("Error submitting booking:", error);
            setError("Failed to submit request. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !service) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-dark-900/80 backdrop-blur-md"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-dark-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto"
                >
                    {/* Header */}
                    <div className="relative p-6 border-b border-white/10 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent opacity-50" />
                        <div className="relative flex justify-between items-start">
                            <div>
                                <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">Complete Your Booking</h3>
                                <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                                    <span className="font-semibold text-brand-secondary">{service.title}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/30" />
                                    <span>{service.price}</span>
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 relative">
                        {isSuccess ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-12 flex flex-col items-center justify-center text-center px-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-2">Request Received!</h4>
                                <p className="text-gray-400">Thank you for your interest in {service.title}. Our team will review your requirements and contact you shortly.</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <span className="text-sm text-red-200">{error}</span>
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Full Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-primary transition-colors text-sm"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-300 ml-1">Email *</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-primary transition-colors text-sm"
                                                placeholder="you@email.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-300 ml-1">Phone Number *</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                required
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-primary transition-colors text-sm"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Company / School</label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-primary transition-colors text-sm"
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Project Requirements</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                        <textarea
                                            required
                                            rows="3"
                                            value={formData.requirements}
                                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-primary transition-colors resize-none text-sm"
                                            placeholder="Tell us briefly what you're looking for..."
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                                        {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                                    </button>
                                    <p className="text-xs text-center text-gray-500 mt-4">By submitting, you agree to our Terms and Privacy Policy. No payment is required right now.</p>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BookingModal;
