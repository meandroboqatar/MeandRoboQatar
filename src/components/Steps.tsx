interface Step {
    number: number;
    title: string;
    description: string;
}

interface StepsProps {
    steps: Step[];
}

export function Steps({ steps }: StepsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
                <div key={step.number} className="relative card group">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="w-10 h-10 rounded-full bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green font-bold text-sm group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                            {step.number}
                        </span>
                        <h3 className="font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-brand-muted text-sm leading-relaxed">
                        {step.description}
                    </p>
                </div>
            ))}
        </div>
    );
}
