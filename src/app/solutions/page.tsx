import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/Section";
import { SolutionCard } from "@/components/SolutionCard";
import { CTABanner } from "@/components/CTABanner";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
    title: "AI Solutions for Qatar SMEs",
    description:
        "Explore MeandRobo's 8 AI-powered solutions including AI ERP, Chatbots, Customer Agents, Web Development, and more.",
    alternates: { canonical: "https://meandrobo.com.qa/solutions" },
};

const solutions = [
    {
        icon: "📊",
        title: "AI ERP Solutions",
        description: "Inventory • Sales • Purchasing • Expenses • Invoicing • Reporting • Finance automation",
        href: "/erp-pfp-qatar",
    },
    {
        icon: "💬",
        title: "AI Website & Chatbot",
        description: "Website chat assistant • FAQ grounding • Lead capture • Booking routing",
        href: "/ai-website-chatbot-qatar",
    },
    {
        icon: "🤖",
        title: "AI Customer Agent",
        description: "Auto-reply to Instagram/Facebook/WhatsApp inquiries • DM/comment handling • escalation to human",
        href: "/ai-customer-agent-qatar",
    },
    {
        icon: "📱",
        title: "AI Social Media Manager",
        description: "Content calendar • captions • hashtags • scheduled posting • brand consistency",
        href: "/ai-social-media-manager-qatar",
    },
    {
        icon: "🎨",
        title: "AI Creative Studio",
        description: "Promotional images • ad creatives • short videos • campaign assets for Qatar SMEs",
        href: "/ai-creative-studio-qatar",
    },
    {
        icon: "📞",
        title: "AI Call Center Agent",
        description: "Call routing • scripted support flows • lead qualification • call summaries",
        href: "/ai-call-center-agent-qatar",
    },
    {
        icon: "💻",
        title: "Web Development",
        description: "High-converting websites • landing pages • integrations • performance + SEO",
        href: "/web-development-qatar",
    },
    {
        icon: "📝",
        title: "AI Business Plan Generator",
        description: "AI-generated business plan drafts • pitch support • industry-based templates",
        href: "/ai-business-plan-generator-qatar",
    },
];

export default function SolutionsPage() {
    return (
        <>
            <Section className="pt-28 sm:pt-32">
                <SectionHeader
                    eyebrow="Our Solutions"
                    title="AI Solutions for Qatar Businesses"
                    description="Eight purpose-built AI solutions that automate operations, reduce costs, and accelerate growth for SMEs in Qatar. Each is deployed on-site in Doha with ongoing support."
                />

                <p className="text-brand-muted text-center max-w-3xl mx-auto mb-12 -mt-8">
                    MeandRobo delivers AI-powered automation solutions specifically designed for Qatar&apos;s SME market. From ERP and financial planning to customer service automation and creative content generation, our solutions help businesses in Doha operate smarter without increasing headcount.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {solutions.map((solution) => (
                        <SolutionCard key={solution.href} {...solution} />
                    ))}
                </div>
            </Section>

            <CTABanner />

            <Section variant="surface" id="contact">
                <div className="max-w-2xl mx-auto">
                    <SectionHeader
                        title="Find the right solution"
                        description="Tell us about your business and we'll recommend the best AI solution for your needs."
                    />
                    <LeadForm sourcePage="solutions" />
                </div>
            </Section>
        </>
    );
}
