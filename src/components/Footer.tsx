import Link from "next/link";
import Image from "next/image";

const solutionLinks = [
    { href: "/erp-pfp-qatar", label: "AI ERP Solutions" },
    { href: "/ai-website-chatbot-qatar", label: "AI Website & Chatbot" },
    { href: "/ai-customer-agent-qatar", label: "AI Customer Agent" },
    { href: "/ai-social-media-manager-qatar", label: "AI Social Media Manager" },
    { href: "/ai-creative-studio-qatar", label: "AI Creative Studio" },
    { href: "/ai-call-center-agent-qatar", label: "AI Call Center Agent" },
    { href: "/web-development-qatar", label: "Web Development" },
    { href: "/ai-business-plan-generator-qatar", label: "AI Business Plan Generator" },
];

const companyLinks = [
    { href: "/about", label: "About Us" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/insights", label: "Insights" },
    { href: "/contact", label: "Contact" },
];

export function Footer() {
    return (
        <footer className="bg-brand-surface border-t border-brand-surface-border">
            <div className="container-brand mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link href="/" className="inline-block mb-4">
                            <Image
                                src="/images/logo.png"
                                alt="MeandRobo logo"
                                width={140}
                                height={70}
                                className="h-9 w-auto"
                            />
                        </Link>
                        <p className="text-brand-muted text-sm leading-relaxed mb-4">
                            Pioneering AI-powered business automation for SMEs in Qatar. We bridge the gap between human expertise and robotic efficiency.
                        </p>
                        <p className="text-brand-muted text-xs">
                            MEANDROBO ARTIFICIAL INTELLIGENCE SOLUTIONS
                        </p>
                    </div>

                    {/* Solutions */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-brand-text">
                            Solutions
                        </h4>
                        <ul className="space-y-3">
                            {solutionLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-brand-muted text-sm hover:text-brand-green transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-brand-text">
                            Company
                        </h4>
                        <ul className="space-y-3">
                            {companyLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-brand-muted text-sm hover:text-brand-green transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-brand-text">
                            Contact
                        </h4>
                        <ul className="space-y-3 text-sm text-brand-muted">
                            <li>
                                <a
                                    href="tel:+97477558819"
                                    className="hover:text-brand-green transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    +974 77558819
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:info@meandrobo.com.qa"
                                    className="hover:text-brand-green transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    info@meandrobo.com.qa
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Doha, Qatar
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-8 border-t border-brand-surface-border flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-brand-muted text-xs">
                        © {new Date().getFullYear()} MEANDROBO ARTIFICIAL INTELLIGENCE SOLUTIONS. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy-policy" className="text-brand-muted hover:text-brand-green text-xs transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms-of-service" className="text-brand-muted hover:text-brand-green text-xs transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
