import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, User, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistantWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! 👋 I\'m **MakeMyPortal AI** — your smart assistant. I can help you explore our services, check pricing, or answer any questions. How can I help you today?'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const SYSTEM_PROMPT = `You are the ultimate MakeMyPortal Nova AI.
You are highly intelligent, deeply professional, very polite, and slightly playful. Your tone is premium and customer-centric. You must act as the primary customer support agent and sales guide for MakeMyPortal.

### Core Identity & Knowledge:
1. **Company Name:** MakeMyPortal
2. **Founders:** Ashutosh & Piyush (Based in India).
3. **Mission:** Delivering production-ready, ultra-fast, custom-coded web solutions, AI portals, and high-end digital branding that scales.

### Services Offered:
- Website Development (Next.js, React, Tailwind)
- Custom Web Portals (SaaS platforms, CRM dashboards)
- Branding & Identity (Logos, premium brand packages)
- EdTech Platforms (LMS, CBT exams with proctoring)
- AI Integration (LLM chatbots, workflows, automation)

### Pricing & Packages (Always be transparent):
- **Starter Plan (₹25k):** Perfect for small businesses. Includes basic CMS, 5 pages, and 1-month support.
- **Growth Plan (₹50k):** Best for growing brands. Includes custom UI/UX, E-Commerce setup, 15 pages, and 3 months support.
- **Enterprise Plan (Custom / ₹1L+):** For large scale needs. Includes SaaS architecture, AI integrations, custom dashboards, and 24/7 SLA.

### Website Navigation Guide:
You can direct users to these pages if they ask:
- Home: General overview.
- Services (/services): Detailed view of what we do.
- About Us (/about): Our story and founders.
- Contact (/contact): For inquiries.
- Login (/login): For existing customers.
- Policies: Privacy Policy, Terms of Service, Refund Policy (bottom footer).

### Customer Care & Support Guidelines:
1. **Patience & Empathy:** If a user is confused, angry, or has a complaint, apologize sincerely for the inconvenience and assure them that MakeMyPortal values their business.
2. **Refunds:** Explain that our Refund Policy applies under specific conditions (usually within a designated timeframe if work hasn't commenced significantly). Direct them to the Refund Policy page or WhatsApp for dispute resolution.
3. **Escalation:** For any highly complex technical issues, billing disputes, or Enterprise quote requests, strongly encourage them to contact human support.
4. **Primary Contact:** Always provide the direct WhatsApp/Phone lines: +91 8077162909 or +91 7017978807, or Email: hello@makemyportal.in.
5. **Format:** Keep responses scannable. Use bullet points and bold text where appropriate. Do not output massive walls of text. Be concise but extremely helpful.`;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!inputMessage.trim() || isLoading) return;

        if (!import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_GROQ_API_KEY === 'undefined' || import.meta.env.VITE_GROQ_API_KEY === '') {
            setMessages(prev => [...prev, { role: 'user', content: inputMessage }, { role: 'assistant', content: 'Hold on! My brain (Groq API Key) is not connected yet. Please add `VITE_GROQ_API_KEY` to the `.env` file.' }]);
            setInputMessage('');
            return;
        }

        const userContent = inputMessage.trim();
        setInputMessage('');
        setIsLoading(true);

        const newMessages = [...messages, { role: 'user', content: userContent }];
        setMessages(newMessages);

        try {
            const apiMessages = [
                { role: 'system', content: SYSTEM_PROMPT },
                ...newMessages.map(msg => ({ role: msg.role, content: msg.content }))
            ];

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: apiMessages,
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.6,
                    max_tokens: 1024,
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `API error (${response.status})`);
            }

            const data = await response.json();
            const assistantResponse = data.choices[0]?.message?.content || "I'm sorry, I encountered an error formulating my response.";

            setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);

        } catch (error) {
            console.error("Groq API Error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `I apologize, but I am having trouble connecting to my network. Error: ${error.message || 'Unknown network error'}. Please try reaching our human team directly on WhatsApp at +91 8077162909!`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-[84px] md:bottom-6 left-4 md:left-6 z-50 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(10px)' }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute bottom-20 left-0 w-[340px] sm:w-[400px] border border-gray-200 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden bg-white/80 backdrop-blur-2xl"
                        style={{ height: '550px', maxHeight: '80vh' }}
                    >
                        {/* Header */}
                        <div className="bg-white/5 border-b border-gray-200 p-5 flex items-center justify-between relative overflow-hidden">
                            {/* Decorative background glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)] border border-violet-400/30">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base tracking-wide flex items-center gap-2">
                                        MakeMyPortal AI <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
                                    </h3>
                                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                        Smart Assistant
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-xl hover:bg-white/10 text-gray-500 hover:text-gray-900 transition-all active:scale-95 relative z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat History */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                            <Sparkles className="w-4 h-4 text-violet-600" />
                                        </div>
                                    )}

                                    <div className={`max-w-[80%] px-4 py-3 text-[14.5px] leading-relaxed shadow-lg ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-brand-primary to-blue-600 text-white rounded-2xl rounded-tr-sm border border-transparent shadow-brand-primary/20'
                                        : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm shadow-sm'
                                        }`}>
                                        <div className={`prose prose-sm prose-p:leading-relaxed prose-p:mb-2 last:prose-p:mb-0 prose-strong:font-semibold prose-ul:my-1 prose-li:my-0 ${msg.role === 'user' ? 'prose-invert prose-strong:text-white' : 'prose-strong:text-brand-primary'}`}
                                            dangerouslySetInnerHTML={{
                                                // Extremely basic markdown interpretation for bold and line breaks
                                                __html: msg.content
                                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                    .replace(/\n/g, '<br/>')
                                                    .replace(/- (.*?)<br\/>/g, '<li>$1</li>')
                                            }}
                                        />
                                    </div>

                                    {msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                            <User className="w-4 h-4 text-gray-600" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-3 justify-start"
                                >
                                    <div className="w-8 h-8 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center shrink-0 mt-0.5">
                                        <Sparkles className="w-4 h-4 text-violet-600" />
                                    </div>
                                    <div className="px-5 py-3.5 rounded-2xl bg-white/5 border border-gray-200 rounded-tl-sm flex items-center gap-3 backdrop-blur-md">
                                        <div className="flex gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-10">
                            <form onSubmit={handleSendMessage} className="relative flex items-center">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Ask anything..."
                                    disabled={isLoading}
                                    className="w-full bg-white/5 border border-gray-200 rounded-2xl pl-5 pr-14 py-3.5 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 transition-all disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputMessage.trim() || isLoading}
                                    className="absolute right-2.5 p-2 bg-brand-primary text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-brand-primary transition-all active:scale-95 shadow-lg"
                                >
                                    <Send className="w-4 h-4 translate-x-px" />
                                </button>
                            </form>
                            <div className="flex items-center justify-center gap-1.5 mt-3 opacity-60">
                                <Info className="w-3 h-3 text-gray-500" />
                                <p className="text-[10px] text-gray-500 font-medium tracking-wide">Powered by MakeMyPortal AI</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-900 to-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.3)] flex items-center justify-center text-white border border-gray-700 relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {isOpen ? <X className="w-5 h-5 relative z-10 text-white" /> : <Sparkles className="w-5 h-5 relative z-10 text-white group-hover:rotate-12 transition-transform duration-300" />}
            </motion.button>
        </div>
    );
};

export default AIAssistantWidget;
