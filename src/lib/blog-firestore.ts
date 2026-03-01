import { getAdminDb } from "@/lib/firebase-admin";

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

/**
 * Fetch published blog posts strictly from Firestore.
 */
export async function getPublishedPosts(): Promise<BlogPost[]> {
    try {
        const db = getAdminDb();
        if (!db) return [];
        const snapshot = await db
            .collection("posts")
            .where("status", "==", "published")
            .orderBy("createdAt", "desc")
            .get();

        if (snapshot.empty) {
            return [];
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
        console.error("[blog] Firestore fetch failed:", error);
        return [];
    }
}

/**
 * Fetch a single published post by slug from Firestore.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const db = getAdminDb();
        if (!db) return null;
        const snapshot = await db
            .collection("posts")
            .where("slug", "==", slug)
            .where("status", "==", "published")
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
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
        console.error("[blog] Firestore slug fetch failed:", error);
        return null;
    }
}

/**
 * Get all published slugs for static generation.
 */
export async function getAllPublishedSlugs(): Promise<string[]> {
    try {
        const db = getAdminDb();
        if (!db) return [];
        const snapshot = await db
            .collection("posts")
            .where("status", "==", "published")
            .select("slug")
            .get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map((doc) => doc.data().slug);
    } catch {
        return [];
    }
}
