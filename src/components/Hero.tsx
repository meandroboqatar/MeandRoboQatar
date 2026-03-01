import Link from "next/link";
import Image from "next/image";

interface HeroProps {
    title: string;
    subtitle: string;
    primaryCta?: { text: string; href: string };
    secondaryCta?: { text: string; href: string };
    showRobot?: boolean;
    animationVariant?: string;
    customImage?: string;
    bullets?: string[];
}

export function Hero({
    title,
    subtitle,
    primaryCta = { text: "Book Free Consultation", href: "/contact" },
    secondaryCta = { text: "Request On-Site Assessment", href: "/contact#assessment" },
    showRobot = true,
    animationVariant,
    customImage,
    bullets,
}: HeroProps) {
    return (
        <section className="relative overflow-hidden pt-24 sm:pt-32 pb-16 lg:pb-0 lg:min-h-[680px] flex items-center bg-[#050505]">
            {/* Premium Dark Gradient & Grid Background */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-green/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            <div className="container-brand mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green/10 text-brand-green text-sm font-semibold mb-6 border border-brand-green/20 animate-fade-in backdrop-blur-sm shadow-[0_0_15px_rgba(12,206,107,0.15)]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
                            </span>
                            Trusted for SMEs in Qatar
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-extrabold leading-[1.15] tracking-tight text-white drop-shadow-sm">
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
                        <p className="mt-6 text-lg sm:text-xl text-gray-400 leading-relaxed max-w-xl font-medium">
                            {subtitle}
                        </p>
                        {bullets && bullets.length > 0 && (
                            <ul className="mt-6 space-y-3 text-gray-300">
                                {bullets.map((bullet, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-brand-green mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <Link href={primaryCta.href} className="btn-primary group">
                                {primaryCta.text}
                                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link href={secondaryCta.href} className="btn-secondary !text-white !border-white/20 hover:!border-brand-green/50 hover:!bg-white/5 backdrop-blur-sm">
                                {secondaryCta.text}
                            </Link>
                        </div>
                        <div className="mt-8 text-sm text-gray-400 flex flex-wrap items-center gap-x-3 gap-y-2 font-medium">
                            <span className="flex items-center gap-1.5 text-brand-green">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Response within 24 hours
                            </span>
                            <span className="hidden sm:inline text-gray-700">•</span>
                            <span>Doha-based team</span>
                            <span className="hidden sm:inline text-gray-700">•</span>
                            <span>WhatsApp support</span>
                        </div>

                        {!animationVariant && (
                            <div className="mt-10 pt-6 border-t border-white/10">
                                <p className="text-xs text-gray-500 mb-4 font-bold uppercase tracking-widest">Our Top AI Capabilities</p>
                                <div className="flex flex-wrap gap-2 text-sm text-gray-300">
                                    <span className="px-3 py-1.5 bg-white/5 hover:bg-brand-green/10 hover:text-brand-green rounded-full border border-white/10 transition-all cursor-default">AI ERP Solutions</span>
                                    <span className="px-3 py-1.5 bg-white/5 hover:bg-brand-green/10 hover:text-brand-green rounded-full border border-white/10 transition-all cursor-default">AI Website & Chatbot</span>
                                    <span className="px-3 py-1.5 bg-white/5 hover:bg-brand-green/10 hover:text-brand-green rounded-full border border-white/10 transition-all cursor-default">AI Customer Agent</span>
                                    <span className="px-3 py-1.5 bg-white/5 hover:bg-brand-green/10 hover:text-brand-green rounded-full border border-white/10 transition-all cursor-default">AI Creative Studio</span>
                                    <span className="px-3 py-1.5 bg-white/5 hover:bg-brand-green/10 hover:text-brand-green rounded-full border border-white/10 transition-all cursor-default">AI Call Center Agent</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {showRobot && (
                        <div className="hidden lg:flex justify-center items-center w-full h-[540px]">
                            <div className={`relative flex items-center justify-center w-[450px] h-[450px] ${animationVariant || 'animate-float-slow'}`}>
                                <div className="absolute inset-0 bg-brand-green/10 rounded-full blur-[80px] animate-pulse-glow" aria-hidden="true" />
                                <Image
                                    src={customImage || "/images/robot-mascot-transparent.png"}
                                    alt={customImage ? "Service Visual" : "MeandRobo AI Mascot"}
                                    width={450}
                                    height={450}
                                    className="relative z-10 drop-shadow-[0_20px_40px_rgba(12,206,107,0.25)] object-contain"
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
