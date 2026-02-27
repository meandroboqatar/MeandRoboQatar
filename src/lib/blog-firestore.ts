import { getAdminDb } from "@/lib/firebase-admin";
import { blogPosts as _staticPosts } from "@/lib/blog-data";

export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    content: string;
    relatedSolutions: { title: string; href: string }[];
    tags: string[];
    coverImageUrl: string;
    seoTitle: string;
    seoDescription: string;
}

// Strip metadata field from static posts (it uses Next Metadata type that's
// incompatible with a plain Record). Metadata is now built in generateMetadata.
const staticPosts: BlogPost[] = _staticPosts.map(({ slug, title, excerpt, date, readTime, content, relatedSolutions }) => ({
    slug, title, excerpt, date, readTime, content, relatedSolutions,
    tags: [], coverImageUrl: "", seoTitle: "", seoDescription: "",
}));

/**
 * Fetch published blog posts from Firestore.
 * Falls back to static blog-data.ts if Firestore is empty or unavailable.
 */
export async function getPublishedPosts(): Promise<BlogPost[]> {
    try {
        const db = getAdminDb();
        const snapshot = await db
            .collection("posts")
            .where("status", "==", "published")
            .orderBy("createdAt", "desc")
            .get();

        if (snapshot.empty) {
            // Graceful fallback to static data
            return staticPosts;
        }

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                slug: data.slug,
                title: data.title,
                excerpt: data.excerpt || "",
                date: data.publishedAt?.toDate?.()?.toISOString()?.split("T")[0]
                    || data.createdAt?.toDate?.()?.toISOString()?.split("T")[0]
                    || "2025-01-01",
                readTime: data.readTime || "5 min read",
                content: data.content || "",
                relatedSolutions: data.relatedSolutions || [],
                tags: Array.isArray(data.tags) ? data.tags : [],
                coverImageUrl: data.coverImageUrl || "",
                seoTitle: data.seoTitle || "",
                seoDescription: data.seoDescription || "",
            };
        });
    } catch (error) {
        console.warn("[blog] Firestore fetch failed, using static data:", error);
        return staticPosts;
    }
}

/**
 * Fetch a single published post by slug from Firestore.
 * Falls back to static blog-data.ts.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const db = getAdminDb();
        const snapshot = await db
            .collection("posts")
            .where("slug", "==", slug)
            .where("status", "==", "published")
            .limit(1)
            .get();

        if (snapshot.empty) {
            // Fallback to static data
            return staticPosts.find((p) => p.slug === slug) || null;
        }

        const doc = snapshot.docs[0];
        const data = doc.data();
        return {
            slug: data.slug,
            title: data.title,
            excerpt: data.excerpt || "",
            date: data.publishedAt?.toDate?.()?.toISOString()?.split("T")[0]
                || data.createdAt?.toDate?.()?.toISOString()?.split("T")[0]
                || "2025-01-01",
            readTime: data.readTime || "5 min read",
            content: data.content || "",
            relatedSolutions: data.relatedSolutions || [],
            tags: Array.isArray(data.tags) ? data.tags : [],
            coverImageUrl: data.coverImageUrl || "",
            seoTitle: data.seoTitle || "",
            seoDescription: data.seoDescription || "",
        };
    } catch (error) {
        console.warn("[blog] Firestore slug fetch failed, using static data:", error);
        return staticPosts.find((p) => p.slug === slug) || null;
    }
}

/**
 * Get all published slugs for static generation.
 */
export async function getAllPublishedSlugs(): Promise<string[]> {
    try {
        const db = getAdminDb();
        const snapshot = await db
            .collection("posts")
            .where("status", "==", "published")
            .select("slug")
            .get();

        if (snapshot.empty) {
            return staticPosts.map((p) => p.slug);
        }

        return snapshot.docs.map((doc) => doc.data().slug);
    } catch {
        return staticPosts.map((p) => p.slug);
    }
}
