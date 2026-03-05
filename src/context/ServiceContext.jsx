import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs, writeBatch, serverTimestamp, getDoc, setDoc } from 'firebase/firestore';

const ServiceContext = createContext();

export const useServices = () => useContext(ServiceContext);

// ─── Seed Version: Increment this to re-seed services ───
const SEED_VERSION = 5;

// ─── Comprehensive Indian Digital Services Catalog ───
// Sorted by price ascending within each category
const seedData = [
    // ═══════════════════════════════════════════
    // 1️⃣ GRAPHIC DESIGN (Small, Affordable)
    // ═══════════════════════════════════════════
    { id: 'gd-thumbnail', title: 'YouTube Thumbnail Design', description: 'Eye-catching, click-worthy thumbnails for your YouTube videos.', price: '₹199', imageUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&q=80', features: ['3 Thumbnail Designs', 'High Resolution', 'Unlimited Revisions'], category: 'Graphic Design' },
    { id: 'gd-poster', title: 'Poster / Flyer Design', description: 'Attractive posters and flyers for events, promotions, and marketing.', price: '₹299', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80', features: ['Print Ready', 'Social Media Size', 'Quick Delivery'], category: 'Graphic Design' },
    { id: 'gd-visiting', title: 'Visiting Card Design', description: 'Professional business/visiting card designs that leave an impression.', price: '₹399', imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80', features: ['Front & Back Design', 'Print Ready PDF', '2 Concepts'], category: 'Graphic Design' },
    { id: 'gd-invitation', title: 'Invitation Card Design', description: 'Beautiful digital wedding, birthday & event invitation cards.', price: '₹499', imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&q=80', features: ['WhatsApp Ready', 'Custom Theme', 'Photo Integration'], category: 'Graphic Design' },
    { id: 'gd-menu', title: 'Restaurant Menu Design', description: 'Stylish food menus for restaurants, cafes, and cloud kitchens.', price: '₹799', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80', features: ['Multi-page Layout', 'Food Photography', 'QR Code Menu'], category: 'Graphic Design' },
    { id: 'gd-certificate', title: 'Certificate Design', description: 'Professional certificates for courses, events, and achievements.', price: '₹499', imageUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&q=80', features: ['Editable Template', 'Gold Foil Style', 'Bulk Ready'], category: 'Graphic Design' },
    { id: 'gd-letterhead', title: 'Letterhead & ID Card', description: 'Official letterhead, ID cards, and stationery for your organization.', price: '₹599', imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80', features: ['Letterhead', 'ID Card', 'Envelope Design'], category: 'Graphic Design' },
    { id: 'gd-resume', title: 'Professional Resume / CV', description: 'Modern, ATS-friendly resume designs that get you interviews.', price: '₹499', imageUrl: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=600&q=80', features: ['ATS Optimized', 'Modern Layout', 'Cover Letter'], category: 'Graphic Design' },
    { id: 'gd-banner', title: 'Banner / Hoarding Design', description: 'Large format designs for flex banners, hoardings, and standees.', price: '₹999', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80', features: ['Any Size', 'Print Ready CMYK', 'Fast Delivery'], category: 'Graphic Design' },

    // ═══════════════════════════════════════════
    // 2️⃣ LOGO & BRANDING
    // ═══════════════════════════════════════════
    { id: 'logo-basic', title: 'Logo Design (Basic)', description: 'Clean, minimal logo perfect for startups and small businesses.', price: '₹999', imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80', features: ['3 Concepts', 'Vector Files', 'Unlimited Revisions'], category: 'Logo & Branding' },
    { id: 'logo-premium', title: 'Logo Design (Premium)', description: 'Premium logo with brand guidelines and multiple variations.', price: '₹2,999', imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80', features: ['5 Concepts', 'Brand Colors', 'Social Media Kit'], category: 'Logo & Branding' },
    { id: 'brand-print', title: 'Prospectus / Brochure', description: 'High-quality print-ready layouts for marketing materials.', price: '₹5,000', imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80', features: ['Multipage Layout', 'Copy Editing', 'Print Ready CMYK'], category: 'Logo & Branding' },
    { id: 'brand-kit', title: 'Complete Brand Identity Kit', description: 'Full company branding — logo, colors, typography, stationery.', price: '₹9,999', imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80', features: ['Logo + Variations', 'Brand Book PDF', 'Stationery Design'], category: 'Logo & Branding' },

    // ═══════════════════════════════════════════
    // 3️⃣ SOCIAL MEDIA SERVICES
    // ═══════════════════════════════════════════
    { id: 'sm-setup', title: 'Social Media Page Setup', description: 'Complete setup of Instagram, Facebook, and YouTube profiles.', price: '₹999', imageUrl: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&q=80', features: ['Profile Optimization', 'Cover Images', 'Bio Writing'], category: 'Social Media' },
    { id: 'sm-yt-setup', title: 'YouTube Channel Setup', description: 'Professional YouTube channel setup with branding and SEO.', price: '₹1,499', imageUrl: 'https://images.unsplash.com/photo-1594312915251-48db9280c8f1?w=600&q=80', features: ['Channel Art', 'SEO Setup', 'Intro/Outro'], category: 'Social Media' },
    { id: 'sm-posts', title: 'Social Media Posts (15/mo)', description: 'Monthly social media post and story templates that convert.', price: '₹2,999/mo', imageUrl: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=600&q=80', features: ['15 Custom Posts', 'Reel Covers', 'Hashtag Strategy'], category: 'Social Media' },
    { id: 'sm-management', title: 'Social Media Management', description: 'Full social media management — content, posting, engagement.', price: '₹7,999/mo', imageUrl: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=600&q=80', features: ['30 Posts/Month', 'Stories & Reels', 'Analytics Report'], category: 'Social Media' },

    // ═══════════════════════════════════════════
    // 4️⃣ VIDEO & PHOTO EDITING
    // ═══════════════════════════════════════════
    { id: 'vid-photo', title: 'Photo Editing / Retouching', description: 'Professional photo editing, background removal, and retouching.', price: '₹99/photo', imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80', features: ['Background Removal', 'Color Correction', 'Retouching'], category: 'Video & Photo Editing' },
    { id: 'vid-reel', title: 'Instagram Reel Editing', description: 'Trendy, engaging Instagram reels with effects and transitions.', price: '₹499/reel', imageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&q=80', features: ['Trending Audio', 'Transitions', 'Subtitles'], category: 'Video & Photo Editing' },
    { id: 'vid-yt', title: 'YouTube Video Editing', description: 'Professional YouTube video editing with effects and thumbnails.', price: '₹999/video', imageUrl: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=600&q=80', features: ['Color Grading', 'SFX & Music', 'Thumbnail'], category: 'Video & Photo Editing' },
    { id: 'vid-wedding', title: 'Wedding Video Editing', description: 'Cinematic wedding highlight reels and full ceremony edits.', price: '₹4,999', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', features: ['Cinematic Style', 'Music Sync', 'Color Grading'], category: 'Video & Photo Editing' },
    { id: 'vid-product', title: 'Product Photography Edit', description: 'E-commerce ready product photo editing for Amazon, Flipkart.', price: '₹149/photo', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', features: ['White Background', 'Infographic', 'Amazon Ready'], category: 'Video & Photo Editing' },

    // ═══════════════════════════════════════════
    // 5️⃣ WEBSITE DEVELOPMENT
    // ═══════════════════════════════════════════
    { id: 'web-landing', title: 'Landing Page Design', description: 'Single purpose, high-conversion pages for ads and campaigns.', price: '₹2,999', imageUrl: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=600&q=80', features: ['A/B Testing Setup', 'Lead Capture Form', 'Mobile Responsive'], category: 'Website Development' },
    { id: 'web-static', title: 'Static Website (5 Pages)', description: 'Fast, lightweight websites perfect for small business online presence.', price: '₹4,999', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', features: ['Up to 5 Pages', 'Mobile Responsive', 'Contact Form'], category: 'Website Development' },
    { id: 'web-portfolio', title: 'Portfolio Website', description: 'Showcase your work professionally with stunning galleries.', price: '₹5,999', imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&q=80', features: ['Gallery Layouts', 'Resume Integration', 'Fast Loading'], category: 'Website Development' },
    { id: 'web-personal', title: 'Personal Brand Website', description: 'Build your personal authority online bridging social media and web.', price: '₹7,999', imageUrl: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=600&q=80', features: ['Link-in-bio Setup', 'Newsletter Integration', 'Social Feed'], category: 'Website Development' },
    { id: 'web-dynamic', title: 'Dynamic Website (CMS)', description: 'Content managed websites where you can update your own content.', price: '₹9,999', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', features: ['Admin Panel', 'Blog Setup', 'SEO Ready'], category: 'Website Development' },
    { id: 'web-startup', title: 'Startup Website', description: 'High-converting, modern websites optimized for startup pitches.', price: '₹14,999', imageUrl: 'https://images.unsplash.com/photo-1559136555-9ce7b5fda2d6?w=600&q=80', features: ['Pitch Deck Integrations', 'Vibrant UI', 'Analytics'], category: 'Website Development' },
    { id: 'web-corp', title: 'Corporate Website', description: 'Highly professional websites establishing corporate authority.', price: '₹19,999', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80', features: ['Custom Design', 'Premium Hosting', 'Lead Generation'], category: 'Website Development' },

    // ═══════════════════════════════════════════
    // 6️⃣ E-COMMERCE
    // ═══════════════════════════════════════════
    { id: 'ecom-listing', title: 'Amazon/Flipkart Listing', description: 'Product listing optimization for Amazon and Flipkart sellers.', price: '₹499/product', imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80', features: ['SEO Keywords', 'A+ Content', 'Infographic'], category: 'E-Commerce' },
    { id: 'ecom-shopify', title: 'Shopify Store Setup', description: 'Complete Shopify setup for dropshipping or inventory stores.', price: '₹9,999', imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80', features: ['Theme Customization', 'App Integrations', 'Payment Setup'], category: 'E-Commerce' },
    { id: 'ecom-woo', title: 'WooCommerce Store', description: 'Self-hosted customizable ecommerce on WordPress.', price: '₹14,999', imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80', features: ['No Monthly Fees', 'Custom Checkout', 'Shipping Setup'], category: 'E-Commerce' },
    { id: 'ecom-custom', title: 'Custom E-Commerce', description: 'Built from scratch tailored online shopping experiences.', price: '₹39,999', imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80', features: ['MERN Stack', 'Ultimate Speed', 'Custom Logic'], category: 'E-Commerce' },

    // ═══════════════════════════════════════════
    // 7️⃣ DIGITAL MARKETING & SEO
    // ═══════════════════════════════════════════
    { id: 'mkt-gmb', title: 'Google Business Profile', description: 'Local SEO setup and Google Maps ranking optimization.', price: '₹1,999', imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&q=80', features: ['Profile Creation', 'Review Strategy', 'Local Citations'], category: 'Digital Marketing' },
    { id: 'mkt-seo', title: 'Complete SEO Setup', description: 'On-page and technical SEO to rank your site on Google.', price: '₹4,999', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', features: ['Keyword Research', 'Meta Tags', 'Speed Optimization'], category: 'Digital Marketing' },
    { id: 'mkt-google-ads', title: 'Google Ads Management', description: 'Setup and manage Google Ads campaigns for leads and sales.', price: '₹4,999/mo', imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80', features: ['Campaign Setup', 'Keyword Bidding', 'Monthly Reports'], category: 'Digital Marketing' },
    { id: 'mkt-fb-ads', title: 'Facebook/Instagram Ads', description: 'Social media advertising for brand awareness and conversions.', price: '₹3,999/mo', imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=600&q=80', features: ['Ad Creatives', 'Audience Targeting', 'Performance Report'], category: 'Digital Marketing' },
    { id: 'mkt-whatsapp', title: 'WhatsApp Business Setup', description: 'Professional WhatsApp Business setup with catalog and auto-replies.', price: '₹999', imageUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600&q=80', features: ['Business Profile', 'Auto Replies', 'Product Catalog'], category: 'Digital Marketing' },
    { id: 'mkt-email', title: 'Business Email Setup', description: 'Professional email (name@yourbusiness.com) setup with Google Workspace.', price: '₹1,499', imageUrl: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=600&q=80', features: ['Custom Domain Email', 'Google Workspace', '30GB Storage'], category: 'Digital Marketing' },

    // ═══════════════════════════════════════════
    // 8️⃣ AI & AUTOMATION
    // ═══════════════════════════════════════════
    { id: 'ai-train', title: 'AI Productivity Course', description: 'Training for teams and individuals to harness AI for daily tasks.', price: '₹2,999', imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80', features: ['Prompt Engineering', 'Workflow Hacks', 'Live Demo'], category: 'AI & Automation' },
    { id: 'ai-bot', title: 'Website AI Chatbot', description: 'Custom trained ChatGPT bot on your website data to handle leads.', price: '₹9,999', imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80', features: ['Custom Knowledge', 'Lead Capture', '24/7 Support'], category: 'AI & Automation' },
    { id: 'ai-whatsapp', title: 'WhatsApp AI Bot', description: 'Automate WhatsApp conversations with AI precision.', price: '₹14,999', imageUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600&q=80', features: ['API Integration', 'Flow Builder', 'Broadcasts'], category: 'AI & Automation' },

    // ═══════════════════════════════════════════
    // 9️⃣ SCHOOL & EDTECH
    // ═══════════════════════════════════════════
    { id: 'edu-magazine', title: 'School Magazine Design', description: 'Beautiful annual school magazine with professional layout.', price: '₹7,999', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80', features: ['Multipage Layout', 'Photo Integration', 'Print Ready'], category: 'School & EdTech' },
    { id: 'edu-website', title: 'School Website', description: 'Professional modern website for educational institutions.', price: '₹14,999', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80', features: ['Notice Boards', 'Gallery', 'Inquiry Forms'], category: 'School & EdTech' },
    { id: 'edu-lms', title: 'LMS Setup', description: 'Learning Management System for selling online courses.', price: '₹24,999', imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&q=80', features: ['Video Hosting', 'Quizzes', 'Certificates'], category: 'School & EdTech' },
    { id: 'edu-portal', title: 'Online Exam Portal', description: 'Secure CBT environment matching JEE/NEET exam UI.', price: '₹34,999', imageUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&q=80', features: ['Anti-cheat', 'Result Analytics', 'Timer System'], category: 'School & EdTech' },
    { id: 'edu-erp', title: 'Complete School ERP', description: 'End-to-end school management — Attendance, Fee, Exams.', price: '₹49,999', imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80', features: ['Parent/Teacher DB', 'Fee Tracking', 'Report Cards'], category: 'School & EdTech' },

    // ═══════════════════════════════════════════
    // 🔟 DATA ENTRY & DOCUMENTATION
    // ═══════════════════════════════════════════
    { id: 'data-typing', title: 'Data Entry / Typing Work', description: 'Fast, accurate data entry, typing, and digitization services.', price: '₹299/page', imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80', features: ['99% Accuracy', 'Fast Turnaround', 'PDF/Excel'], category: 'Data Entry & Docs' },
    { id: 'data-ppt', title: 'PowerPoint Presentation', description: 'Professional PPT/Google Slides for business, college, or events.', price: '₹999', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80', features: ['Modern Templates', 'Animations', 'Up to 20 Slides'], category: 'Data Entry & Docs' },
    { id: 'data-excel', title: 'Excel/Sheets Automation', description: 'Custom Excel formulas, dashboards, and Google Sheets automation.', price: '₹1,499', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', features: ['Macros & Formulas', 'Dashboard', 'Data Cleanup'], category: 'Data Entry & Docs' },
    { id: 'data-form', title: 'Google Form / Survey', description: 'Custom Google Forms for registrations, surveys, and feedback.', price: '₹499', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80', features: ['Conditional Logic', 'Custom Theme', 'Response Sheet'], category: 'Data Entry & Docs' },

    // ═══════════════════════════════════════════
    // 1️⃣1️⃣ SOFTWARE & SYSTEMS
    // ═══════════════════════════════════════════
    { id: 'sys-billing', title: 'Billing / Invoice Software', description: 'GST-ready billing software for shops and small businesses.', price: '₹9,999', imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80', features: ['GST Invoices', 'Inventory', 'Customer Records'], category: 'Software & Systems' },
    { id: 'sys-crm', title: 'CRM Development', description: 'Custom Customer Relationship Management systems.', price: '₹39,999', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', features: ['Lead Tracking', 'Sales Funnels', 'Staff Roles'], category: 'Software & Systems' },
    { id: 'sys-erp', title: 'ERP Development', description: 'Enterprise Resource Planning tools tailored to your operations.', price: '₹69,999', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', features: ['Inventory', 'HR Module', 'Finance Module'], category: 'Software & Systems' },
    { id: 'sys-saas', title: 'SaaS MVP Development', description: 'Get your Software-as-a-Service idea built and launched fast.', price: '₹99,999', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80', features: ['Multitenant', 'Stripe/Razorpay Billing', 'User Dashboard'], category: 'Software & Systems' },

    // ═══════════════════════════════════════════
    // 1️⃣2️⃣ CONSULTING & TRAINING
    // ═══════════════════════════════════════════
    { id: 'consult-digital', title: 'Digital Consultation (1hr)', description: 'One-on-one consultation for your digital business needs.', price: '₹499', imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80', features: ['Video Call', 'Action Plan', 'Follow-up Notes'], category: 'Consulting & Training' },
    { id: 'consult-tech', title: 'Tech Stack Consulting', description: 'Expert advice on choosing the right tech for your scale.', price: '₹2,999', imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80', features: ['Architecture Plan', 'Cost Analysis', 'Scalability'], category: 'Consulting & Training' },
    { id: 'consult-mvp', title: 'MVP Planning', description: 'Transform your abstract idea into a concrete software roadmap.', price: '₹7,999', imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80', features: ['Wireframes', 'Feature Priority', 'Timeline'], category: 'Consulting & Training' },
    { id: 'train-computer', title: 'Basic Computer Training', description: 'MS Office, Email, Internet basics for beginners and staff.', price: '₹1,999', imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80', features: ['MS Word/Excel/PPT', 'Email & Internet', 'Certificate'], category: 'Consulting & Training' },

    // ═══════════════════════════════════════════
    // 1️⃣3️⃣ MAINTENANCE & HOSTING
    // ═══════════════════════════════════════════
    { id: 'host-domain', title: 'Domain + Hosting Setup', description: 'Domain registration and web hosting setup with SSL.', price: '₹1,999/yr', imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80', features: ['Free SSL', '10GB Storage', 'Email IDs'], category: 'Hosting & Maintenance' },
    { id: 'maint-web', title: 'Website Maintenance', description: 'Monthly retainer for hosting, security, and minor updates.', price: '₹1,999/mo', imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80', features: ['Daily Backups', 'Uptime Monitor', 'Security Scan'], category: 'Hosting & Maintenance' },

    // ═══════════════════════════════════════════
    // 1️⃣4️⃣ DIGITAL PRODUCTS
    // ═══════════════════════════════════════════
    { id: 'prod-prompts', title: 'AI Prompt Packs', description: 'Curated 1000+ ChatGPT prompts for marketing and workflows.', price: '₹299', imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80', features: ['Tested Prompts', 'Marketing Focus', 'Copy-paste'], category: 'Digital Products' },
    { id: 'prod-canva', title: 'Canva Templates Pack', description: 'Editable branded Canva templates for your social media.', price: '₹499', imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80', features: ['50+ Designs', 'Drag & Drop', 'All Formats'], category: 'Digital Products' },
    { id: 'prod-notion', title: 'Notion Templates', description: 'Ready-to-use Notion workspace templates for teams and students.', price: '₹399', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80', features: ['Project Tracker', 'CRM Template', 'Student Planner'], category: 'Digital Products' },

    // ═══════════════════════════════════════════
    // 1️⃣5️⃣ COMBO PACKAGES
    // ═══════════════════════════════════════════
    { id: 'combo-small-biz', title: 'Small Business Starter', description: 'Logo + Visiting Card + Social Media Setup — perfect for new shops.', price: '₹2,999', imageUrl: 'https://images.unsplash.com/photo-1559136555-9ce7b5fda2d6?w=600&q=80', features: ['Logo Design', 'Visiting Card', 'Social Pages Setup'], category: 'Combo Packages' },
    { id: 'combo-startup', title: 'Complete Startup Digital Kit', description: 'Logo + Website + Social Media + SEO — all in one package.', price: '₹24,999', imageUrl: 'https://images.unsplash.com/photo-1559136555-9ce7b5fda2d6?w=600&q=80', features: ['Brand Identity', '5 Page Website', 'SEO Setup'], category: 'Combo Packages' },
    { id: 'combo-school', title: 'Complete School Transformation', description: 'ERP + Website + App + Admission Campaigns setup.', price: '₹99,999', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80', features: ['Software Suite', 'Staff Training', 'Cloud Hosting'], category: 'Combo Packages' },
    { id: 'combo-restaurant', title: 'Restaurant Digital Kit', description: 'Menu Design + QR Menu + Google Business + Social Media.', price: '₹4,999', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80', features: ['QR Menu', 'Google Business', 'Social Pages'], category: 'Combo Packages' },

    // ═══════════════════════════════════════════
    // BUDGET MICRO-SERVICES (₹49 - ₹999)
    // ═══════════════════════════════════════════
    { id: 'micro-sticker', title: 'WhatsApp Sticker Pack', description: 'Custom WhatsApp sticker pack for your brand or personal use.', price: '₹149', imageUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&q=80', features: ['30 Custom Stickers', 'Brand Colors', 'Animated Option'], category: 'Budget Services' },
    { id: 'micro-biolink', title: 'Bio Link Page', description: 'Custom link-in-bio page for Instagram, YouTube, and WhatsApp.', price: '₹299', imageUrl: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=600&q=80', features: ['Custom Domain', 'Analytics', 'Social Links'], category: 'Budget Services' },
    { id: 'micro-watermark', title: 'Watermark / Stamp Design', description: 'Professional watermark or rubber stamp design for your business.', price: '₹199', imageUrl: 'https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=600&q=80', features: ['Transparent PNG', 'Multiple Styles', 'Quick Delivery'], category: 'Budget Services' },
    { id: 'micro-label', title: 'Product Label / Sticker', description: 'Eye-catching product labels for packaging, jars, bottles.', price: '₹399', imageUrl: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&q=80', features: ['Die-cut Ready', 'Print File', 'Barcode Integration'], category: 'Budget Services' },
    { id: 'micro-wedding-album', title: 'Digital Wedding Album', description: 'Beautifully designed digital photo album for weddings.', price: '₹999', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', features: ['20 Pages', 'Premium Layout', 'Print Ready'], category: 'Budget Services' },
    { id: 'micro-newspaper', title: 'Newspaper Ad Design', description: 'Print-ready newspaper advertisement design for classifieds.', price: '₹499', imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=600&q=80', features: ['CMYK Ready', 'Any Size', 'Quick Turnaround'], category: 'Budget Services' },
    { id: 'micro-qr', title: 'Custom QR Code Design', description: 'Branded QR codes with your logo for payments, menus, links.', price: '₹199', imageUrl: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=600&q=80', features: ['Logo Embedded', 'Custom Colors', 'UPI/Link/Menu'], category: 'Budget Services' },
    { id: 'micro-billbook', title: 'Bill Book / Receipt Design', description: 'Professional GST bill book and cash memo designs.', price: '₹599', imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80', features: ['GST Format', 'Print Ready', 'Duplicate Copy'], category: 'Budget Services' },
    { id: 'micro-ebook', title: 'E-book Formatting', description: 'Format your manuscript into Kindle, PDF, or ePub e-book.', price: '₹999', imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80', features: ['Kindle Ready', 'Cover Design', 'Table of Contents'], category: 'Budget Services' },
    { id: 'micro-mockup', title: 'App UI Mockup', description: 'Mobile app screen mockups to pitch your idea to investors.', price: '₹999', imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80', features: ['5 Screens', 'Figma File', 'Presentation Ready'], category: 'Budget Services' },
    { id: 'micro-animated-logo', title: 'Animated Logo Intro', description: 'Short animated logo reveal for your YouTube/Instagram videos.', price: '₹499', imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80', features: ['3-5 Sec Animation', 'Sound Effect', 'MP4 & GIF'], category: 'Budget Services' },
    { id: 'micro-voiceover', title: 'Hindi/English Voice Over', description: 'Professional voice over for ads, explainer videos, IVR.', price: '₹499', imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&q=80', features: ['Male/Female', 'Up to 1 Min', 'Background Music'], category: 'Budget Services' },
];

export const ServiceProvider = ({ children }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const seeding = useRef(false);

    // ─── Seed Firestore (version-controlled) ───
    const seedServices = async () => {
        if (seeding.current) return;
        seeding.current = true;

        try {
            // Check current seed version
            const versionDoc = await getDoc(doc(db, 'settings', 'seed_version'));
            const currentVersion = versionDoc.exists() ? versionDoc.data().services || 0 : 0;

            if (currentVersion >= SEED_VERSION) {
                seeding.current = false;
                return;
            }

            // Delete all existing services
            const existing = await getDocs(collection(db, 'services'));
            const deleteBatch = writeBatch(db);
            existing.forEach(d => deleteBatch.delete(d.ref));
            await deleteBatch.commit();

            // Seed new services in batches of 500 (Firestore limit)
            for (let i = 0; i < seedData.length; i += 450) {
                const batch = writeBatch(db);
                const chunk = seedData.slice(i, i + 450);
                chunk.forEach(service => {
                    const { id, ...data } = service;
                    const ref = doc(db, 'services', id);
                    batch.set(ref, { ...data, createdAt: serverTimestamp() });
                });
                await batch.commit();
            }

            // Update seed version
            await setDoc(doc(db, 'settings', 'seed_version'), { services: SEED_VERSION }, { merge: true });
            console.log('✅ Services seeded to Firestore (v' + SEED_VERSION + ')');
        } catch (err) {
            console.error('❌ Failed to seed services:', err);
        }
        seeding.current = false;
    };

    // ─── Realtime Listener ───
    useEffect(() => {
        // Trigger seed check on mount
        seedServices();

        const unsubscribe = onSnapshot(collection(db, 'services'), (snapshot) => {
            const data = [];
            snapshot.forEach(d => data.push({ id: d.id, ...d.data() }));
            setServices(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // ─── CRUD Operations ───
    const addService = async (newService) => {
        await addDoc(collection(db, 'services'), { ...newService, createdAt: serverTimestamp() });
    };

    const updateService = async (id, updatedService) => {
        await updateDoc(doc(db, 'services', id), updatedService);
    };

    const deleteService = async (id) => {
        await deleteDoc(doc(db, 'services', id));
    };

    const value = {
        services,
        loading,
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
