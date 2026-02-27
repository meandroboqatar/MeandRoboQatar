import Link from "next/link";
import Image from "next/image";

interface HeroProps {
    title: string;
    subtitle: string;
    primaryCta?: { text: string; href: string };
    secondaryCta?: { text: string; href: string };
    showRobot?: boolean;
}

export function Hero({
    title,
    subtitle,
    primaryCta = { text: "Book Free Consultation", href: "/contact" },
    secondaryCta = { text: "Request On-Site Assessment", href: "/contact#assessment" },
    showRobot = true,
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
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight text-brand-text">
                            {title.split(/(\\bQatar\\b|\\bAI\\b|\\bSMEs\\b)/g).map((part, i) =>
                                ["Qatar", "AI", "SMEs"].includes(part) ? (
                                    <span key={i} className="text-gradient">
                                        {part}
                                    </span>
                                ) : (
                                    <span key={i}>{part}</span>
                                )
                            )}
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl text-brand-muted leading-relaxed">
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
                    </div>

                    {showRobot && (
                        <div className="hidden lg:flex justify-center items-center">
                            <div className="relative animate-float">
                                <Image
                                    src="/images/robot-mascot-transparent.png"
                                    alt="MeandRobo robot mascot"
                                    width={400}
                                    height={400}
                                    className="relative z-10 drop-shadow-xl"
                                    priority
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
