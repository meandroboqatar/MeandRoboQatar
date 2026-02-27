/**
 * Seed script — Populate Firestore `posts` collection with existing blog data.
 *
 * Usage:
 *   npx ts-node scripts/seed-posts.ts
 *
 * Requires FIREBASE_SERVICE_ACCOUNT_KEY_B64 env variable.
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// ----- Static blog data (copied from blog-data.ts to avoid import issues) -----
const SITE_URL = "https://meandrobo.com.qa";

const blogPosts = [
    {
        slug: "sme-qatar-automate-customer-support-ai",
        title: "How SMEs in Qatar Can Automate Customer Support with AI",
        excerpt:
            "Discover how AI-powered customer agents can handle WhatsApp, email, and phone inquiries for your Qatar business — 24/7, in Arabic and English.",
        date: "2025-01-15",
        readTime: "4 min read",
        status: "published",
        content: `## The Challenge for Qatar SMEs

Running a business in Qatar means serving customers who expect fast, bilingual support across WhatsApp, phone, and email. For SMEs without large support teams, this creates a gap.

## How AI Customer Agents Help

An AI customer agent doesn't just answer FAQs — it understands context, speaks Arabic and English naturally, and learns your specific business processes.

### What it handles:
- **WhatsApp inquiries** — instant, 24/7 responses in the customer's preferred language
- **Email support** — automatic categorization and response drafting
- **Phone inquiries** — AI-powered voice agents that handle routine calls

## The Real Impact

Based on businesses we've worked with in Doha:
- **Response times drop from hours to seconds** — customers get instant answers
- **60% reduction in support costs** — no need for round-the-clock staff
- **Higher customer satisfaction** — nobody likes waiting

## Getting Started

The best approach is to start with your highest-volume channel (usually WhatsApp in Qatar) and expand from there. A typical deployment takes 5–7 business days with on-site setup available in Doha.

[Learn more about our AI Customer Agent →](/ai-customer-agent-qatar)

Ready to automate your customer support? [Book a free consultation →](/contact)`,
        relatedSolutions: [
            { title: "AI Customer Agent", href: "/ai-customer-agent-qatar" },
            { title: "AI Call Center Agent", href: "/ai-call-center-agent-qatar" },
        ],
    },
    {
        slug: "erp-pfp-entrepreneurs-what-to-track",
        title: "ERP & Personal Finance: What Every Qatar Entrepreneur Should Track",
        excerpt:
            "Why separating business and personal finances is critical — and how AI-powered ERP + PFP tools help Qatar entrepreneurs stay on top of both.",
        date: "2025-01-10",
        readTime: "5 min read",
        status: "published",
        content: `## Entrepreneurs: You Need Two Financial Views

Most entrepreneurs in Qatar focus on business finances — revenue, expenses, profit. But they forget to track personal finances alongside the business. When your salary, investments, and business cashflow are intertwined, you need a unified view.

### Business Side (ERP):
- **Invoicing & receivables** — know who owes you and automate reminders
- **Expense tracking** — categorize spending and spot trends
- **Inventory management** — real-time stock levels (for restaurants, retail)
- **Payroll** — staff salaries, WPS compliance

### Personal Side (PFP):
- **Net worth tracking** — assets vs liabilities in one dashboard
- **Salary & dividends** — how much are you actually taking home?
- **Investment tracking** — real estate, stocks, crypto
- **Debt management** — loans, credit cards, mortgage

## Why AI-Powered?

AI-powered ERP doesn't just record numbers — it analyzes patterns. It tells you:
- When cash flow is trending down before it becomes a crisis
- Which customers consistently pay late
- Where you're overspending compared to industry benchmarks
- How your personal wealth is impacted by business decisions

## Start Simple, Scale Smart

You don't need a complex system from day one. Start with invoicing, expense tracking, and personal finance monitoring. As your business grows, add inventory management, payroll, and advanced analytics.

[Explore our ERP & PFP solution →](/erp-pfp-qatar)

Need help setting up? [Book a free consultation →](/contact)`,
        relatedSolutions: [
            { title: "ERP & PFP", href: "/erp-pfp-qatar" },
            { title: "AI Customer Agent", href: "/ai-customer-agent-qatar" },
        ],
    },
    {
        slug: "ai-website-chatbot-leads-qatar",
        title: "Turn Website Visitors into Leads with an AI Chatbot",
        excerpt:
            "97% of website visitors leave without taking action. Learn how an AI chatbot trained on your business can capture leads and answer questions 24/7.",
        date: "2025-01-05",
        readTime: "3 min read",
        status: "published",
        content: `## The 97% Problem

Here's a sobering stat: 97% of website visitors leave without taking any action. They browse, they read, and they disappear. For Qatar SMEs investing in digital marketing, that's a lot of wasted potential.

## Enter the AI Chatbot

Unlike basic chatbots with rigid menus, an AI-powered chatbot trained on your specific business can:

- **Answer any question** about your products, services, and pricing — instantly
- **Qualify leads** by asking the right follow-up questions
- **Book appointments** directly in your calendar
- **Speak Arabic and English** — matching the visitor's language preference
- **Escalate to human agents** when needed, with full conversation context

## Real Results

Businesses using AI chatbots on their websites see:
- **40% higher conversion rate** from visitor to qualified lead
- **24/7 lead capture** — including evenings, weekends, and holidays
- **Shorter sales cycles** — leads come in pre-qualified and ready to talk

## What Makes a Good AI Chatbot?

Not all chatbots are created equal. The best ones:

1. **Feel conversational**, not robotic — using natural language, not rigid scripts
2. **Know your products** — trained on your specific catalog, services, and FAQs
3. **Capture information naturally** — collecting name, email, and phone through conversation flow
4. **Integrate with your CRM** — leads flow directly into your sales pipeline
5. **Learn over time** — getting smarter with every conversation

[See our AI Website Chatbot in action →](/ai-website-chatbot-qatar)

Want an AI chatbot on your site? [Book a free consultation →](/contact)`,
        relatedSolutions: [
            { title: "AI Website & Chatbot", href: "/ai-website-chatbot-qatar" },
            { title: "AI Customer Agent", href: "/ai-customer-agent-qatar" },
        ],
    },
];

// ----- Script -----

async function main() {
    const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64;
    if (!b64) {
        console.error("❌ Set FIREBASE_SERVICE_ACCOUNT_KEY_B64 env variable first.");
        process.exit(1);
    }

    const serviceAccount = JSON.parse(Buffer.from(b64, "base64").toString("utf-8"));
    const app = initializeApp({ credential: cert(serviceAccount) });
    const db = getFirestore(app);

    console.log("🔄 Seeding posts...\n");

    for (const post of blogPosts) {
        // Check if slug already exists
        const existing = await db.collection("posts").where("slug", "==", post.slug).limit(1).get();
        if (!existing.empty) {
            console.log(`⏭  Skipping "${post.title}" (slug already exists)`);
            continue;
        }

        await db.collection("posts").add({
            ...post,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });
        console.log(`✅ Created: "${post.title}"`);
    }

    console.log("\n🎉 Seed complete!");
    process.exit(0);
}

main().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
