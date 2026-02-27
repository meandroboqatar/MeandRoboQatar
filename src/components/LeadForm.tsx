"use client";

import { useState, FormEvent } from "react";

const industries = [
    "Restaurant",
    "Coffee Shop",
    "Salon",
    "Rent-a-Car",
    "Other SME",
];

const solutionOptions = [
    { value: "erp-pfp", label: "ERP + PFP" },
    { value: "ai-customer-agent", label: "AI Customer Agent" },
    { value: "ai-call-center", label: "AI Call Center Agent" },
    { value: "ai-creative-studio", label: "AI Creative Studio" },
    { value: "ai-website-chatbot", label: "AI Website + Chatbot" },
];

interface LeadFormProps {
    sourcePage: string;
    compact?: boolean;
}

export function LeadForm({ sourcePage, compact = false }: LeadFormProps) {
    const [formData, setFormData] = useState({
        fullName: "",
        companyName: "",
        industry: "",
        phone: "",
        email: "",
        interestedSolutions: [] as string[],
        message: "",
        website: "", // honeypot
    });
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = "Invalid email format";
        if (!formData.phone.trim()) newErrors.phone = "Phone is required";
        else if (formData.phone.replace(/\D/g, "").length < 8)
            newErrors.phone = "Phone must be at least 8 digits";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSolutionToggle = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            interestedSolutions: prev.interestedSolutions.includes(value)
                ? prev.interestedSolutions.filter((s) => s !== value)
                : [...prev.interestedSolutions, value],
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setStatus("submitting");

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, sourcePage }),
            });

            if (!res.ok) throw new Error("Submission failed");
            setStatus("success");
            setFormData({
                fullName: "",
                companyName: "",
                industry: "",
                phone: "",
                email: "",
                interestedSolutions: [],
                message: "",
                website: "",
            });
        } catch {
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="card text-center py-12">
                <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-brand-text">Thank you!</h3>
                <p className="text-brand-muted">
                    Our team will get back to you within 24 hours.
                </p>
            </div>
        );
    }

    const inputClasses = "w-full bg-white border border-brand-surface-border rounded-brand px-4 py-3 text-sm text-brand-text placeholder:text-brand-muted/60 focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors";

    return (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Honeypot — hidden from real users */}
            <div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
                <label>
                    Website
                    <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        autoComplete="off"
                        tabIndex={-1}
                    />
                </label>
            </div>

            <div className={`grid gap-5 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
                {/* Full Name */}
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium mb-1.5 text-brand-text">
                        Full Name <span className="text-brand-green">*</span>
                    </label>
                    <input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={inputClasses}
                        placeholder="Your full name"
                    />
                    {errors.fullName && <p className="mt-1 text-red-600 text-xs">{errors.fullName}</p>}
                </div>

                {/* Company */}
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium mb-1.5 text-brand-text">
                        Company Name
                    </label>
                    <input
                        id="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className={inputClasses}
                        placeholder="Your company"
                    />
                </div>

                {/* Industry */}
                <div>
                    <label htmlFor="industry" className="block text-sm font-medium mb-1.5 text-brand-text">
                        Industry
                    </label>
                    <select
                        id="industry"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className={`${inputClasses} appearance-none`}
                    >
                        <option value="">Select your industry</option>
                        {industries.map((ind) => (
                            <option key={ind} value={ind}>{ind}</option>
                        ))}
                    </select>
                </div>

                {/* Phone */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1.5 text-brand-text">
                        Phone <span className="text-brand-green">*</span>
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={inputClasses}
                        placeholder="+974 XXXX XXXX"
                    />
                    {errors.phone && <p className="mt-1 text-red-600 text-xs">{errors.phone}</p>}
                </div>
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-brand-text">
                    Email <span className="text-brand-green">*</span>
                </label>
                <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClasses}
                    placeholder="your@email.com"
                />
                {errors.email && <p className="mt-1 text-red-600 text-xs">{errors.email}</p>}
            </div>

            {/* Interested Solutions (multi-select) */}
            <div>
                <span className="block text-sm font-medium mb-2 text-brand-text">Interested Solutions</span>
                <div className="flex flex-wrap gap-2">
                    {solutionOptions.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleSolutionToggle(opt.value)}
                            className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200 ${formData.interestedSolutions.includes(opt.value)
                                ? "border-brand-green bg-brand-green/10 text-brand-green font-medium"
                                : "border-brand-surface-border text-brand-muted hover:border-brand-green/50"
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Message */}
            <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1.5 text-brand-text">
                    Message
                </label>
                <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`${inputClasses} resize-none`}
                    placeholder="Tell us about your needs..."
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {status === "submitting" ? (
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting...
                    </span>
                ) : (
                    "Book Free Consultation"
                )}
            </button>

            {/* Error fallback */}
            {status === "error" && (
                <div className="text-center p-4 bg-red-50 border border-red-200 rounded-brand">
                    <p className="text-red-600 text-sm mb-2">
                        Something went wrong. Please try again or contact us directly:
                    </p>
                    <a
                        href={`mailto:info@meandrobo.com.qa?subject=Consultation Request&body=Name: ${formData.fullName}%0ACompany: ${formData.companyName}%0APhone: ${formData.phone}%0AMessage: ${formData.message}`}
                        className="text-brand-green text-sm hover:underline"
                    >
                        Send via email →
                    </a>
                </div>
            )}
        </form>
    );
}
