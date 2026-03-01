import React, { createContext, useContext, useState, useEffect } from 'react';

const ServiceContext = createContext();

export const useServices = () => useContext(ServiceContext);

export const ServiceProvider = ({ children }) => {
    // Comprehensive Data based on user requirements
    const initialServices = [
        // 1. Website Development Services
        // Web
        { id: 'web-static', title: 'Static Website', description: 'Fast, lightweight websites perfect for simple online presence.', price: '₹5,000', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', features: ['Up to 5 Pages', 'Mobile Responsive', 'Contact Form'], category: '1️⃣ Web Development' },
        { id: 'web-dynamic', title: 'Dynamic Website', description: 'Content managed websites (CMS) where you can update your own content.', price: '₹12,000', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', features: ['Admin Panel', 'Blog Setup', 'SEO Ready'], category: '1️⃣ Web Development' },
        { id: 'web-corp', title: 'Corporate Website', description: 'Highly professional websites establishing corporate authority.', price: '₹25,000', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80', features: ['Custom Design', 'Premium Hosting', 'Lead Generation'], category: '1️⃣ Web Development' },
        { id: 'web-startup', title: 'Startup Website', description: 'High-converting, modern landing pages optimized for startup pitches.', price: '₹18,000', imageUrl: 'https://images.unsplash.com/photo-1559136555-9ce7b5fda2d6?w=600&q=80', features: ['Pitch Deck Integrations', 'Vibrant UI', 'Analytics'], category: '1️⃣ Web Development' },
        { id: 'web-portfolio', title: 'Portfolio Website', description: 'Showcase your work professionally with stunning galleries.', price: '₹8,000', imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&q=80', features: ['Gallery Layouts', 'Resume Integration', 'Fast Loading'], category: '1️⃣ Web Development' },
        { id: 'web-personal', title: 'Personal Brand Website', description: 'Build your personal authority online bridging social media and web.', price: '₹15,000', imageUrl: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=600&q=80', features: ['Link-in-bio setups', 'Newsletter integration', 'Social feed'], category: '1️⃣ Web Development' },
        { id: 'web-landing', title: 'Landing Page Design', description: 'Single purpose, high-conversion pages for ads and campaigns.', price: '₹4,000', imageUrl: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=600&q=80', features: ['A/B Testing Setup', 'Lead Capture Form', 'Copywriting Help'], category: '1️⃣ Web Development' },

        // E-Commerce
        { id: 'ecom-shopify', title: 'Shopify Store Setup', description: 'Complete Shopify setup for dropshipping or inventory stores.', price: '₹15,000', imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80', features: ['Theme Customization', 'App Integrations', 'Payment Setup'], category: '1️⃣ Web Development' },
        { id: 'ecom-woo', title: 'WooCommerce Setup', description: 'Self-hosted highly customizable ecommerce on WordPress.', price: '₹20,000', imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80', features: ['No monthly fees', 'Custom Checkout', 'Advanced Shipping'], category: '1️⃣ Web Development' },
        { id: 'ecom-custom', title: 'Custom E-Commerce', description: 'Built from scratch tailored online shopping experiences.', price: '₹45,000', imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80', features: ['MERN Stack', 'Ultimate Speed', 'Custom Logic'], category: '1️⃣ Web Development' },

        // Portals & Systems
        { id: 'sys-crm', title: 'CRM Development', description: 'Custom Customer Relationship Management systems.', price: '₹50,000', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', features: ['Lead Tracking', 'Sales Funnels', 'Staff Roles'], category: '1️⃣ Web Development' },
        { id: 'sys-erp', title: 'ERP Development', description: 'Enterprise Resource Planning tools tailored to your operations.', price: '₹80,000', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', features: ['Inventory', 'HR', 'Finance Modules'], category: '1️⃣ Web Development' },
        { id: 'sys-saas', title: 'SaaS MVP Development', description: 'Get your Software-as-a-Service idea built and launched fast.', price: '₹1,00,000', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80', features: ['Multitenant Architecture', 'Stripe Billing', 'User Dashboard'], category: '1️⃣ Web Development' },

        // 2. School & Education Tech
        { id: 'edu-website', title: 'School Website', description: 'Professional modern interfaces for educational institutions.', price: '₹18,000', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80', features: ['Notice Boards', 'Gallery', 'Inquiry Forms'], category: '2️⃣ School & EdTech' },
        { id: 'edu-erp', title: 'Complete School ERP', description: 'End-to-end management software for schools (Attendance, Fee, Exams).', price: '₹60,000', imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80', features: ['Parent/Teacher DB', 'Fee Tracking', 'Report Cards'], category: '2️⃣ School & EdTech' },
        { id: 'edu-lms', title: 'LMS Setup', description: 'Learning Management System for selling online courses.', price: '₹35,000', imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&q=80', features: ['Video Hosting', 'Quizzes', 'Certificates'], category: '2️⃣ School & EdTech' },
        { id: 'edu-portal', title: 'Online Exam Portal', description: 'Secure CBT (Computer Based Testing) environment matching JEE/NEET UI.', price: '₹40,000', imageUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&q=80', features: ['Anti-cheat', 'Result Analytics', 'Timer'], category: '2️⃣ School & EdTech' },

        // 3. Branding & Graphic Design
        { id: 'brand-kit', title: 'Brand Identity Kit', description: 'Complete company branding including logos, colors, and typography.', price: '₹15,000', imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80', features: ['Primary Logo', 'Brand Book PDF', 'Stationery Design'], category: '3️⃣ Branding & Design' },
        { id: 'brand-print', title: 'Prospectus / Brochure', description: 'High-quality print-ready layouts for marketing materials.', price: '₹8,000', imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80', features: ['Multipage Layout', 'Copy Editing', 'Print Ready CMYK'], category: '3️⃣ Branding & Design' },
        { id: 'brand-social', title: 'Social Media Grid', description: 'Monthly social media post and story templates that convert.', price: '₹10,000/mo', imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80', features: ['15 Custom Posts', 'Reel Covers', 'Hashtag Strategy'], category: '3️⃣ Branding & Design' },

        // 4. AI & Automation Services
        { id: 'ai-bot', title: 'Website AI Chatbot', description: 'Custom trained ChatGPT bot on your website data to handle leads.', price: '₹12,000', imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80', features: ['Custom Knowledge', 'Lead Capture', '24/7 Support'], category: '4️⃣ AI & Automation' },
        { id: 'ai-whatsapp', title: 'WhatsApp AI Bot', description: 'Automate WhatsApp conversations with AI precision.', price: '₹18,000', imageUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600&q=80', features: ['API Integration', 'Flow Builder', 'Broadcasts'], category: '4️⃣ AI & Automation' },
        { id: 'ai-train', title: 'AI Productivity Course', description: 'Training for teams and individuals to harness AI for daily tasks.', price: '₹5,000', imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80', features: ['Prompt Engineering', 'Workflow hacks', 'Live Demo'], category: '4️⃣ AI & Automation' },

        // 5. Consulting
        { id: 'consult-tech', title: 'Tech Stack Consulting', description: 'Expert advice on choosing the right tech tailored to your scale.', price: '₹5,000', imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80', features: ['Architecture Plan', 'Cost Analysis', 'Scalability'], category: '5️⃣ Startup Consulting' },
        { id: 'consult-mvp', title: 'MVP Planning', description: 'Transforming your abstract idea into a concrete software roadmap.', price: '₹10,000', imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80', features: ['Wireframes', 'Feature Prioritization', 'Timeline'], category: '5️⃣ Startup Consulting' },

        // 6. Digital Marketing
        { id: 'mkt-seo', title: 'Complete SEO Setup', description: 'On-page and technical SEO to rank your site on Google.', price: '₹12,000', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', features: ['Keyword Research', 'Meta Tags', 'Speed Opt'], category: '6️⃣ Digital Marketing' },
        { id: 'mkt-gmb', title: 'Google Business Profile', description: 'Local SEO setup and map ranking optimization.', price: '₹3,000', imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&q=80', features: ['Profile Creation', 'Review Strategy', 'Local Citations'], category: '6️⃣ Digital Marketing' },

        // 7. Maintenance & Support
        { id: 'maint-web', title: 'Website Maintenance', description: 'Monthly retainer for hosting, security, and minor updates.', price: '₹3,000/mo', imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80', features: ['Daily Backups', 'Uptime Monitor', 'Malware Scan'], category: '7️⃣ Maintenance & Support' },

        // 8. Digital Products
        { id: 'prod-canva', title: 'Canva Templates Pack', description: 'Editable branded Canva templates for your social media.', price: '₹999', imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80', features: ['50+ Designs', 'Drag & Drop', 'Format ready'], category: '8️⃣ Digital Products' },
        { id: 'prod-prompts', title: 'AI Prompt Packs', description: 'Curated 1000+ ChatGPT prompts for marketing and workflows.', price: '₹499', imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80', features: ['Tested Prompts', 'Marketing Focus', 'Copy-paste'], category: '8️⃣ Digital Products' },

        // 9. Combo Packages
        { id: 'combo-startup', title: 'Complete Startup Digital Kit', description: 'Logo + Website + Social Media setup all in one highly discounted package.', price: '₹35,000', imageUrl: 'https://images.unsplash.com/photo-1559136555-9ce7b5fda2d6?w=600&q=80', features: ['Brand Identity', '5 Page Website', 'SEO Setup'], category: '9️⃣ Combo Packages' },
        { id: 'combo-school', title: 'Complete School Transformation', description: 'ERP + Website + App + Admission Campaigns setup.', price: '₹1,20,000', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80', features: ['Software Suite', 'Staff Training', 'Cloud Hosting'], category: '9️⃣ Combo Packages' }
    ];

    // Force clear local storage when categories structure is updated
    const [services, setServices] = useState(() => {
        const saved = localStorage.getItem('portal_services_v3'); // changed key
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (_e) {
                return initialServices;
            }
        }
        return initialServices;
    });

    useEffect(() => {
        localStorage.setItem('portal_services_v3', JSON.stringify(services));
    }, [services]);

    const addService = (newService) => {
        setServices(prev => [...prev, { ...newService, id: Date.now().toString() }]);
    };

    const updateService = (id, updatedService) => {
        setServices(prev => prev.map(s => s.id === id ? { ...s, ...updatedService } : s));
    };

    const deleteService = (id) => {
        setServices(prev => prev.filter(s => s.id !== id));
    };

    const value = {
        services,
        addService,
        updateService,
        deleteService
    };

    return (
        <ServiceContext.Provider value={value}>
            {children}
        </ServiceContext.Provider>
    );
};

