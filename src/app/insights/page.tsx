import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/Section";
import { Badge } from "@/components/Badge";
import { getPublishedPosts } from "@/lib/blog-firestore";

export const revalidate = 60; // ISR: re-fetch every 60 seconds

export const metadata: Metadata = {
    title: "AI & Business Insights",
    description:
        "Articles on AI automation, ERP, chatbots, and business growth — tailored for Qatar SMEs.",
    alternates: { canonical: "https://meandrobo.com.qa/insights" },
};

export default async function InsightsPage() {
    const blogPosts = await getPublishedPosts();

    return (
        <Section className="pt-28 sm:pt-32">
            <SectionHeader
                eyebrow="Blog"
                title="AI & Business Insights for Qatar SMEs"
                description="Practical articles on AI automation, financial management, and business growth — written for Qatar's SME market."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/insights/${post.slug}`}
                        className="group card-glow flex flex-col h-full"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Badge variant="green">{post.readTime}</Badge>
                            <span className="text-brand-muted text-xs">
                                {new Date(post.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                        <h2 className="text-lg font-semibold mb-3 group-hover:text-brand-green transition-colors">
                            {post.title}
                        </h2>
                        <p className="text-brand-muted text-sm leading-relaxed flex-1">
                            {post.excerpt}
                        </p>
                        <span className="inline-flex items-center gap-1 text-brand-green text-sm font-medium mt-4 group-hover:gap-2 transition-all duration-300">
                            Read Article
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                    </Link>
                ))}
            </div>
        </Section>
    );
}
