import type { Metadata } from "next";
import Image from "next/image";
import { Section, SectionHeader } from "@/components/Section";
import { CTABanner } from "@/components/CTABanner";

export const metadata: Metadata = {
    title: "About MeandRobo | AI Solutions in Qatar",
    description:
        "Meet the team behind MeandRobo — pioneering AI business automation for SMEs in Doha, Qatar. On-site assessment available.",
    alternates: { canonical: "https://meandrobo.com.qa/about" },
};

export default function AboutPage() {
    return (
        <>
            <Section className="pt-28 sm:pt-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                            About <span className="text-gradient">MeandRobo</span>
                        </h1>
                        <p className="text-brand-muted text-lg leading-relaxed mb-6">
                            MeandRobo was founded with a simple mission: make AI-powered business automation accessible to every SME in Qatar. We believe that small businesses deserve the same technological advantages as large enterprises — without the complexity or cost.
                        </p>
                        <p className="text-brand-muted leading-relaxed mb-6">
                            Based in Doha, we provide on-site assessment and implementation services across Qatar. Our team combines deep AI expertise with local market understanding to deliver solutions that actually work for Qatari businesses.
                        </p>
                        <p className="text-brand-muted leading-relaxed">
                            From restaurants and coffee shops to salons and rent-a-car agencies, we help SMEs automate repetitive tasks, serve customers better, and grow faster — with AI that works alongside your team, not instead of it.
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <div className="relative">
                            <Image
                                src="/images/robot-mascot-transparent.png"
                                alt="MeandRobo robot mascot"
                                width={400}
                                height={400}
                                className="relative z-10 drop-shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </Section>

            <Section variant="surface">
                <SectionHeader
                    eyebrow="Our Approach"
                    title="Human expertise meets robotic efficiency"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="card text-center">
                        <span className="text-3xl mb-4 block">🏢</span>
                        <h3 className="font-semibold mb-2">On-Site in Qatar</h3>
                        <p className="text-brand-muted text-sm">
                            We come to your location for discovery, setup, and training. No remote-only guesswork.
                        </p>
                    </div>
                    <div className="card text-center">
                        <span className="text-3xl mb-4 block">🤖</span>
                        <h3 className="font-semibold mb-2">AI-First Solutions</h3>
                        <p className="text-brand-muted text-sm">
                            Every solution uses state-of-the-art AI to automate tasks, generate insights, and improve over time.
                        </p>
                    </div>
                    <div className="card text-center">
                        <span className="text-3xl mb-4 block">🤝</span>
                        <h3 className="font-semibold mb-2">SME-Focused</h3>
                        <p className="text-brand-muted text-sm">
                            Built specifically for Qatar&apos;s SME market — restaurants, salons, car rentals, and beyond.
                        </p>
                    </div>
                </div>
            </Section>

            <Section>
                <SectionHeader
                    eyebrow="Meet the Mascot"
                    title="Why a robot?"
                    description="Our robot mascot represents the partnership between human creativity and AI efficiency. The robot handles the repetitive work, so you can focus on what matters — growing your business."
                />
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-brand-muted leading-relaxed">
                        The idea is simple: &quot;Me and Robo&quot; — you and your AI assistant, working together. Every business owner deserves a tireless, intelligent helper that handles customer inquiries, manages finances, creates marketing content, and answers phone calls — 24/7, in Arabic and English, without complaints or sick days.
                    </p>
                </div>
            </Section>

            <CTABanner
                title="Ready to meet your Robo?"
                description="Book a free consultation and discover which AI solutions can transform your Qatar business."
            />
        </>
    );
}
