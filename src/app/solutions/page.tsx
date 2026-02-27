import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/Section";
import { SolutionCard } from "@/components/SolutionCard";
import { CTABanner } from "@/components/CTABanner";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
    title: "AI Solutions for Qatar SMEs",
    description:
        "Explore MeandRobo's 5 AI-powered solutions: ERP, Customer Agent, Call Center, Creative Studio, and Website Chatbot — built for Qatar.",
    alternates: { canonical: "https://meandrobo.com.qa/solutions" },
};

const solutions = [
    {
        icon: "📊",
        title: "Next-Gen ERP & PFP",
        description: "Unified business and personal finance management with AI-powered insights. Track revenue, expenses, inventory, and personal wealth in one dashboard.",
        href: "/erp-pfp-qatar",
    },
    {
        icon: "🤖",
        title: "AI Customer Agent",
        description: "24/7 multilingual customer support across WhatsApp, Instagram DMs, Facebook Messenger, and your website. Automate 85% of inquiries.",
        href: "/ai-customer-agent-qatar",
    },
    {
        icon: "📞",
        title: "AI Call Center Agent",
        description: "A virtual receptionist that answers every call in Arabic and English, books appointments, routes intelligently, and never puts customers on hold.",
        href: "/ai-call-center-agent-qatar",
    },
    {
        icon: "🎨",
        title: "AI Creative Studio",
        description: "Generate professional ad creatives, social media graphics, and video content in seconds — trained on your brand, no design skills needed.",
        href: "/ai-creative-studio-qatar",
    },
    {
        icon: "💬",
        title: "AI Website & Chatbot",
        description: "Transform your website into a lead-generation machine with an AI chatbot that qualifies visitors, answers questions, and books meetings 24/7.",
        href: "/ai-website-chatbot-qatar",
    },
];

export default function SolutionsPage() {
    return (
        <>
            <Section className="pt-28 sm:pt-32">
                <SectionHeader
                    eyebrow="Our Solutions"
                    title="AI Solutions for Qatar Businesses"
                    description="Five purpose-built AI solutions that automate operations, reduce costs, and accelerate growth for SMEs in Qatar. Each is deployed on-site in Doha with ongoing support."
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
