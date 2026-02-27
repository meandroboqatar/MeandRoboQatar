import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/Section";
import { CTABanner } from "@/components/CTABanner";

export const metadata: Metadata = {
    title: "Case Studies",
    description:
        "Real-world results from MeandRobo's AI solutions for Qatar businesses. Coming soon.",
    alternates: { canonical: "https://meandrobo.com.qa/case-studies" },
};

export default function CaseStudiesPage() {
    return (
        <>
            <Section className="pt-28 sm:pt-32 min-h-[60vh] flex items-center">
                <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                        Case Studies
                    </h1>
                    <p className="text-brand-muted text-lg leading-relaxed mb-8">
                        We&apos;re currently documenting success stories from our Qatar clients. Real results, real businesses — coming soon.
                    </p>
                    <div className="card inline-block p-8 text-center">
                        <span className="text-4xl mb-4 block">📋</span>
                        <p className="text-brand-muted mb-4">
                            Want to be featured? Book a consultation and start your AI transformation today.
                        </p>
                        <Link href="/contact" className="btn-primary">
                            Book Free Consultation
                        </Link>
                    </div>
                </div>
            </Section>
            <CTABanner />
        </>
    );
}
