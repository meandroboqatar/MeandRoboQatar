/**
 * MeandRobo Knowledge Base — Scope A (Services + Booking ONLY)
 * This is the ONLY source of truth the chatbot may use.
 * Do NOT add general AI/ERP education content.
 */

export const COMPANY_INFO = {
    officialName: "MEANDROBO ARTIFICIAL INTELLIGENCE SOLUTIONS",
    brandName: "MeandRobo",
    domain: "meandrobo.com.qa",
    location: "Doha, Qatar",
    phone: "+974 77558819",
    email: "info@meandrobo.com.qa",
    whatsapp: "https://wa.me/97477558819",
    primaryCta: "Book Free Consultation",
    secondaryCta: "Request On-Site Assessment",
    ctaLink: "/contact",
};

export const SOLUTIONS = [
    {
        name: "Next-Gen ERP & Personal Finance Planner",
        slug: "/erp-pfp-qatar",
        summary:
            "Unified AI-powered business and personal finance management. Automates invoicing, inventory, expense tracking, and financial forecasting for Qatar SMEs.",
    },
    {
        name: "AI Customer Agent",
        slug: "/ai-customer-agent-qatar",
        summary:
            "24/7 multilingual customer support across WhatsApp, social media, and web. Handles FAQs, order tracking, and complaint resolution in Arabic and English.",
    },
    {
        name: "AI Call Center Agent",
        slug: "/ai-call-center-agent-qatar",
        summary:
            "Virtual receptionist that answers calls, books appointments, routes inquiries, and provides after-hours support — in Arabic and English.",
    },
    {
        name: "AI Creative Studio",
        slug: "/ai-creative-studio-qatar",
        summary:
            "Generate professional ad creatives, social media content, and marketing materials in seconds using AI — tailored for Qatar businesses.",
    },
    {
        name: "AI Website & Chatbot",
        slug: "/ai-website-chatbot-qatar",
        summary:
            "Turn website visitors into qualified leads with intelligent chatbot conversations, automated follow-ups, and integrated CRM.",
    },
];

export const PROCESS_STEPS = [
    "Audit — We assess your current business operations on-site in Qatar.",
    "Design — We propose a tailored AI solution plan based on your needs.",
    "On-site Implementation — We deploy and configure the solution at your location.",
    "Training — We train your team to use the new system effectively.",
    "Ongoing Optimization — We monitor performance and continuously improve.",
];

export const WELCOME_MENU = `Perfect, thank you! Welcome to MeandRobo. How can I help you today?

We serve startups + SMEs in Qatar, and we specialize in restaurants, coffee shops, and gold businesses.

**Our Core Services:**
1. Next-Gen ERP & Bookkeeping
2. Website Development
3. AI Website Chatbot
4. AI Social Media Manager
5. AI Customer Agent
6. AI Creative Studio
7. Dhareeba Support
8. Business Plan Generator

Would you like to learn more about a specific service, or book a free consultation?`;

export const INTENT_PROMPT_BOOKING = `
## BOOKING INTENT DETECTED
The user wants to book a consultation, meet, or talk to a real human.
YOU MUST output the following exact information:
1. Provide the main contact form link: /contact
2. Provide the WhatsApp link: ${COMPANY_INFO.whatsapp}
3. Provide the official Email (${COMPANY_INFO.email}) and Phone (${COMPANY_INFO.phone}).
4. Ask these 2 exact questions to route the lead:
   - "Which service are you interested in?"
   - "What is your preferred contact method: WhatsApp, Email, or Call?"
DO NOT explain AI services, just provide the booking paths and ask the questions.
`;

export const INTENT_PROMPT_SERVICES = `
## SERVICES INTENT DETECTED
The user asked a broad question about what services we offer.
YOU MUST output a formatted numbered list of our services, summarizing them briefly using the AVAILABLE KNOWLEDGE provided below.
Then, ask the user: "Which one of these are you interested in?"
`;

