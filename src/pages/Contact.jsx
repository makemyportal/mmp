import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../context/SettingsContext';

const Contact = () => {
    const { settings } = useSettings();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Construct mailto link
        const mailtoLink = `mailto:${settings.contactEmail || 'hello@makemyportal.com'}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
        window.location.href = mailtoLink;
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email Us',
            value: settings.contactEmail || 'hello@makemyportal.com',
            link: `mailto:${settings.contactEmail || 'hello@makemyportal.com'}`,
            color: 'from-brand-primary to-brand-secondary',
        },
        {
            icon: Phone,
            title: 'Call Us',
            value: settings.phone || 'Contact available on request',
            link: settings.phone ? `tel:${settings.phone}` : null,
            color: 'from-brand-secondary to-brand-accent',
        },
        {
            icon: MapPin,
            title: 'Our Location',
            value: settings.address || 'India',
            link: null,
            color: 'from-orange-500 to-red-500',
        },
        {
            icon: Clock,
            title: 'Working Hours',
            value: 'Mon – Sat, 10 AM – 7 PM IST',
            link: null,
            color: 'from-emerald-500 to-teal-500',
        },
    ];

    return (
        <div className="min-h-screen">
            <Helmet>
                <title>Contact Us | MakeMyPortal</title>
                <meta name="description" content="Get in touch with MakeMyPortal. Ready to build something extraordinary? Drop us a message, email, or chat via WhatsApp." />
                <link rel="canonical" href="https://makemyportal.com/contact" />
            </Helmet>
            {/* Hero */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 via-transparent to-transparent" />
                <div className="absolute top-20 right-1/4 w-72 h-72 bg-brand-secondary/10 rounded-full blur-[120px]" />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-gray-200 rounded-full px-4 py-1.5 mb-8">
                        <MessageSquare className="w-4 h-4 text-brand-primary" />
                        <span className="text-sm text-gray-600">Get in Touch</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6">
                        Let's <span className="text-gradient">Talk</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Have a project in mind? Want to collaborate? Or just want to say hello?
                        We'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, i) => (
                            <div key={i} className="relative group">
                                <div className="bg-white/[0.03] border border-gray-200 rounded-2xl p-6 hover:border-gray-200 transition-all duration-300 h-full">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <info.icon className="w-6 h-6 text-gray-900" />
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">{info.title}</h3>
                                    {info.link ? (
                                        <a href={info.link} className="text-gray-900 text-sm font-medium hover:text-brand-primary transition-colors break-all">{info.value}</a>
                                    ) : (
                                        <p className="text-gray-900 text-sm font-medium">{info.value}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WhatsApp Booking */}
            <section className="pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative">
                        <div className="absolute -inset-px bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-sm" />
                        <div className="relative bg-white/[0.03] border border-green-500/20 rounded-2xl p-8 sm:p-10">
                            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
                                    <svg className="w-8 h-8 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                                <div className="text-center sm:text-left flex-grow">
                                    <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">Book via WhatsApp</h2>
                                    <p className="text-gray-500 text-sm mb-5">Instant booking! Message us on WhatsApp and get a quick response.</p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <a
                                            href="https://wa.me/918077162909?text=Hi%20MakeMyPortal!%20I%20want%20to%20book%20a%20service."
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-gray-900 font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-green-600/20 hover:shadow-green-600/40"
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            8077162909
                                        </a>
                                        <a
                                            href="https://wa.me/917017978807?text=Hi%20MakeMyPortal!%20I%20want%20to%20book%20a%20service."
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-gray-900 font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-green-600/20 hover:shadow-green-600/40"
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            7017978807
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="pb-24">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative">
                        <div className="absolute -inset-px bg-gradient-to-br from-brand-primary/30 to-brand-secondary/30 rounded-2xl blur-sm" />
                        <div className="relative bg-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 sm:p-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
                                    <Send className="w-5 h-5 text-gray-900" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-heading font-bold text-gray-900">Send us a Message</h2>
                                    <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Your Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/5 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full bg-white/5 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 transition-all"
                                        placeholder="I need a website for my business..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-white/5 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 transition-all resize-none"
                                        placeholder="Tell us about your project..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold px-8 py-3.5 rounded-xl hover:shadow-lg hover:shadow-brand-primary/25 transition-all duration-300"
                                >
                                    {submitted ? (
                                        <>
                                            <Sparkles className="w-4 h-4" /> Message Sent!
                                        </>
                                    ) : (
                                        <>
                                            Send Message <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
