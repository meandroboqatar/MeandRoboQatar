interface SectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
    variant?: "default" | "surface" | "gradient";
}

export function Section({
    children,
    className = "",
    id,
    variant = "default",
}: SectionProps) {
    const bgClass = {
        default: "",
        surface: "bg-brand-surface",
        gradient: "bg-gradient-surface",
    }[variant];

    return (
        <section id={id} className={`section-padding ${bgClass} ${className}`}>
            <div className="container-brand mx-auto">{children}</div>
        </section>
    );
}

export function SectionHeader({
    eyebrow,
    title,
    description,
    centered = true,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    centered?: boolean;
}) {
    return (
        <div className={`mb-12 sm:mb-16 ${centered ? "text-center max-w-3xl mx-auto" : "max-w-2xl"}`}>
            {eyebrow && (
                <span className="inline-block text-brand-green text-sm font-semibold tracking-wider uppercase mb-3">
                    {eyebrow}
                </span>
            )}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                {title}
            </h2>
            {description && (
                <p className="mt-4 text-brand-muted text-lg leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
}
