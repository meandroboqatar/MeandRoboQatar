interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "green" | "outline";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
    const variants = {
        default: "bg-brand-surface-light text-brand-muted border-brand-surface-border",
        green: "bg-brand-green/10 text-brand-green border-brand-green/20",
        outline: "bg-transparent text-brand-muted border-brand-surface-border",
    };

    return (
        <span
            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${variants[variant]}`}
        >
            {children}
        </span>
    );
}