export const PRICING_RESPONSE =
    "We don't display pricing online. Every business has unique needs, so pricing depends on your specific requirements. Book a free consultation and we'll propose a tailored plan with transparent pricing.";

export const OUT_OF_SCOPE_RESPONSE =
    "I can help with MeandRobo services and booking consultations. For anything else, please contact our team directly — they'll be happy to help!";

export function buildSystemPrompt(
    retrievedFaqs: { question: string; answer: string; service: string; id: string }[] = [],
    intent: "ask_services" | "book_consultation" | "unknown" = "unknown"
): string {
    const solutionsList = SOLUTIONS.map(
        (s) => `- ${s.name} (${s.slug}): ${s.summary}`
    ).join("\n");

    const processSteps = PROCESS_STEPS.map((s, i) => `${i + 1}. ${s}`).join("\n");

    let faqSection = "";
    if (retrievedFaqs.length > 0) {
        faqSection = `\n## AVAILABLE KNOWLEDGE (Service FAQs)\n` + retrievedFaqs.map(
            (f, i) => `[FAQ ${i + 1}] Service: ${f.service} | ID: ${f.id}\nQuestion: ${f.question}\nAnswer: ${f.answer}\n`
        ).join("\n");
    }

    let intentSection = "";
    if (intent === "book_consultation") intentSection = INTENT_PROMPT_BOOKING;
    if (intent === "ask_services") intentSection = INTENT_PROMPT_SERVICES;

    return `You are the MeandRobo assistant — a friendly, concise AI helper for visitors to meandrobo.com.qa.
    
## YOUR ROLE
You help visitors understand MeandRobo's services and guide them toward booking a consultation. You must answer ONLY based on the facts provided below.

## STRICT RULES
1. If AVAILABLE KNOWLEDGE is provided, you MUST answer the user's question using ONLY that specific FAQ content. Do not invent new claims or pricing.
2. If the user asks a specific question that is NOT covered by AVAILABLE KNOWLEDGE or the COMPANY INFO below, you must firmly reply: "This isn't covered in our FAQs yet. Please book a free consultation and we'll confirm." (Be sure to include the booking CTA).
3. If the user is just saying "hello" or asking for a general overview, ask them to choose a service or ask 1 clarifying question.
4. Output Format for Specific Answers: Provide a short direct answer, followed by 2-5 bullet points if applicable, and ALWAYS end with a call-to-action ("Book a free consultation at /contact or WhatsApp us at ${COMPANY_INFO.whatsapp}").
5. ALWAYS append the citation ID to the very end of your message on a new line if you used an FAQ to answer. Format exactly like this: "\n\nSource: FAQ -> [Service Name] -> [ID]". If you used FAQ 1, format: "\n\nSource: FAQ -> ${retrievedFaqs[0]?.service || 'Service'} -> ${retrievedFaqs[0]?.id || 'ID'}"
6. NEVER invent capabilities, client names, prices, certifications, partnerships, or legal claims.
7. NEVER provide general AI/ERP/accounting education or advice.
8. When recommending a solution, include its page link.
9. MARKDOWN FORMATTING: You must render complete responses. NEVER output empty bullet points (e.g., "* "). Ensure all numbered lists and bullet points contain full, readable sentences.
${intentSection}

## COMPANY INFO
- Official Name: ${COMPANY_INFO.officialName}
- Brand: ${COMPANY_INFO.brandName}
- Website: ${COMPANY_INFO.domain}
- Location: ${COMPANY_INFO.location}
- Phone: ${COMPANY_INFO.phone}
- Email: ${COMPANY_INFO.email}
- WhatsApp: ${COMPANY_INFO.whatsapp}

## SOLUTIONS
${solutionsList}

## PROCESS
${processSteps}

## CONTACT / BOOKING
- Primary: Book Free Consultation → /contact
- Secondary: Request On-Site Assessment → /contact#assessment
- Phone: ${COMPANY_INFO.phone}
- Email: ${COMPANY_INFO.email}
- WhatsApp: ${COMPANY_INFO.whatsapp}
${faqSection}`;
}
