import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy – MeandRobo Artificial Intelligence Solutions",
    description: "Privacy Policy for MeandRobo Artificial Intelligence Solutions",
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen py-24 sm:py-32 bg-brand-surface">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-text mb-8">
                    Privacy Policy
                </h1>

                <div className="text-brand-muted leading-relaxed space-y-6">
                    <p>
                        MeandRobo Artificial Intelligence Solutions (“MeandRobo”, “we”, “our”, “us”) respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit meandrobo.com.qa, request a consultation, use our contact forms, or interact with our AI chatbot.
                    </p>

                    <p>
                        <strong>Contact:</strong><br />
                        Email: <a href="mailto:info@meandrobo.com.qa" className="text-brand-green hover:underline">info@meandrobo.com.qa</a><br />
                        Location: Doha, Qatar
                    </p>

                    <h2 className="text-2xl font-semibold text-brand-text mt-12 mb-6">1. Information We Collect</h2>
                    <p>We may collect the following categories of information:</p>

                    <h3 className="text-xl font-medium text-brand-text mt-8 mb-4">A) Information you provide</h3>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>Name, company name, job title (if provided)</li>
                        <li>Email address</li>
                        <li>Phone number (including Qatar phone validation where applicable)</li>
                        <li>Inquiry details and messages submitted via contact forms or WhatsApp</li>
                        <li>Any information you voluntarily share during a call or consultation request</li>
                    </ul>

                    <h3 className="text-xl font-medium text-brand-text mt-8 mb-4">B) Chatbot interactions</h3>
                    <p>When you use the MeandRobo website chatbot, we may collect:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>Email address and phone number (to qualify and follow up on leads)</li>
                        <li>Your messages and chatbot responses (chat transcript)</li>
                        <li>Page context (which page you were browsing when you started the chat)</li>
                        <li>Technical details for fraud prevention and security (e.g., timestamp, browser/device info)</li>
                    </ul>

                    <div className="p-4 bg-brand-surface-border/30 rounded-lg text-sm border border-brand-surface-border text-brand-text mt-4 mb-6">
                        <strong>Important:</strong> Please do not share confidential financial data, passwords, bank details, or other highly sensitive information in the chatbot.
                    </div>

                    <h3 className="text-xl font-medium text-brand-text mt-8 mb-4">C) Automatic data collection</h3>
                    <p>When you browse our website, we may automatically collect:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>IP address and approximate location (derived from IP)</li>
                        <li>Browser and device type</li>
                        <li>Pages visited and interaction data (analytics)</li>
                        <li>Referrer URLs and basic traffic attribution</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-brand-text mt-12 mb-6">2. How We Use Your Information</h2>
                    <p>We use your information to:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>Provide, manage, and improve our AI-based business solutions and website experience</li>
                        <li>Respond to inquiries and provide consultations</li>
                        <li>Qualify leads and route consultation requests to our team</li>
                        <li>Improve chatbot performance using approved FAQ content and service information</li>
                        <li>Maintain security, detect fraud, and prevent abuse</li>
                        <li>Comply with legal obligations and enforce our Terms</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-brand-text mt-12 mb-6">3. Legal Basis for Processing</h2>
                    <p>Where applicable, we process information based on:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>Your consent (e.g., when you submit a form or chat)</li>
                        <li>Our legitimate interests (e.g., responding to business inquiries, improving services, site security)</li>
                        <li>Contractual necessity (when delivering services under an agreement)</li>
                        <li>Legal obligations (where required)</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-brand-text mt-12 mb-6">4. Sharing and Disclosure</h2>
                    <p>We do not sell your personal data.</p>
                    <p>We may share data with:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>Service providers that support hosting, analytics, communications, and IT operations</li>
                        <li>AI and cloud infrastructure providers needed to operate the site and chatbot (limited to what is required)</li>
                        <li>Legal authorities if required by law, regulation, or to protect rights and security</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-brand-text mt-12 mb-6">5. Data Storage and International Transfers</h2>
                    <p>
                        Our website and systems may use cloud services. As a result, your data may be processed in locations outside Qatar depending on service provider infrastructure. We apply reasonable safeguards to protect information.
                    </p>

                    <h2 className="text-2xl font-semibold text-brand-text mt-12 mb-6">6. Data Retention</h2>
                    <p>We retain personal data only as long as reasonably necessary for:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>Business communication and consultation follow-up</li>
                        <li>Service delivery and documentation</li>
                        <li>Security, legal compliance, dispute resolution, and enforcement</li>
                    </ul>
                    <p>You may request deletion (subject to legal requirements).</p>

                    <h2 className="text-2xl font-semibold text-brand-text mt-12 mb-6">7. Your Rights and Choices</h2>
                    <p>You may request:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>Access to your personal information</li>
                        <li>Correction of inaccurate information</li>
                        <li>Deletion of your information (subject to lawful exceptions)</li>
                        <li>Restriction or objection to certain processing</li>
                        <li>Withdrawal of consent (where processing relies on consent)</li>
                    </ul>
                    <p>Requests: <a href="mailto:info@meandrobo.com.qa" className="text-brand-green hover:underline">info@meandrobo.com.qa</a></p>

                    <h2 className="text-2xl font-semibold text-brand-text mt-12 mb-6">8. Cookies and Analytics</h2>
                    <p>
                        We may use cookies and similar technologies for site functionality and analytics. You can manage cookies through browser settings. Disabling cookies may limit certain site features.
                    </p>

                    <h2 className="text-2xl font-semibold text-brand-text mt-12 mb-6">9. Security</h2>
                    <p>
                        We implement reasonable technical and organizational safeguards. No system is fully secure; we cannot guarantee absolute security.
                    </p>

                    <h2 className="text-2xl font-semibold text-brand-text mt-12 mb-6">10. Children’s Privacy</h2>
                    <p>
                        Our services are designed for businesses and professional users. We do not knowingly collect data from children.
                    </p>

                    <h2 className="text-2xl font-semibold text-brand-text mt-12 mb-6">11. Third-Party Links</h2>
                    <p>
                        Our website may link to third-party platforms (e.g., WhatsApp). We are not responsible for their privacy practices.
                    </p>

                    <h2 className="text-2xl font-semibold text-brand-text mt-12 mb-6">12. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy. Updates will be posted on this page.
                    </p>

                    <h2 className="text-2xl font-semibold text-brand-text mt-12 mb-6">13. Contact Us</h2>
                    <p>
                        MeandRobo Artificial Intelligence Solutions<br />
                        Doha, Qatar<br />
                        Email: <a href="mailto:info@meandrobo.com.qa" className="text-brand-green hover:underline">info@meandrobo.com.qa</a>
                    </p>
                </div>
            </div>
        </main>
    );
}
