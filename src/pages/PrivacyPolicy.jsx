import React from 'react';
import { Shield, Lock, Eye, Server, Cookie, UserCheck, Mail, FileText } from 'lucide-react';

const SectionCard = ({ icon: Icon, title, children }) => (
    <div className="bg-white/[0.03] border border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-gray-200 transition-all duration-300">
        <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-gray-900" />
            </div>
            <h2 className="text-xl font-heading font-semibold text-gray-900 pt-1.5">{title}</h2>
        </div>
        <div className="text-gray-500 text-sm leading-relaxed space-y-3 ml-14">
            {children}
        </div>
    </div>
);

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 via-transparent to-transparent" />
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-gray-200 rounded-full px-4 py-1.5 mb-6">
                        <Shield className="w-4 h-4 text-brand-primary" />
                        <span className="text-sm text-gray-600">Legal</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-heading font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-gray-500">Last updated: March 1, 2026</p>
                </div>
            </section>

            {/* Content */}
            <section className="pb-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white/[0.03] border border-gray-200 rounded-2xl p-6 sm:p-8">
                        <p className="text-gray-500 text-sm leading-relaxed">
                            At MakeMyPortal, your privacy is our priority. This Privacy Policy describes how we collect, use,
                            and protect your personal information when you use our website and services. By using our platform,
                            you agree to the practices described in this policy.
                        </p>
                    </div>

                    <SectionCard icon={FileText} title="Information We Collect">
                        <p><strong className="text-gray-900">Personal Information:</strong> Name, email address, phone number, and billing details when you register or place an order.</p>
                        <p><strong className="text-gray-900">Usage Data:</strong> Browser type, IP address, pages visited, time spent on pages, and other diagnostic data.</p>
                        <p><strong className="text-gray-900">Communication Data:</strong> Messages, feedback, and support requests you send to us.</p>
                    </SectionCard>

                    <SectionCard icon={Eye} title="How We Use Your Information">
                        <p>• To provide, maintain, and improve our services.</p>
                        <p>• To process orders, payments, and deliver purchased services.</p>
                        <p>• To communicate with you about updates, promotions, and support.</p>
                        <p>• To analyze usage patterns and improve user experience.</p>
                        <p>• To comply with legal obligations and protect our rights.</p>
                    </SectionCard>

                    <SectionCard icon={Cookie} title="Cookies & Tracking">
                        <p>We use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser preferences.</p>
                        <p>We may use third-party analytics services (e.g., Google Analytics) that collect anonymized usage data to help us understand how visitors interact with our platform.</p>
                    </SectionCard>

                    <SectionCard icon={Server} title="Third-Party Services">
                        <p>We may share your data with trusted third-party services to facilitate our operations:</p>
                        <p>• <strong className="text-gray-900">Payment Processors:</strong> To securely process your payments.</p>
                        <p>• <strong className="text-gray-900">Cloud Infrastructure:</strong> For hosting and data storage (e.g., Firebase, Google Cloud).</p>
                        <p>• <strong className="text-gray-900">Analytics Providers:</strong> For anonymous usage analytics.</p>
                        <p>We do not sell, trade, or rent your personal information to third parties.</p>
                    </SectionCard>

                    <SectionCard icon={Lock} title="Data Security">
                        <p>We implement industry-standard security measures including encryption, secure servers, and access controls to protect your personal data. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>
                    </SectionCard>

                    <SectionCard icon={UserCheck} title="Your Rights">
                        <p>You have the right to:</p>
                        <p>• <strong className="text-gray-900">Access</strong> the personal information we hold about you.</p>
                        <p>• <strong className="text-gray-900">Correct</strong> any inaccurate or incomplete data.</p>
                        <p>• <strong className="text-gray-900">Delete</strong> your account and associated personal data.</p>
                        <p>• <strong className="text-gray-900">Opt out</strong> of marketing communications at any time.</p>
                    </SectionCard>

                    <SectionCard icon={Mail} title="Contact Us">
                        <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
                        <p>• <strong className="text-gray-900">Email:</strong> hello@makemyportal.com</p>
                        <p>• <strong className="text-gray-900">Website:</strong> www.makemyportal.com</p>
                    </SectionCard>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
