import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { solutions } from "@/lib/solutions-data";
import { Hero } from "@/components/Hero";
import { Section, SectionHeader } from "@/components/Section";
import { Steps } from "@/components/Steps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CTABanner } from "@/components/CTABanner";
import { LeadForm } from "@/components/LeadForm";
import { JsonLd } from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://meandrobo.com.qa";

interface SolutionPageProps {
    slug: string;
}

export function generateSolutionMetadata(slug: string): Metadata {
    const data = solutions[slug];
    if (!data) return {};
    return data.metadata;
}

export function SolutionPage({ slug }: SolutionPageProps) {
    const data = solutions[slug];
    if (!data) notFound();

    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: data.hero.title,
        description: data.directAnswer,
        provider: {
            "@type": "Organization",
            name: "MEANDROBO ARTIFICIAL INTELLIGENCE SOLUTIONS",
            url: SITE_URL,
        },
        areaServed: {
            "@type": "Country",
            name: "Qatar",
        },
        serviceType: "AI Business Automation",
        url: `${SITE_URL}/${slug}`,
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: data.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };

    return (
        <>
            <JsonLd data={serviceSchema} />
            <JsonLd data={faqSchema} />

            <Hero
                title={data.hero.title}
                subtitle={data.hero.subtitle}
                showRobot={false}
            />

            {/* Direct Answer */}
            <Section>
                <div className="max-w-3xl mx-auto">
                    <p className="text-lg text-brand-muted leading-relaxed border-l-4 border-brand-green pl-6">
                        {data.directAnswer}
                    </p>
                </div>
            </Section>

            {/* What It Is */}
            <Section variant="surface">
                <SectionHeader title={data.whatItIs.title} />
                <div className="max-w-3xl mx-auto">
                    <p className="text-brand-muted leading-relaxed text-center">
                        {data.whatItIs.description}
                    </p>
                </div>
            </Section>

            {/* How It Works */}
            <Section>
                <SectionHeader
                    eyebrow="Process"
                    title="How it works"
                    description="A clear, structured process from discovery to optimization."
                />
                <Steps steps={data.howItWorks} />
            </Section>

            {/* Capabilities */}
            <Section variant="surface">
                <SectionHeader
                    eyebrow="Capabilities"
                    title="What you get"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.capabilities.map((cap) => (
                        <div key={cap.title} className="card">
                            <span className="text-2xl mb-3 block">{cap.icon}</span>
                            <h3 className="font-semibold mb-2">{cap.title}</h3>
                            <p className="text-brand-muted text-sm">{cap.description}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Outcomes */}
            <Section>
                <SectionHeader
                    eyebrow="Results"
                    title="What to expect"
                />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.outcomes.map((outcome) => (
                        <div key={outcome.label} className="text-center card">
                            <div className="text-3xl sm:text-4xl font-bold text-brand-green mb-2">
                                {outcome.metric}
                            </div>
                            <div className="text-brand-muted text-sm">{outcome.label}</div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Use Cases */}
            <Section variant="surface">
                <SectionHeader
                    eyebrow="Industries"
                    title="Use cases in Qatar"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {data.useCases.map((uc) => (
                        <div key={uc.industry} className="card">
                            <h3 className="font-semibold mb-2">{uc.industry}</h3>
                            <p className="text-brand-muted text-sm">{uc.description}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Implementation */}
            <Section>
                <SectionHeader
                    eyebrow="Deployment"
                    title="Implementation in Qatar"
                />
                <div className="max-w-3xl mx-auto">
                    <p className="text-brand-muted leading-relaxed text-center">
                        {data.implementation}
                    </p>
                </div>
            </Section>

            {/* FAQs */}
            <Section variant="surface">
                <SectionHeader
                    eyebrow="FAQ"
                    title="Frequently asked questions"
                />
                <div className="max-w-3xl mx-auto">
                    <FAQAccordion items={data.faqs} />
                </div>
            </Section>

            {/* Related Solutions */}
            <Section>
                <SectionHeader title="Explore more solutions" />
                <div className="flex flex-wrap gap-4 justify-center">
                    {data.relatedSolutions.map((r) => (
                        <Link
                            key={r.href}
                            href={r.href}
                            className="px-5 py-2.5 border border-brand-surface-border rounded-brand hover:border-brand-green hover:text-brand-green transition-colors text-sm"
                        >
                            {r.title}
                        </Link>
                    ))}
                </div>
            </Section>

            <CTABanner />

            {/* Lead Form */}
            <Section variant="surface" id="contact">
                <div className="max-w-2xl mx-auto">
                    <SectionHeader
                        title="Get started with this solution"
                        description="Fill out the form and we'll schedule your free consultation."
                    />
                    <LeadForm sourcePage={slug} />
                </div>
            </Section>
        </>
    );
}
