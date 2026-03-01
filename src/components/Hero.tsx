import Link from "next/link";
import Image from "next/image";

interface HeroProps {
    title: string;
    subtitle: string;
    primaryCta?: { text: string; href: string };
    secondaryCta?: { text: string; href: string };
    showRobot?: boolean;
    animationVariant?: string;
}

export function Hero({
    title,
    subtitle,
    primaryCta = { text: "Book Free Consultation", href: "/contact" },
    secondaryCta = { text: "Request On-Site Assessment", href: "/contact#assessment" },
    showRobot = true,
    animationVariant,
}: HeroProps) {
    return (
        <section className="relative overflow-hidden pt-20 sm:pt-24 bg-white">
            {/* Background subtle accent */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-green/[0.03] rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-brand-green/[0.02] rounded-full blur-3xl" />
            </div>

            <div className="container-brand mx-auto section-padding relative">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="max-w-2xl">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-brand-green/10 text-brand-green text-sm font-semibold mb-6 border border-brand-green/20 animate-fade-in">
                            Trusted for SMEs in Qatar
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight text-brand-text">
                            {title.split(/(\bQatar\b|\bAI\b|\bSMEs\b)/g).map((part, i) =>
                                ["Qatar", "AI", "SMEs"].includes(part) ? (
                                    <span key={i} className="text-gradient">
                                        {part}
                                    </span>
                                ) : (
                                    <span key={i}>{part}</span>
                                )
                            )}
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl text-brand-muted leading-relaxed max-w-xl">
                            {subtitle}
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
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
                        <div className="mt-5 text-sm text-brand-muted flex flex-wrap items-center gap-x-3 gap-y-2">
                            <span className="flex items-center gap-1.5 font-medium">
                                <svg className="w-4 h-4 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Response within 24 hours
                            </span>
                            <span className="hidden sm:inline text-brand-surface-border">•</span>
                            <span className="font-medium">Doha-based team</span>
                            <span className="hidden sm:inline text-brand-surface-border">•</span>
                            <span className="font-medium">WhatsApp support</span>
                        </div>

                        {!animationVariant && (
                            <div className="mt-10 pt-6 border-t border-brand-surface-border/60">
                                <p className="text-xs text-brand-muted mb-3 font-semibold uppercase tracking-wider">Our Core Services</p>
                                <div className="flex flex-wrap gap-2 text-sm text-brand-muted">
                                    <span className="px-3 py-1 bg-brand-surface hover:bg-white rounded-full border border-brand-surface-border transition-colors">AI ERP Solutions</span>
                                    <span className="px-3 py-1 bg-brand-surface hover:bg-white rounded-full border border-brand-surface-border transition-colors">AI Website & Chatbot</span>
                                    <span className="px-3 py-1 bg-brand-surface hover:bg-white rounded-full border border-brand-surface-border transition-colors">AI Customer Agent</span>
                                    <span className="px-3 py-1 bg-brand-surface hover:bg-white rounded-full border border-brand-surface-border transition-colors">AI Creative Studio</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {showRobot && (
                        <div className="hidden lg:flex justify-center items-center">
                            <div className={`relative ${animationVariant || 'animate-float-complex'}`}>
                                <div className="absolute inset-0 bg-brand-green/10 rounded-full blur-[60px] animate-pulse-glow" aria-hidden="true" />
                                <Image
                                    src="/images/robot-mascot-transparent.png"
                                    alt="MeandRobo robot mascot"
                                    width={400}
                                    height={400}
                                    className="relative z-10 drop-shadow-2xl"
                                    priority
                                />
                                {animationVariant === 'animate-sparkle' && (
                                    <div className="absolute inset-0 z-20 pointer-events-none animate-sparkle flex items-center justify-center">
                                        <div className="w-full h-full border-4 border-dashed border-brand-green/30 rounded-xl" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
