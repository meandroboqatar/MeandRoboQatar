import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminDb } from "@/lib/firebase-admin";
import { verifyAdmin } from "@/lib/admin-auth";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";

/**
 * GET /api/admin/posts — list all blog posts
 */
export async function GET(request: NextRequest) {
    const admin = await verifyAdmin(request);
    if (admin instanceof Response) return admin;

    try {
        const db = getAdminDb();
        const snapshot = await db
            .collection("posts")
            .orderBy("createdAt", "desc")
            .get();

        const posts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
            updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
            publishedAt: doc.data().publishedAt?.toDate?.()?.toISOString() || null,
        }));

        return NextResponse.json({ posts });
    } catch (error) {
        console.error("[admin/posts] GET error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * POST /api/admin/posts — create new blog post
 */
export async function POST(request: NextRequest) {
    const admin = await verifyAdmin(request);
    if (admin instanceof Response) return admin;

    try {
        const body = await request.json();
        const {
            title, slug, excerpt, content, readTime, status,
            relatedSolutions, tags, coverImageUrl,
            seoTitle, seoDescription,
        } = body;

        if (!title || !slug || !content) {
            return NextResponse.json(
                { error: "title, slug, and content are required" },
                { status: 400 }
            );
        }

        // Validate slug format
        if (!/^[a-z0-9-]+$/.test(slug)) {
            return NextResponse.json(
                { error: "Slug must be lowercase letters, numbers, and hyphens only" },
                { status: 400 }
            );
        }

        const db = getAdminDb();

        // Check for duplicate slug
        const existing = await db
            .collection("posts")
            .where("slug", "==", slug)
            .limit(1)
            .get();

        if (!existing.empty) {
            return NextResponse.json(
                { error: "A post with this slug already exists" },
                { status: 409 }
            );
        }

        const isPublished = status === "published";

        const postData = {
            title: String(title).trim(),
            slug: String(slug).trim(),
            excerpt: String(excerpt || "").trim(),
            content: String(content),
            readTime: String(readTime || "5 min read"),
            status: isPublished ? "published" : "draft",
            tags: Array.isArray(tags) ? tags.map(String) : [],
            coverImageUrl: coverImageUrl ? String(coverImageUrl).trim() : "",
            seoTitle: seoTitle ? String(seoTitle).trim() : "",
            seoDescription: seoDescription ? String(seoDescription).trim() : "",
            relatedSolutions: Array.isArray(relatedSolutions) ? relatedSolutions : [],
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            publishedAt: isPublished ? FieldValue.serverTimestamp() : null,
        };

        const docRef = await db.collection("posts").add(postData);

        // On-demand revalidation for published posts
        if (isPublished) {
            revalidatePath("/insights");
            revalidatePath(`/insights/${postData.slug}`);
        }

        return NextResponse.json({ id: docRef.id, success: true }, { status: 201 });
    } catch (error) {
        console.error("[admin/posts] POST error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
