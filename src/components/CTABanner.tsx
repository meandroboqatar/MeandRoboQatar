import Link from "next/link";

interface CTABannerProps {
    title?: string;
    description?: string;
    primaryCta?: { text: string; href: string };
    secondaryCta?: { text: string; href: string };
}

export function CTABanner({
    title = "Ready to automate your success?",
    description = "Book a free consultation with our team. We offer on-site assessments anywhere in Qatar.",
    primaryCta = { text: "Book Free Consultation", href: "/contact" },
    secondaryCta = { text: "Request On-Site Assessment", href: "/contact#assessment" },
}: CTABannerProps) {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-green/5 via-brand-green/10 to-brand-green/5" />
            <div className="container-brand mx-auto section-padding relative text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                    {title}
                </h2>
                <p className="text-brand-muted text-lg max-w-2xl mx-auto mb-8">
                    {description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href={primaryCta.href} className="btn-primary">
                        {primaryCta.text}
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                    <Link href={secondaryCta.href} className="btn-secondary">
                        {secondaryCta.text}
                    </Link>
                </div>
            </div>
        </section>
    );
}
