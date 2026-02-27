import Link from "next/link";

interface SolutionCardProps {
    icon: string;
    title: string;
    description: string;
    href: string;
}

export function SolutionCard({ icon, title, description, href }: SolutionCardProps) {
    return (
        <Link href={href} className="group card-glow flex flex-col h-full">
            <div className="w-12 h-12 rounded-brand bg-brand-green-dim flex items-center justify-center text-2xl mb-4 group-hover:bg-brand-green-glow transition-colors duration-300">
                {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-green transition-colors duration-300">
                {title}
            </h3>
            <p className="text-brand-muted text-sm leading-relaxed flex-1">
                {description}
            </p>
            <span className="inline-flex items-center gap-1 text-brand-green text-sm font-medium mt-4 group-hover:gap-2 transition-all duration-300">
                Learn More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </span>
        </Link>
    );
}
