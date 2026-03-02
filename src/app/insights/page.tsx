import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/Section";
import { getPublishedPosts } from "@/lib/blog-firestore";
import { BlogList } from "@/components/BlogList";

export const revalidate = 60; // ISR: re-fetch every 60 seconds

export const metadata: Metadata = {
    title: "Insights for Qatar SMEs | MeandRobo",
    description:
        "Practical articles on AI automation, financial management, chatbots, and business growth — tailored for Qatar SMEs.",
    alternates: { canonical: "https://meandrobo.com.qa/insights" },
};

export default async function InsightsPage() {
    const blogPosts = await getPublishedPosts();

    return (
        <Section className="pt-28 sm:pt-32 pb-24 bg-brand-surface/30">
            <div className="max-w-4xl mx-auto text-center mb-16 px-4">
                <span className="inline-block py-1 px-3 rounded-full bg-brand-green/10 text-brand-green text-sm font-medium mb-4">
                    Blog & Resources
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-text mb-6">
                    Insights for <span className="text-gradient">Qatar SMEs</span>
                </h1>
                <p className="text-lg sm:text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed">
                    Practical guides and strategies on AI automation, lead capture, and business scaling in the Qatari market.
                </p>
            </div>

            <div className="max-w-7xl mx-auto">
                <BlogList posts={blogPosts} />
            </div>
        </Section>
    );
}
