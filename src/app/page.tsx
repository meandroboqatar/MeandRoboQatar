import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section, SectionHeader } from "@/components/Section";
import { SolutionCard } from "@/components/SolutionCard";
import { CTABanner } from "@/components/CTABanner";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
    title: "AI Business Automation in Qatar | MeandRobo",
    description:
        "MeandRobo provides AI-powered ERP, customer agents, call center solutions, and creative tools for SMEs in Qatar. Book a free consultation.",
    alternates: { canonical: "https://meandrobo.com.qa" },
};

const painPoints = [
    { icon: "⏱️", title: "High Lead Response Time", description: "Customers expect instant replies. Delays mean lost business to faster competitors." },
    { icon: "🔄", title: "Inconsistent Service", description: "Staff turnover and manual processes lead to inconsistent customer experiences." },
    { icon: "💸", title: "High Operational Costs", description: "Hiring, training, and managing teams for repetitive tasks drains your budget." },
    { icon: "📊", title: "Fragmented Data", description: "Business data scattered across spreadsheets, apps, and paper makes decisions harder." },
    { icon: "🌐", title: "Language Barriers", description: "Serving Arabic and English customers requires bilingual staff around the clock." },
];

const solutionsList = [
    { icon: "📊", title: "AI ERP Solutions", description: "Inventory • Sales • Purchasing • Expenses • Invoicing • Reporting • Finance automation", href: "/erp-pfp-qatar" },
    { icon: "💬", title: "AI Website & Chatbot", description: "Website chat assistant • FAQ grounding • Lead capture • Booking routing", href: "/ai-website-chatbot-qatar" },
    { icon: "🤖", title: "AI Customer Agent", description: "Auto-reply to Instagram/Facebook/WhatsApp inquiries • DM/comment handling • escalation to human", href: "/ai-customer-agent-qatar" },
    { icon: "📱", title: "AI Social Media Manager", description: "Content calendar • captions • hashtags • scheduled posting • brand consistency", href: "/ai-social-media-manager-qatar" },
    { icon: "🎨", title: "AI Creative Studio", description: "Promotional images • ad creatives • short videos • campaign assets for Qatar SMEs", href: "/ai-creative-studio-qatar" },
    { icon: "📞", title: "AI Call Center Agent", description: "Call routing • scripted support flows • lead qualification • call summaries", href: "/ai-call-center-agent-qatar" },
    { icon: "💻", title: "Web Development", description: "High-converting websites • landing pages • integrations • performance + SEO", href: "/web-development-qatar" },
    { icon: "📝", title: "AI Business Plan Generator", description: "AI-generated business plan drafts • pitch support • industry-based templates", href: "/ai-business-plan-generator-qatar" },
];

export default function HomePage() {
    return (
        <>
            <Hero
                title="AI-Powered Business Automation for SMEs in Qatar"
                subtitle="Scale your operations with intelligent ERP systems, 24/7 AI customer agents, and custom call center solutions tailored for the Qatari market."
            />

            {/* Pain Points */}
            <Section variant="surface">
                <SectionHeader
                    eyebrow="The Problem"
                    title="Stop wasting resources on repetitive tasks"
                    description="Qatar SMEs face the same challenges every day. AI solves them."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {painPoints.map((point) => (
                        <div key={point.title} className="card">
                            <span className="text-2xl mb-3 block">{point.icon}</span>
                            <h3 className="font-semibold mb-2">{point.title}</h3>
                            <p className="text-brand-muted text-sm">{point.description}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Solutions Suite */}
            <Section>
                <SectionHeader
                    eyebrow="Our Intelligence Suite"
                    title="Eight AI-powered solutions for every business need"
                    description="Each solution is tailored to your industry to supercharge your daily operations in Qatar."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {solutionsList.map((solution) => (
                        <SolutionCard key={solution.href} {...solution} />
                    ))}
                </div>
            </Section>

            {/* CTA */}
            <CTABanner />

            {/* Lead Form */}
            <Section variant="surface" id="contact">
                <div className="max-w-2xl mx-auto">
                    <SectionHeader
                        title="Get in touch"
                        description="Fill out the form and our team will get back to you within 24 hours."
                    />
                    <LeadForm sourcePage="home" />
                </div>
            </Section>
        </>
    );
}
