import type { FAQItem } from "@/components/FAQAccordion";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://meandrobo.com.qa";

export interface SolutionData {
    slug: string;
    metadata: Metadata;
    hero: { title: string; subtitle: string };
    directAnswer: string;
    whatItIs: { title: string; description: string };
    howItWorks: { number: number; title: string; description: string }[];
    capabilities: { icon: string; title: string; description: string }[];
    outcomes: { metric: string; label: string }[];
    useCases: { industry: string; description: string }[];
    implementation: string;
    faqs: FAQItem[];
    relatedSolutions: { title: string; href: string }[];
}

function meta(title: string, description: string, slug: string): Metadata {
    return {
        title,
        description,
        alternates: { canonical: `${SITE_URL}/${slug}` },
        openGraph: {
            title,
            description,
            url: `${SITE_URL}/${slug}`,
            siteName: "MeandRobo",
            type: "website",
        },
        twitter: { card: "summary_large_image", title, description },
    };
}

export const solutions: Record<string, SolutionData> = {
    "erp-pfp-qatar": {
        slug: "erp-pfp-qatar",
        metadata: meta(
            "AI ERP Solutions for Qatar SMEs",
            "Next-gen AI ERP solutions for Qatar startups. Track inventory, sales, purchasing, and finance in one AI-powered platform.",
            "erp-pfp-qatar"
        ),
        hero: {
            title: "AI ERP Solutions for Qatar Businesses",
            subtitle:
                "Manage your inventory, sales, purchasing, expenses, and invoicing in a single AI-powered platform built for Qatar SMEs.",
        },
        directAnswer:
            "MeandRobo's AI ERP Solutions automate business operations, designed specifically for SMEs in Qatar. It automates invoicing, expense tracking, inventory management, and financial reporting — all in one AI-driven dashboard. Available with on-site setup in Doha and remote support.",
        whatItIs: {
            title: "What is AI ERP?",
            description:
                "A unified AI-driven operational platform that merges inventory, sales, purchasing, expenses, and invoicing. Our AI-powered insights help you automate finance and make smarter decisions faster to accelerate growth.",
        },
        howItWorks: [
            { number: 1, title: "Discovery", description: "We assess your current tools, workflows, and financial structure during an on-site visit in Qatar." },
            { number: 2, title: "Configuration", description: "We configure the ERP modules for your industry — invoicing, inventory, payroll, expenses — plus set up your PFP dashboard." },
            { number: 3, title: "Training", description: "Hands-on training for your team at your Qatar office. We ensure everyone is confident before go-live." },
            { number: 4, title: "Go Live & Optimize", description: "Launch with real-time monitoring. Our AI surfaces insights and optimization recommendations as your data grows." },
        ],
        capabilities: [
            { icon: "📊", title: "Smart Invoicing", description: "Auto-generate invoices, track payments, send reminders — all localized for Qatar VAT compliance." },
            { icon: "📦", title: "Inventory Management", description: "Real-time stock tracking, reorder alerts, and supplier management for retail and F&B businesses." },
            { icon: "💰", title: "PFP Dashboard", description: "Track personal net worth, investments, and liabilities alongside your business P&L." },
            { icon: "🤖", title: "AI Insights", description: "Machine learning analyzes your financial patterns and provides actionable growth recommendations." },
            { icon: "📱", title: "Mobile Access", description: "Full dashboard available on phone and tablet — manage your business from anywhere in Qatar." },
            { icon: "🔒", title: "Qatar Data Residency", description: "Your data stays in compliant cloud infrastructure with enterprise-grade security." },
        ],
        outcomes: [
            { metric: "70%", label: "Faster invoicing" },
            { metric: "3x", label: "Better cash flow visibility" },
            { metric: "50%", label: "Less manual data entry" },
            { metric: "24/7", label: "Financial oversight" },
        ],
        useCases: [
            { industry: "Restaurant", description: "Track food costs, manage supplier invoices, monitor daily revenue and personal earnings in one view." },
            { industry: "Coffee Shop", description: "Inventory management for beans and supplies, automated supplier ordering, and owner profit tracking." },
            { industry: "Salon", description: "Service-based invoicing, staff payroll, product inventory, and personal income tracking for salon owners." },
            { industry: "Rent-a-Car", description: "Fleet cost tracking, rental invoicing, maintenance scheduling, and owner financial planning." },
        ],
        implementation:
            "Our team visits your Qatar location for a 2-day discovery and setup process. We configure everything on-site, train your staff in person, and provide 90 days of remote support after go-live. Ongoing optimization is available through monthly AI-powered reports.",
        faqs: [
            { question: "Is the ERP system customizable for my industry?", answer: "Yes. We configure modules specifically for your industry — whether you run a restaurant, salon, rent-a-car business, or any other SME in Qatar." },
            { question: "Can I track personal and business finances separately?", answer: "Absolutely. The PFP module keeps your personal wealth tracking completely separate from business operations while giving you a unified overview." },
            { question: "Do you provide on-site setup in Qatar?", answer: "Yes, our team comes to your location in Doha (or anywhere in Qatar) for discovery, configuration, and training." },
            { question: "What happens to my existing data?", answer: "We help migrate your existing financial data from spreadsheets or legacy systems into the new ERP during the setup process." },
            { question: "Is training included?", answer: "Yes, hands-on training for your team is included in every implementation. We don't leave until your team is confident." },
            { question: "How does the AI provide insights?", answer: "The AI analyzes your revenue patterns, expense trends, and cash flow data to surface recommendations like optimizing inventory levels or identifying late-paying clients." },
            { question: "Is the system mobile-friendly?", answer: "Fully responsive. Access your complete ERP and PFP dashboard from any phone, tablet, or desktop." },
            { question: "What about data security?", answer: "Enterprise-grade encryption, role-based access control, and compliant cloud infrastructure ensure your financial data is always protected." },
            { question: "Can I integrate with my bank?", answer: "We support integration with major banks and payment gateways used in Qatar for automatic transaction reconciliation." },
            { question: "What ongoing support do you provide?", answer: "90 days of included remote support post-launch, plus optional monthly optimization reports powered by AI analysis." },
        ],
        relatedSolutions: [
            { title: "AI Customer Agent", href: "/ai-customer-agent-qatar" },
            { title: "AI Call Center Agent", href: "/ai-call-center-agent-qatar" },
            { title: "AI Creative Studio", href: "/ai-creative-studio-qatar" },
            { title: "AI Website Chatbot", href: "/ai-website-chatbot-qatar" },
        ],
    },
    "ai-customer-agent-qatar": {
        slug: "ai-customer-agent-qatar",
        metadata: meta(
            "AI Customer Agent in Qatar",
            "Automate 85% of customer inquiries with MeandRobo's AI agent. WhatsApp, social DMs, and website chat — 24/7 in Arabic and English.",
            "ai-customer-agent-qatar"
        ),
        hero: {
            title: "AI Customer Agent for Qatar Businesses",
            subtitle:
                "Automate 85% of customer inquiries across WhatsApp, Instagram DMs, and your website — 24/7 in Arabic and English.",
        },
        directAnswer:
            "MeandRobo's AI Customer Agent handles customer conversations across WhatsApp, social media DMs, and website chat — 24/7 in both Arabic and English. It integrates with your CRM, responds instantly, and escalates complex issues to human agents. Designed for Qatar SMEs with on-site deployment available in Doha.",
        whatItIs: {
            title: "What is the AI Customer Agent?",
            description:
                "An intelligent conversational AI that manages customer inquiries across all your digital channels — WhatsApp, Instagram, Facebook Messenger, and website chat. It understands context, speaks your brand's language, and hands off to humans when needed.",
        },
        howItWorks: [
            { number: 1, title: "Channel Setup", description: "We connect the AI agent to your WhatsApp Business, social media accounts, and website chat widget." },
            { number: 2, title: "Knowledge Import", description: "We train the agent on your products, services, FAQs, and brand voice using your existing content." },
            { number: 3, title: "CRM Integration", description: "Connect with your CRM to pull customer data, log conversations, and create tickets automatically." },
            { number: 4, title: "Launch & Learn", description: "Go live with human oversight. The AI improves with every conversation, handling more queries autonomously over time." },
        ],
        capabilities: [
            { icon: "🌐", title: "Multi-Channel", description: "One AI agent across WhatsApp, Instagram, Facebook, website chat, and email." },
            { icon: "🗣️", title: "Bilingual", description: "Fluent in Arabic and English with automatic language detection and response." },
            { icon: "🧠", title: "Intent Recognition", description: "Understands customer intent, sentiment, and urgency to route conversations appropriately." },
            { icon: "🔗", title: "CRM Integration", description: "Native integration with popular CRMs — auto-log conversations, create leads, update tickets." },
            { icon: "👤", title: "Human Handoff", description: "Seamless escalation to human agents for complex issues with full conversation context." },
            { icon: "📈", title: "Analytics Dashboard", description: "Track response times, resolution rates, customer satisfaction, and agent performance." },
        ],
        outcomes: [
            { metric: "85%", label: "Queries automated" },
            { metric: "<3s", label: "Average response time" },
            { metric: "60%", label: "Cost reduction" },
            { metric: "24/7", label: "Availability" },
        ],
        useCases: [
            { industry: "Restaurant", description: "Handle reservation queries, menu questions, delivery status, and complaint resolution across WhatsApp and Instagram." },
            { industry: "Coffee Shop", description: "Answer loyalty program questions, process pre-orders via chat, and manage catering inquiries automatically." },
            { industry: "Salon", description: "Book appointments, answer pricing queries, send appointment reminders, and manage rescheduling via WhatsApp." },
            { industry: "Rent-a-Car", description: "Process booking inquiries, answer availability questions, handle pickup/dropoff coordination, and manage customer feedback." },
        ],
        implementation:
            "We deploy the AI Customer Agent in 5–7 business days. Starting with an on-site assessment at your Qatar location, we configure channels, import your knowledge base, and run a supervised pilot before full launch. Your team gets training on the dashboard and escalation workflows.",
        faqs: [
            { question: "Which messaging platforms are supported?", answer: "WhatsApp Business, Instagram DMs, Facebook Messenger, website chat widget, and email. We can add custom channels on request." },
            { question: "Does it support Arabic?", answer: "Yes, fully. The AI detects language automatically and responds in Arabic or English based on the customer's preference." },
            { question: "What happens when the AI can't answer a question?", answer: "It seamlessly hands off to a human agent with full conversation context, so the customer never has to repeat themselves." },
            { question: "Can it be trained on my specific products?", answer: "Yes. We import your product catalog, FAQs, and service details to create a custom knowledge base for your AI agent." },
            { question: "How quickly can it be deployed?", answer: "Typically 5–7 business days from kickoff to live deployment, including on-site setup in Qatar." },
            { question: "Does it integrate with my existing CRM?", answer: "Yes, we support integration with popular CRMs and can build custom integrations for your specific tools." },
            { question: "Will customers know they're talking to AI?", answer: "The AI identifies itself as a virtual assistant but communicates in your brand's voice. Customers can always request a human agent." },
            { question: "How does it improve over time?", answer: "The AI learns from every conversation, expanding its knowledge base and improving response accuracy continuously." },
            { question: "Is there a limit to conversations?", answer: "No hard limit. The AI scales to handle thousands of simultaneous conversations without degradation." },
            { question: "What about data privacy?", answer: "All conversations are encrypted, stored securely, and comply with Qatar's data protection requirements." },
        ],
        relatedSolutions: [
            { title: "AI Call Center Agent", href: "/ai-call-center-agent-qatar" },
            { title: "AI Website Chatbot", href: "/ai-website-chatbot-qatar" },
            { title: "AI ERP Solutions", href: "/erp-pfp-qatar" },
            { title: "AI Creative Studio", href: "/ai-creative-studio-qatar" },
        ],
    },
    "ai-call-center-agent-qatar": {
        slug: "ai-call-center-agent-qatar",
        metadata: meta(
            "AI Call Center Agent in Qatar",
            "AI-powered virtual receptionist for Qatar businesses. Handle calls 24/7 in Arabic and English with intelligent routing.",
            "ai-call-center-agent-qatar"
        ),
        hero: {
            title: "AI Call Center Agent for Qatar Businesses",
            subtitle:
                "A virtual receptionist that answers calls 24/7 in Arabic and English, routes intelligently, and never puts customers on hold.",
        },
        directAnswer:
            "MeandRobo's AI Call Center Agent is a voice AI that answers your business phone calls around the clock in Arabic and English. It handles common inquiries, books appointments, routes calls to the right department, and provides caller information to your team. Ideal for Qatar SMEs that need professional call handling without a full call center.",
        whatItIs: {
            title: "What is the AI Call Center Agent?",
            description:
                "A voice-enabled AI agent that handles inbound phone calls — answering questions, booking appointments, routing calls, and collecting caller information. It sounds natural, understands context, and gives your business 24/7 phone coverage without hiring more staff.",
        },
        howItWorks: [
            { number: 1, title: "Phone Setup", description: "We configure the AI agent with your business phone number and call routing rules." },
            { number: 2, title: "Script & Voice", description: "Customize the AI's greeting, responses, and voice to match your brand identity." },
            { number: 3, title: "Integration", description: "Connect with your calendar, CRM, and team notification system for seamless workflow." },
            { number: 4, title: "Go Live", description: "Launch with call monitoring. Review transcripts, tune responses, and optimize call flows." },
        ],
        capabilities: [
            { icon: "📞", title: "24/7 Call Answering", description: "Never miss a call. The AI answers instantly, even during holidays and after hours." },
            { icon: "🗣️", title: "Natural Voice", description: "Human-like voice interaction in Arabic and English with natural conversation flow." },
            { icon: "📅", title: "Appointment Booking", description: "Book appointments directly into your calendar with availability checks and confirmations." },
            { icon: "🔀", title: "Smart Routing", description: "Route calls to the right department or team member based on caller needs and availability." },
            { icon: "📝", title: "Call Transcription", description: "Every call is transcribed and logged with caller details, intent, and follow-up actions." },
            { icon: "📊", title: "Call Analytics", description: "Track call volume, peak times, common inquiries, and resolution rates." },
        ],
        outcomes: [
            { metric: "0", label: "Missed calls" },
            { metric: "<2s", label: "Answer time" },
            { metric: "40%", label: "Staff time saved" },
            { metric: "24/7", label: "Coverage" },
        ],
        useCases: [
            { industry: "Restaurant", description: "Handle reservation calls, answer menu questions, manage takeout orders, and route VIP guest calls to managers." },
            { industry: "Coffee Shop", description: "Book catering orders, answer store hours and location questions, process bulk order inquiries by phone." },
            { industry: "Salon", description: "Book and reschedule appointments, answer service and pricing questions, send appointment reminders via call." },
            { industry: "Rent-a-Car", description: "Process rental inquiries, check vehicle availability, handle pickup/dropoff calls, and escalate insurance questions." },
        ],
        implementation:
            "Setup takes 3–5 business days. We configure your phone system on-site in Qatar, customize the AI voice and scripts, and integrate with your existing tools. Your team gets training on the monitoring dashboard and call management interface.",
        faqs: [
            { question: "Will callers know they're speaking to AI?", answer: "The AI identifies itself as a virtual assistant. Its natural voice and conversation ability mean most callers find the experience smooth and professional." },
            { question: "Can it handle Arabic phone calls?", answer: "Yes. Full Arabic voice support with dialect awareness for the Qatari market." },
            { question: "What if a caller needs a human agent?", answer: "The AI transfers the call to the appropriate team member with a summary of the conversation so far." },
            { question: "Can it book appointments?", answer: "Yes. It checks your calendar availability and books appointments in real-time, sending confirmations to both parties." },
            { question: "Does it work with my existing phone number?", answer: "Yes. We integrate with your current business phone number — no need to change it." },
            { question: "What about missed calls after hours?", answer: "There are no missed calls. The AI answers 24/7, including weekends and holidays." },
            { question: "Can I review call recordings?", answer: "Yes. Every call is recorded and transcribed. You can review them in the dashboard and use them for quality improvement." },
            { question: "How accurate is the voice recognition?", answer: "Our voice AI uses state-of-the-art speech recognition with over 95% accuracy in both Arabic and English." },
            { question: "Can it handle multiple calls simultaneously?", answer: "Yes. Unlike human receptionists, the AI can handle unlimited simultaneous calls without putting anyone on hold." },
            { question: "What ongoing support is included?", answer: "Monthly performance reviews, script optimization, and priority support for any issues." },
        ],
        relatedSolutions: [
            { title: "AI Customer Agent", href: "/ai-customer-agent-qatar" },
            { title: "AI Website Chatbot", href: "/ai-website-chatbot-qatar" },
            { title: "AI ERP Solutions", href: "/erp-pfp-qatar" },
            { title: "AI Creative Studio", href: "/ai-creative-studio-qatar" },
        ],
    },
    "ai-creative-studio-qatar": {
        slug: "ai-creative-studio-qatar",
        metadata: meta(
            "AI Creative Studio in Qatar",
            "Generate professional ad creatives, social media visuals, and video content with AI — tailored for Qatar's market.",
            "ai-creative-studio-qatar"
        ),
        hero: {
            title: "AI Creative Studio for Qatar Businesses",
            subtitle:
                "Generate professional ad creatives, social media content, and marketing visuals in seconds — no design team required.",
        },
        directAnswer:
            "MeandRobo's AI Creative Studio generates professional marketing visuals, social media posts, ad creatives, and short video content using AI — customized for Qatar businesses. It understands your brand guidelines, creates content in Arabic and English, and reduces creative production time from days to minutes. On-site setup available in Doha.",
        whatItIs: {
            title: "What is the AI Creative Studio?",
            description:
                "An AI-powered creative platform that generates marketing materials — social media graphics, ad banners, product photos, short videos, and brand content. Feed it your brand guidelines and it produces on-brand visuals instantly, in both Arabic and English.",
        },
        howItWorks: [
            { number: 1, title: "Brand Import", description: "We upload your logo, brand colors, fonts, tone of voice, and sample content to train the AI." },
            { number: 2, title: "Template Setup", description: "Create reusable templates for your most common content types — social posts, stories, ads, banners." },
            { number: 3, title: "Generate", description: "Describe what you need in plain language. The AI produces multiple creative options in seconds." },
            { number: 4, title: "Publish", description: "Edit, approve, and publish directly to your social channels or download for print/digital use." },
        ],
        capabilities: [
            { icon: "🎨", title: "Brand-Aware Generation", description: "Every creative matches your brand colors, fonts, logo placement, and visual style automatically." },
            { icon: "📱", title: "Multi-Format", description: "Generate for Instagram, Facebook, TikTok, LinkedIn, Google Ads, print — all from one prompt." },
            { icon: "🎬", title: "Video Content", description: "Create short promotional videos, animated posts, and story content with AI." },
            { icon: "🌐", title: "Arabic & English", description: "Generate content and copy in both Arabic and English with proper layout and typography." },
            { icon: "📸", title: "Product Photography", description: "AI-enhanced product shots with professional backgrounds, lighting, and staging." },
            { icon: "📅", title: "Content Calendar", description: "Plan and schedule your content calendar with AI-suggested posting times and themes." },
        ],
        outcomes: [
            { metric: "90%", label: "Faster creative production" },
            { metric: "10x", label: "More content variations" },
            { metric: "0", label: "Design staff needed" },
            { metric: "$$$", label: "Savings on agencies" },
        ],
        useCases: [
            { industry: "Restaurant", description: "Daily food photography, menu promotions, special event graphics, and Instagram story content." },
            { industry: "Coffee Shop", description: "Seasonal drink promotions, loyalty program graphics, ambiance shots, and social media stories." },
            { industry: "Salon", description: "Before/after styling visuals, service promotions, booking reminders, and trend-based content." },
            { industry: "Rent-a-Car", description: "Vehicle showcase images, seasonal rental promotions, fleet comparison graphics, and social ads." },
        ],
        implementation:
            "We set up the AI Creative Studio in 2–3 business days. This includes an on-site brand workshop at your Qatar location, template configuration, and team training on the platform. You start generating content immediately.",
        faqs: [
            { question: "Do I need design skills to use it?", answer: "No. Just describe what you want in plain language (Arabic or English) and the AI generates professional creatives for you." },
            { question: "Will the output match my brand?", answer: "Yes. We train the AI on your brand guidelines during setup, so every creative is on-brand automatically." },
            { question: "Can it create Arabic content?", answer: "Yes. Full Arabic support including right-to-left layouts, Arabic typography, and culturally appropriate visuals." },
            { question: "What formats are supported?", answer: "Social media posts, stories, ads, banners, flyers, product photos, short videos, and more. Multiple sizes and formats from one prompt." },
            { question: "Can I edit the AI-generated content?", answer: "Yes. You can edit, adjust, and refine any generated creative before publishing or downloading." },
            { question: "Does it replace a design agency?", answer: "For most SME marketing needs, yes. It handles daily content creation. For complex campaigns, you might still want agency support." },
            { question: "How many creatives can I generate?", answer: "Unlimited generations. Create as much content as your marketing calendar demands." },
            { question: "Can it create video content?", answer: "Yes. Short promotional videos, animated social posts, and story-format content with motion graphics." },
            { question: "Is there a content calendar feature?", answer: "Yes. Plan, schedule, and auto-post content across your connected social media channels." },
            { question: "What's the setup time?", answer: "2–3 business days including on-site brand workshop, platform configuration, and team training." },
        ],
        relatedSolutions: [
            { title: "AI Customer Agent", href: "/ai-customer-agent-qatar" },
            { title: "AI Website Chatbot", href: "/ai-website-chatbot-qatar" },
            { title: "AI Call Center Agent", href: "/ai-call-center-agent-qatar" },
            { title: "AI ERP Solutions", href: "/erp-pfp-qatar" },
        ],
    },
    "ai-website-chatbot-qatar": {
        slug: "ai-website-chatbot-qatar",
        metadata: meta(
            "AI Website Chatbot in Qatar",
            "Turn your website traffic into qualified leads with MeandRobo's AI chatbot. Smart conversations, instant answers, seamless handoff, and lead qualification.",
            "ai-website-chatbot-qatar"
        ),
        hero: {
            title: "AI Website Chatbot for Qatar Businesses",
            subtitle:
                "Transform your current website into a lead-generation machine with an AI chatbot that qualifies visitors, answers questions, and books meetings — 24/7.",
        },
        directAnswer:
            "MeandRobo's AI Website Chatbot solution integrates a smart chat widget into your existing website to convert visitors into qualified leads. The chatbot answers questions using your knowledge base, qualifies prospects, routes leads to your CRM, and books meetings — all in Arabic and English, 24/7. Built specifically for Qatar SMEs.",
        whatItIs: {
            title: "What is the AI Website Chatbot?",
            description:
                "An intelligent chat widget that seamlessly integrates onto your existing website. The chatbot proactively engages visitors the moment they land on your site, answers their questions using your knowledge base, qualifies them as leads, and books meetings — escalating to human agents via WhatsApp or email when needed.",
        },
        howItWorks: [
            { number: 1, title: "Chatbot Training", description: "We train the AI on your products, services, FAQs, pricing, and qualification criteria." },
            { number: 2, title: "Website Integration", description: "We deploy the smart chatbot widget seamlessly onto your existing website." },
            { number: 3, title: "CRM & Escaplation", description: "Connect with your CRM to push leads automatically and configure WhatsApp/email escalation for human support." },
            { number: 4, title: "Optimize", description: "Review chat transcripts, adjust conversation flows, and refine qualification criteria based on real analytics." },
        ],
        capabilities: [
            { icon: "💬", title: "Smart Chat Widget", description: "An unobtrusive chat widget that proactively engages visitors based on their behavior and page context." },
            { icon: "🎯", title: "Lead Qualification", description: "Ask qualifying questions, score leads, and route hot prospects to your sales team instantly." },
            { icon: "📅", title: "Meeting Booking", description: "Book meetings directly in the chat — syncs with your calendar for real-time availability." },
            { icon: "🧠", title: "Knowledge Base AI", description: "Answers questions from your product docs, FAQs, and pricing — no scripted responses." },
            { icon: "📊", title: "Visitor Analytics", description: "Track visitor behavior, chat engagement, conversion rates, and drop-off points." },
            { icon: "🔗", title: "CRM Sync", description: "Automatically create leads in your CRM with chat transcripts, qualification data, and visitor info." },
        ],
        outcomes: [
            { metric: "3x", label: "More leads captured" },
            { metric: "40%", label: "Higher conversion rate" },
            { metric: "<5s", label: "Visitor engagement time" },
            { metric: "24/7", label: "Lead capture active" },
        ],
        useCases: [
            { industry: "Restaurant", description: "Chatbot handles reservation requests, catering inquiries, and menu questions directly on your restaurant website." },
            { industry: "Coffee Shop", description: "Capture wholesale and catering leads, answer franchise inquiries, and promote loyalty programs via chat." },
            { industry: "Salon", description: "Book appointments through chat, recommend services based on customer needs, and capture new client information." },
            { industry: "Rent-a-Car", description: "Qualify rental leads, check vehicle availability, process booking requests, and upsell insurance through chat." },
        ],
        implementation:
            "Deployment takes 5–7 business days. We train the chatbot, seamlessly integrate it into your existing website, connect it with your CRM, and launch with a supervised pilot. Continuous optimization ensures your conversion rates keep improving.",
        faqs: [
            { question: "Does the chatbot work on my existing website?", answer: "Yes. We integrate the chatbot as a widget on your current website — no need to rebuild anything." },
            { question: "Can it qualify leads automatically?", answer: "Yes. The chatbot asks qualifying questions you define and scores leads based on their answers, routing hot leads to your team." },
            { question: "Does it support Arabic?", answer: "Yes. Full bilingual support in Arabic and English with automatic language detection." },
            { question: "Can visitors book meetings through the chat?", answer: "Yes. The chatbot connects to your calendar and lets visitors book meetings with real-time availability checks." },
            { question: "How does it know about my products?", answer: "We train the AI on your product catalog, FAQs, pricing, and any other content you provide. It learns and improves over time." },
            { question: "Will it annoy visitors with pop-ups?", answer: "No. The chat widget is non-intrusive and engages based on visitor behavior — like time on page or scroll depth — not random pop-ups." },
            { question: "Can I see chat transcripts?", answer: "Yes. Every conversation is logged with visitor details, qualification data, and assigned lead score." },
            { question: "Does it integrate with my CRM?", answer: "Yes. We support integration with popular CRMs and can build custom integrations for your specific setup." },
            { question: "What if the chatbot can't answer something?", answer: "It offers to connect the visitor with a human agent or captures their contact info for a follow-up call." },
            { question: "How quickly can it be deployed?", answer: "5–7 business days from kickoff to live deployment, including on-site setup and training in Qatar." },
        ],
        relatedSolutions: [
            { title: "AI Customer Agent", href: "/ai-customer-agent-qatar" },
            { title: "AI Call Center Agent", href: "/ai-call-center-agent-qatar" },
            { title: "AI Creative Studio", href: "/ai-creative-studio-qatar" },
            { title: "AI ERP Solutions", href: "/erp-pfp-qatar" },
        ],
    },
    "ai-social-media-manager-qatar": {
        slug: "ai-social-media-manager-qatar",
        metadata: meta(
            "AI Social Media Manager",
            "Content calendar, captions, hashtags, and scheduled posting.",
            "ai-social-media-manager-qatar"
        ),
        hero: {
            title: "AI Social Media Manager",
            subtitle: "Content calendar • captions • hashtags • scheduled posting • brand consistency",
        },
        directAnswer: "AI Social Media Manager creates content calendars, writes captions with hashtags, and automates posting across all your platforms to ensure brand consistency and engagement.",
        whatItIs: { title: "What is the AI Social Media Manager?", description: "An automated assistant that handles your daily content generation and scheduling." },
        howItWorks: [
            { number: 1, title: "Configuration", description: "Set your brand voice and platform preferences." },
            { number: 2, title: "Generation", description: "AI drafts captions and suggests hashtags." },
            { number: 3, title: "Review", description: "Approve the generated weekly calendar." },
            { number: 4, title: "Automation", description: "Posts are published automatically at peak audience times." },
        ],
        capabilities: [
            { icon: "📅", title: "Content Calendar", description: "Plan weeks in advance." },
            { icon: "✍️", title: "Smart Captions", description: "Engaging, SEO-optimized copy." },
            { icon: "hashtags", title: "Trending Hashtags", description: "Maximize discoverability." },
            { icon: "🌐", title: "Multilingual", description: "Arabic and English support." },
        ],
        outcomes: [
            { metric: "10x", label: "Faster content creation" },
            { metric: "100%", label: "Consistency" },
        ],
        useCases: [
            { industry: "Retail", description: "Daily product highlights and promotions." },
            { industry: "Service", description: "Educational posts and portfolio updates." },
        ],
        implementation: "Set up in 2 days with your brand guidelines.",
        faqs: [
            { question: "Can I approve posts before they go out?", answer: "Yes, you have full control over the content calendar." }
        ],
        relatedSolutions: [
            { title: "AI Creative Studio", href: "/ai-creative-studio-qatar" },
            { title: "AI Customer Agent", href: "/ai-customer-agent-qatar" },
        ],
    },
    "web-development-qatar": {
        slug: "web-development-qatar",
        metadata: meta(
            "AI Web Development in Qatar",
            "High-converting AI-optimized websites, chatbot-ready architecture, and powerful AI integrations for Qatar businesses.",
            "web-development-qatar"
        ),
        hero: {
            title: "AI Web Development for Qatar Businesses",
            subtitle: "AI-optimized builds • chatbot-ready architecture • performance + SEO • intelligent automation",
        },
        directAnswer: "We build high-converting, AI-optimized websites with chatbot-ready architecture, seamless integrations, top-tier performance, and built-in SEO. Our AI Web Development services provide advanced features like forms automation, lead routing, and content automation to act as the intelligent foundation for your digital growth.",
        whatItIs: { title: "AI Web Development", description: "Fast, modern web architectures designed with AI-first capabilities, tailored to convert visitors into engaged leads through intelligent automation." },
        howItWorks: [
            { number: 1, title: "Discovery", description: "Understand your target conversion metrics and map out your AI integration needs." },
            { number: 2, title: "Design", description: "Wireframe a modern, responsive layout optimized for AI chatbot integration." },
            { number: 3, title: "Build", description: "Develop using cutting-edge frameworks with built-in forms automation and lead routing." },
            { number: 4, title: "Launch", description: "Deploy with comprehensive SEO metadata and AI performance tools enabled." },
        ],
        capabilities: [
            { icon: "⚡", title: "High Performance", description: "Sub-second load times." },
            { icon: "🔍", title: "SEO Optimized", description: "Built for search engine visibility." },
            { icon: "📱", title: "Responsive", description: "Perfect on mobile, tablet, and desktop." },
            { icon: "🔗", title: "Integrations", description: "Connects with your CRM and AI tools." },
        ],
        outcomes: [
            { metric: "100", label: "Performance Score" },
            { metric: "3x", label: "Conversion Rate" },
        ],
        useCases: [
            { industry: "B2B", description: "Corporate sites with lead generation funnels." },
            { industry: "E-commerce", description: "Fast product catalogs with integrated ordering." },
        ],
        implementation: "Launched in 2-4 weeks depending on complexity.",
        faqs: [
            { question: "Do you provide hosting?", answer: "Yes, we host on secure, scalable cloud infrastructure." }
        ],
        relatedSolutions: [
            { title: "AI Website Chatbot", href: "/ai-website-chatbot-qatar" },
            { title: "AI ERP Solutions", href: "/erp-pfp-qatar" },
        ],
    },
    "ai-business-plan-generator-qatar": {
        slug: "ai-business-plan-generator-qatar",
        metadata: meta(
            "AI Business Plan Generator",
            "AI-generated business plan drafts, pitch support, and templates.",
            "ai-business-plan-generator-qatar"
        ),
        hero: {
            title: "AI Business Plan Generator",
            subtitle: "AI-generated business plan drafts • pitch support • industry-based templates",
        },
        directAnswer: "Our AI Business Plan Generator helps entrepreneurs quickly draft comprehensive business plans, create pitch decks, and utilize industry-specific templates to secure funding and guide growth.",
        whatItIs: { title: "What is the AI Business Plan Generator?", description: "A tool that converts your raw ideas and financial projections into professional, investor-ready documents." },
        howItWorks: [
            { number: 1, title: "Input", description: "Provide your business idea, target market, and initial numbers." },
            { number: 2, title: "AI Drafting", description: "The system generates structured sections and executive summaries." },
            { number: 3, title: "Refinement", description: "Review and edit the draft with our provided templates." },
            { number: 4, title: "Export", description: "Download ready-to-present PDFs and pitch decks." },
        ],
        capabilities: [
            { icon: "📝", title: "Smart Drafting", description: "Generates clear, professional narratives." },
            { icon: "📊", title: "Financials", description: "Formats your projections perfectly." },
            { icon: "🎯", title: "Pitch Support", description: "Extracts key points for investor presentations." },
            { icon: "📑", title: "Templates", description: "Industry-specific structures for Qatar." },
        ],
        outcomes: [
            { metric: "Days", label: "Saved in drafting" },
            { metric: "100%", label: "Structure" },
        ],
        useCases: [
            { industry: "Startups", description: "Drafting an initial business plan for seed funding." },
            { industry: "SMEs", description: "Creating expansion strategy documents for bank loans." },
        ],
        implementation: "Instant access to the generation tools.",
        faqs: [
            { question: "Is this suitable for Qatari banks?", answer: "Yes, our templates align with local institutional requirements." }
        ],
        relatedSolutions: [
            { title: "AI ERP Solutions", href: "/erp-pfp-qatar" },
        ],
    },
};
