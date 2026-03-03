import React from 'react';
import { Scale, FileCheck, CreditCard, AlertOctagon, ShieldCheck, Ban, Gavel, Mail } from 'lucide-react';

const SectionCard = ({ icon: Icon, title, children }) => (
    <div className="bg-white/[0.03] border border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-gray-200 transition-all duration-300">
        <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-gray-900" />
            </div>
            <h2 className="text-xl font-heading font-semibold text-gray-900 pt-1.5">{title}</h2>
        </div>
        <div className="text-gray-500 text-sm leading-relaxed space-y-3 ml-14">
            {children}
        </div>
    </div>
);

const TermsOfService = () => {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-gray-200 rounded-full px-4 py-1.5 mb-6">
                        <Scale className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-gray-600">Legal</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-heading font-bold text-gray-900 mb-4">Terms of Service</h1>
                    <p className="text-gray-500">Last updated: March 1, 2026</p>
                </div>
            </section>

            {/* Content */}
            <section className="pb-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white/[0.03] border border-gray-200 rounded-2xl p-6 sm:p-8">
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Welcome to MakeMyPortal. By accessing or using our website and services, you agree to be bound by
                            these Terms of Service. Please read them carefully. If you do not agree with any part of these terms,
                            you may not use our services.
                        </p>
                    </div>

                    <SectionCard icon={FileCheck} title="Acceptance of Terms">
                        <p>By creating an account, placing an order, or using any part of our platform, you acknowledge that you have read, understood, and agree to these Terms of Service and our Privacy Policy.</p>
                        <p>We reserve the right to update these terms at any time. Continued use of our services after changes constitutes acceptance of the revised terms.</p>
                    </SectionCard>

                    <SectionCard icon={ShieldCheck} title="Our Services">
                        <p>MakeMyPortal provides digital services including but not limited to:</p>
                        <p>• Website design and development</p>
                        <p>• Brand identity and graphic design</p>
                        <p>• EdTech platform development</p>
                        <p>• AI integration and consulting</p>
                        <p>• Digital marketing and SEO services</p>
                        <p>Service specifications, timelines, and deliverables are agreed upon before project commencement. Any changes to the scope may affect pricing and delivery timelines.</p>
                    </SectionCard>

                    <SectionCard icon={CreditCard} title="Payments & Pricing">
                        <p>• All prices are listed in <strong className="text-gray-900">Indian Rupees (INR)</strong> unless otherwise specified.</p>
                        <p>• Payment is required as per the agreed terms — either upfront, milestone-based, or upon completion.</p>
                        <p>• We reserve the right to modify pricing for future services. Existing orders will not be affected.</p>
                        <p>• Non-payment or delayed payment may result in suspension of services.</p>
                    </SectionCard>

                    <SectionCard icon={AlertOctagon} title="Intellectual Property">
                        <p>• All original content, designs, and code created by MakeMyPortal are our intellectual property until full payment is received.</p>
                        <p>• Upon full payment, ownership of the deliverables transfers to the client, unless otherwise agreed.</p>
                        <p>• We reserve the right to showcase completed projects in our portfolio unless a non-disclosure agreement is in place.</p>
                        <p>• You may not resell, redistribute, or claim authorship of our proprietary tools, templates, or code.</p>
                    </SectionCard>

                    <SectionCard icon={Ban} title="Prohibited Conduct">
                        <p>You agree not to:</p>
                        <p>• Use our services for any unlawful or fraudulent purposes.</p>
                        <p>• Attempt to gain unauthorized access to our systems or data.</p>
                        <p>• Submit false, misleading, or harmful content.</p>
                        <p>• Interfere with or disrupt the normal operation of our platform.</p>
                        <p>• Violate any applicable local, national, or international laws.</p>
                    </SectionCard>

                    <SectionCard icon={Gavel} title="Limitation of Liability">
                        <p>MakeMyPortal shall not be liable for any indirect, incidental, consequential, or special damages arising out of or in connection with the use of our services.</p>
                        <p>Our total liability for any claim shall not exceed the amount paid by you for the specific service in question.</p>
                        <p>We are not responsible for delays or failures caused by circumstances beyond our reasonable control (force majeure).</p>
                    </SectionCard>

                    <SectionCard icon={Scale} title="Governing Law">
                        <p>These Terms of Service are governed by and construed in accordance with the laws of <strong className="text-gray-900">India</strong>. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts located in India.</p>
                    </SectionCard>

                    <SectionCard icon={Mail} title="Contact Us">
                        <p>If you have any questions about these Terms of Service, please contact us:</p>
                        <p>• <strong className="text-gray-900">Email:</strong> hello@makemyportal.in</p>
                        <p>• <strong className="text-gray-900">Website:</strong> www.makemyportal.in</p>
                    </SectionCard>
                </div>
            </section>
        </div>
    );
};

export default TermsOfService;
