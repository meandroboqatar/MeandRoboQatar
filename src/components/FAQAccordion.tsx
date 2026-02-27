"use client";

import { useState } from "react";

export interface FAQItem {
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    items: FAQItem[];
    className?: string;
}

export function FAQAccordion({ items, className = "" }: FAQAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className={`space-y-3 ${className}`} role="list">
            {items.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                    <div
                        key={index}
                        role="listitem"
                        className={`border rounded-brand transition-all duration-300 ${isOpen
                            ? "border-brand-green/30 bg-brand-surface"
                            : "border-brand-surface-border bg-white"
                            }`}
                    >
                        <button
                            type="button"
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            className="w-full flex items-center justify-between p-5 text-left"
                            aria-expanded={isOpen}
                            id={`faq-trigger-${index}`}
                            aria-controls={`faq-panel-${index}`}
                        >
                            <span className="text-sm sm:text-base font-medium pr-4">
                                {item.question}
                            </span>
                            <svg
                                className={`w-5 h-5 shrink-0 text-brand-green transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div
                            id={`faq-panel-${index}`}
                            role="region"
                            aria-labelledby={`faq-trigger-${index}`}
                            className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                }`}
                        >
                            <div className="px-5 pb-5 text-brand-muted text-sm leading-relaxed">
                                {item.answer}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
