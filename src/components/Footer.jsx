import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
    const navigate = useNavigate();
    const { settings } = useSettings();

    const handleAnchorClick = (e, hash) => {
        e.preventDefault();
        const target = hash.replace('/#', '');
        if (window.location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        } else {
            document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const socialLinks = [
        { icon: Facebook, url: settings.facebook },
        { icon: Twitter, url: '' },
        { icon: Instagram, url: settings.instagram },
        { icon: Linkedin, url: settings.linkedin },
    ];

    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 group w-fit">
                            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary overflow-hidden">
                                <Rocket className="text-gray-900 w-4 h-4 z-10" />
                            </div>
                            <span className="font-heading font-bold text-lg tracking-tight">
                                {settings.businessName ? settings.businessName.replace('Portal', '') : 'MakeMy'}<span className="text-gradient">{settings.businessName ? 'Portal' : 'Portal'}</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {settings.tagline || 'Premium digital services platform empowering businesses and schools with modern web solutions and cutting-edge AI training.'}
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, i) => (
                                <a key={i} href={social.url || '#'} target={social.url ? '_blank' : undefined} rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white/10 transition-colors border border-gray-200">
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-gray-900 font-heading font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Services', path: '/services' },
                                { name: 'Pricing', path: '/#pricing', isAnchor: true },
                                { name: 'Sign In', path: '/login' },
                                { name: 'Register', path: '/register' },
                            ].map((link) => (
                                <li key={link.name}>
                                    {link.isAnchor ? (
                                        <a
                                            href={link.path}
                                            onClick={(e) => handleAnchorClick(e, link.path)}
                                            className="text-gray-500 text-sm hover:text-brand-primary transition-colors flex items-center gap-2 group cursor-pointer"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-brand-primary transition-colors" />
                                            {link.name}
                                        </a>
                                    ) : (
                                        <Link to={link.path} className="text-gray-500 text-sm hover:text-brand-primary transition-colors flex items-center gap-2 group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-brand-primary transition-colors" />
                                            {link.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-gray-900 font-heading font-semibold mb-6">Our Services</h3>
                        <ul className="space-y-4">
                            {['Web Development', 'EdTech Platforms', 'Brand Identity', 'AI Integration', 'Tech Consulting'].map((service) => (
                                <li key={service}>
                                    <Link to="/services" className="text-gray-500 text-sm hover:text-brand-secondary transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-brand-secondary transition-colors" />
                                        {service}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-gray-900 font-heading font-semibold mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-brand-primary shrink-0" />
                                <span>{settings.address || 'India'}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-brand-secondary shrink-0" />
                                <a href={`tel:${settings.phone || ''}`} className="hover:text-gray-900 transition-colors">{settings.phone || 'Contact Us'}</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-brand-accent shrink-0" />
                                <a href={`mailto:${settings.contactEmail || 'hello@makemyportal.in'}`} className="hover:text-gray-900 transition-colors">{settings.contactEmail || 'hello@makemyportal.in'}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} {settings.businessName || 'MakeMyPortal'}. All rights reserved.</p>
                    <div className="flex flex-wrap gap-6">
                        <Link to="/about" className="hover:text-gray-900 transition-colors">About Us</Link>
                        <Link to="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
                        <Link to="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
                        <Link to="/refund" className="hover:text-gray-900 transition-colors">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
