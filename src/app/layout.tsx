import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HideOnAdmin } from "@/components/HideOnAdmin";

import { ChatWidget } from "@/components/ChatWidget";
import { JsonLd } from "@/components/JsonLd";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://meandrobo.com.qa";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "AI Business Automation in Qatar | MeandRobo",
        template: "%s | MeandRobo",
    },
    description:
        "MeandRobo provides AI-powered ERP, customer agents, call center solutions, and creative tools for SMEs in Qatar. Book a free consultation.",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: SITE_URL,
        siteName: "MeandRobo",
        title: "AI Business Automation in Qatar | MeandRobo",
        description:
            "MeandRobo provides AI-powered ERP, customer agents, call center solutions, and creative tools for SMEs in Qatar.",
        images: [{ url: "/images/og-default.png", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Business Automation in Qatar | MeandRobo",
        description:
            "MeandRobo provides AI-powered ERP, customer agents, call center solutions, and creative tools for SMEs in Qatar.",
        images: ["/images/og-default.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true },
    },
};

const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MEANDROBO ARTIFICIAL INTELLIGENCE SOLUTIONS",
    alternateName: "MeandRobo",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    contactPoint: {
        "@type": "ContactPoint",
        telephone: "+974-77558819",
        contactType: "sales",
        areaServed: "QA",
        availableLanguage: "English",
    },
    address: {
        "@type": "PostalAddress",
        addressLocality: "Doha",
        addressCountry: "QA",
    },
    sameAs: ["https://wa.me/97477558819"],
};

const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MeandRobo",
    url: SITE_URL,
    potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/solutions?q={search_term_string}`,
        "query-input": "required name=search_term_string",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="font-sans bg-white text-brand-text min-h-screen flex flex-col">
                <JsonLd data={organizationSchema} />
                <JsonLd data={websiteSchema} />
                <HideOnAdmin>
                    <Navbar />
                </HideOnAdmin>
                <main className="flex-1">{children}</main>
                <HideOnAdmin>
                    <Footer />
                    <ChatWidget />
                </HideOnAdmin>
            </body>
        </html>
    );
}
