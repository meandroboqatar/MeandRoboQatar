const fs = require('fs');
const path = require('path');

const services = [
    {
        id: "ai_erp_solutions",
        name: "AI ERP Solutions",
        overview: "It is a unified platform handling Inventory, Sales, Purchasing, Expenses, Invoicing, and Reporting with AI-driven finance automation."
    },
    {
        id: "ai_website_chatbot",
        name: "AI Website & Chatbot",
        overview: "It provides a website chat assistant with FAQ grounding, lead capture, and booking routing."
    },
    {
        id: "ai_customer_agent",
        name: "AI Customer Agent",
        overview: "It auto-replies to Instagram, Facebook, and WhatsApp inquiries, handles DMs/comments, and escalates to humans."
    },
    {
        id: "ai_social_media_manager",
        name: "AI Social Media Manager",
        overview: "It manages your content calendar, writes captions, generates hashtags, schedules posting, and ensures brand consistency."
    },
    {
        id: "ai_creative_studio",
        name: "AI Creative Studio",
        overview: "It generates promotional images, ad creatives, short videos, and campaign assets tailored for Qatar SMEs."
    },
    {
        id: "ai_call_center_agent",
        name: "AI Call Center Agent",
        overview: "It handles call routing via voice AI, provides scripted support flows, qualifies leads, and logs call summaries."
    },
    {
        id: "web_development",
        name: "Web Development",
        overview: "We build high-converting websites and landing pages with rich integrations, optimized performance, and SEO."
    },
    {
        id: "ai_business_plan_generator",
        name: "AI Business Plan Generator",
        overview: "It produces AI-generated business plan drafts, pitch support, and industry-based templates."
    }
];

const dir = path.join(__dirname, 'src/content/faqs');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

services.forEach(s => {
    const data = {
        serviceId: s.id,
        serviceName: s.name,
        faqs: [
            {
                id: "service_overview",
                question: `What is the ${s.name} service?`,
                answer: s.overview,
                tags: ["overview", s.name.toLowerCase()]
            },
            {
                id: "who_is_it_for",
                question: `Who is ${s.name} built for?`,
                answer: "It is specifically built for Qatar startups and SMEs looking to automate their daily operations.",
                tags: ["who", "target audience", "sme"]
            },
            {
                id: "implementation_timeline",
                question: "How long does implementation take?",
                answer: "Implementation typically takes 1 to 2 weeks, including on-site setup in Doha if required.",
                tags: ["timeline", "setup", "how long"]
            },
            {
                id: "what_you_get_deliverables",
                question: "What are the deliverables?",
                answer: `You will receive a complete, ready-to-use ${s.name} system configured to your specific business needs.`,
                tags: ["deliverables", "what do i get"]
            },
            {
                id: "support_and_maintenance",
                question: "What support is included?",
                answer: "We provide comprehensive training for your team and ongoing maintenance to ensure optimal performance.",
                tags: ["support", "maintenance", "help"]
            },
            {
                id: "pricing_model",
                question: "What is the pricing model?",
                answer: "Pricing is dependent on your exact scope and requirements. Please book a free consultation for a detailed quote.",
                tags: ["price", "cost", "pricing"]
            }
        ]
    };
    fs.writeFileSync(path.join(dir, `${s.id}.json`), JSON.stringify(data, null, 4));
});

console.log("Successfully generated all 8 FAQ files.");
