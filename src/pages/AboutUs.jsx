import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Rocket, Target, Eye, Heart, Zap, Users, ArrowRight, Sparkles, Shield, Star } from 'lucide-react';

const AboutUs = () => {
    const values = [
        { icon: Zap, title: 'Innovation', desc: 'We push boundaries with cutting-edge technology and creative problem-solving.', color: 'from-yellow-500 to-orange-500' },
        { icon: Shield, title: 'Trust', desc: 'Transparency, integrity, and reliability are the cornerstones of every relationship we build.', color: 'from-blue-500 to-cyan-500' },
        { icon: Star, title: 'Quality', desc: 'We never compromise on quality. Every pixel, every line of code, is crafted to perfection.', color: 'from-purple-500 to-pink-500' },
        { icon: Heart, title: 'Impact', desc: 'We measure success by the real-world impact our solutions create for our clients.', color: 'from-red-500 to-rose-500' },
    ];

    const founders = [
        {
            name: 'Ashutosh',
            role: 'Founder & CEO',
            initial: 'A',
            gradient: 'from-brand-primary to-brand-secondary',
            bio: 'A visionary entrepreneur with a passion for technology and education. Ashutosh founded MakeMyPortal with the mission to democratize premium digital solutions, making world-class technology accessible to businesses and schools across India.',
        },
        {
            name: 'Piyush',
            role: 'Co-Founder & CTO',
            initial: 'P',
            gradient: 'from-brand-secondary to-brand-accent',
            bio: 'A tech enthusiast and problem solver at heart. Piyush leads the technical vision at MakeMyPortal, architecting scalable, modern platforms that empower clients to compete and win in the digital age.',
        },
    ];

    return (
        <div className="min-h-screen">
            <Helmet>
                <title>About Us | MakeMyPortal</title>
                <meta name="description" content="Learn about MakeMyPortal's mission, vision, and leadership. We build digital futures and empower companies with top-tier engineering." />
                <link rel="canonical" href="https://makemyportal.com/about" />
            </Helmet>
            {/* Hero */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 via-transparent to-transparent" />
                <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-brand-secondary/10 rounded-full blur-[120px]" />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-gray-200 rounded-full px-4 py-1.5 mb-8">
                        <Sparkles className="w-4 h-4 text-brand-primary" />
                        <span className="text-sm text-gray-600">About MakeMyPortal</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6">
                        We Build <span className="text-gradient">Digital Futures</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
                        MakeMyPortal is a premium digital solutions company empowering businesses and educational institutions
                        with cutting-edge technology, stunning designs, and intelligent automation.
                    </p>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Vision */}
                        <div className="relative group">
                            <div className="absolute -inset-px bg-gradient-to-br from-brand-primary/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                            <div className="relative bg-white/[0.03] border border-gray-200 rounded-2xl p-8 hover:border-gray-200 transition-all duration-300 h-full">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center mb-6">
                                    <Eye className="w-7 h-7 text-gray-900" />
                                </div>
                                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">Our Vision</h2>
                                <p className="text-gray-500 leading-relaxed">
                                    To become India's most trusted digital partner — a company that transforms
                                    how businesses and schools experience technology. We envision a future where every organization,
                                    regardless of size, has access to world-class digital solutions that drive growth,
                                    efficiency, and innovation.
                                </p>
                            </div>
                        </div>

                        {/* Mission */}
                        <div className="relative group">
                            <div className="absolute -inset-px bg-gradient-to-br from-brand-secondary/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                            <div className="relative bg-white/[0.03] border border-gray-200 rounded-2xl p-8 hover:border-gray-200 transition-all duration-300 h-full">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-secondary to-brand-accent flex items-center justify-center mb-6">
                                    <Target className="w-7 h-7 text-gray-900" />
                                </div>
                                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">Our Mission</h2>
                                <p className="text-gray-500 leading-relaxed">
                                    To deliver production-ready, premium digital solutions that genuinely solve problems.
                                    From high-end branding and modern web platforms to AI-powered tools and EdTech systems —
                                    we bring enterprise-grade quality at accessible pricing, with integrity and speed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Founders */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-gray-200 rounded-full px-4 py-1.5 mb-6">
                            <Users className="w-4 h-4 text-brand-secondary" />
                            <span className="text-sm text-gray-600">Leadership</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">Meet Our Founders</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Two passionate individuals driven by a shared dream — to build technology that makes a difference.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {founders.map((founder, i) => (
                            <div key={i} className="relative group">
                                <div className={`absolute -inset-px bg-gradient-to-br ${founder.gradient} rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-sm`} />
                                <div className="relative bg-white/[0.03] border border-gray-200 rounded-2xl p-8 hover:border-gray-200 transition-all duration-300 text-center">
                                    <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${founder.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-primary/20`}>
                                        <span className="text-3xl font-heading font-bold text-gray-900">{founder.initial}</span>
                                    </div>
                                    <h3 className="text-xl font-heading font-bold text-gray-900 mb-1">{founder.name}</h3>
                                    <p className={`text-sm font-medium bg-gradient-to-r ${founder.gradient} bg-clip-text text-transparent mb-4`}>{founder.role}</p>
                                    <p className="text-gray-500 text-sm leading-relaxed">{founder.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">What We Stand For</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Our values aren't just words — they're the principles that guide every decision, every project, every interaction.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, i) => (
                            <div key={i} className="relative group">
                                <div className="bg-white/[0.03] border border-gray-200 rounded-2xl p-6 hover:border-gray-200 transition-all duration-300 h-full">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                        <value.icon className="w-6 h-6 text-gray-900" />
                                    </div>
                                    <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">{value.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 via-brand-secondary/20 to-brand-accent/20 rounded-3xl blur-xl" />
                        <div className="relative bg-white/[0.03] border border-gray-200 rounded-3xl p-12">
                            <Rocket className="w-12 h-12 text-brand-primary mx-auto mb-6" />
                            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
                                Ready to Build Something Amazing?
                            </h2>
                            <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
                                Let's turn your vision into reality. Partner with MakeMyPortal and experience the difference.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold px-8 py-3.5 rounded-xl hover:shadow-lg hover:shadow-brand-primary/25 transition-all duration-300">
                                    Get in Touch <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link to="/services" className="inline-flex items-center justify-center gap-2 bg-white/5 border border-gray-200 text-gray-900 font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300">
                                    View Services
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
