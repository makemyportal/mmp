import React from 'react';
import { RotateCcw, Clock, AlertTriangle, CheckCircle, XCircle, Mail, HelpCircle, CreditCard } from 'lucide-react';

const SectionCard = ({ icon: Icon, title, children }) => (
    <div className="bg-white/[0.03] border border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-gray-200 transition-all duration-300">
        <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-gray-900" />
            </div>
            <h2 className="text-xl font-heading font-semibold text-gray-900 pt-1.5">{title}</h2>
        </div>
        <div className="text-gray-500 text-sm leading-relaxed space-y-3 ml-14">
            {children}
        </div>
    </div>
);

const RefundPolicy = () => {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent" />
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-gray-200 rounded-full px-4 py-1.5 mb-6">
                        <RotateCcw className="w-4 h-4 text-orange-400" />
                        <span className="text-sm text-gray-600">Legal</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-heading font-bold text-gray-900 mb-4">Refund & Cancellation Policy</h1>
                    <p className="text-gray-500">Last updated: March 1, 2026</p>
                </div>
            </section>

            {/* Content */}
            <section className="pb-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white/[0.03] border border-gray-200 rounded-2xl p-6 sm:p-8">
                        <p className="text-gray-500 text-sm leading-relaxed">
                            At MakeMyPortal, we are committed to delivering the highest quality digital services.
                            We understand that sometimes things don't go as planned, and this policy outlines the
                            terms under which refunds or cancellations may be requested.
                        </p>
                    </div>

                    <SectionCard icon={CheckCircle} title="Eligibility for Refund">
                        <p>You may be eligible for a refund under the following conditions:</p>
                        <p>• The service was <strong className="text-gray-900">not delivered</strong> within the agreed-upon timeline without prior communication.</p>
                        <p>• The delivered work is <strong className="text-gray-900">significantly different</strong> from the agreed project scope or specifications.</p>
                        <p>• A <strong className="text-gray-900">technical issue</strong> on our end prevents the service from being delivered or used.</p>
                        <p>• Refund request is made within <strong className="text-gray-900">7 days</strong> of delivery.</p>
                    </SectionCard>

                    <SectionCard icon={XCircle} title="Non-Refundable Situations">
                        <p>Refunds will <strong className="text-gray-900">not</strong> be issued in the following cases:</p>
                        <p>• Change of mind after the project work has begun.</p>
                        <p>• Failure to provide required content, assets, or feedback within the specified timeline.</p>
                        <p>• Services that have been fully delivered and approved by the client.</p>
                        <p>• Third-party costs already incurred (e.g., domain registration, hosting, premium tools).</p>
                        <p>• Customization or design preferences that differ from personal taste but meet the agreed specifications.</p>
                    </SectionCard>

                    <SectionCard icon={Clock} title="Cancellation Policy">
                        <p>• You may cancel an order <strong className="text-gray-900">before work begins</strong> for a full refund.</p>
                        <p>• Cancellations made <strong className="text-gray-900">after work has started</strong> may be subject to a partial refund based on the progress completed.</p>
                        <p>• To cancel, contact us immediately via email with your order details.</p>
                    </SectionCard>

                    <SectionCard icon={CreditCard} title="Refund Process">
                        <p>Once a refund is approved:</p>
                        <p>• Refunds will be processed within <strong className="text-gray-900">7–10 business days</strong>.</p>
                        <p>• The refund will be credited to the <strong className="text-gray-900">original payment method</strong> used during purchase.</p>
                        <p>• You will receive an email confirmation once the refund has been initiated.</p>
                    </SectionCard>

                    <SectionCard icon={AlertTriangle} title="Dispute Resolution">
                        <p>If you are not satisfied with our resolution, we encourage open communication. We will make every reasonable effort to reach a fair outcome. All disputes will be resolved in accordance with Indian law.</p>
                    </SectionCard>

                    <SectionCard icon={Mail} title="Contact for Refunds">
                        <p>To request a refund or cancellation, please reach out to us:</p>
                        <p>• <strong className="text-gray-900">Email:</strong> hello@makemyportal.in</p>
                        <p>• Please include your <strong className="text-gray-900">order ID</strong>, the <strong className="text-gray-900">service name</strong>, and the <strong className="text-gray-900">reason for your request</strong>.</p>
                    </SectionCard>
                </div>
            </section>
        </div>
    );
};

export default RefundPolicy;
