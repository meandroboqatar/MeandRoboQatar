import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://meandrobo.com.qa";

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes = [
        { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
        { url: `${SITE_URL}/solutions`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
        { url: `${SITE_URL}/erp-pfp-qatar`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
        { url: `${SITE_URL}/ai-customer-agent-qatar`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
        { url: `${SITE_URL}/ai-call-center-agent-qatar`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
        { url: `${SITE_URL}/ai-creative-studio-qatar`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
        { url: `${SITE_URL}/ai-website-chatbot-qatar`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
        { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
        { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
        { url: `${SITE_URL}/case-studies`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
        { url: `${SITE_URL}/insights`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    ];

    const blogRoutes = blogPosts.map((post) => ({
        url: `${SITE_URL}/insights/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "yearly" as const,
        priority: 0.6,
    }));

    return [...staticRoutes, ...blogRoutes];
}
