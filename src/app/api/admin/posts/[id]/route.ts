import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminDb } from "@/lib/firebase-admin";
import { verifyAdmin } from "@/lib/admin-auth";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";

/**
 * GET /api/admin/posts/[id] — get single post
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const admin = await verifyAdmin(request);
    if (admin instanceof Response) return admin;

    try {
        const db = getAdminDb();
        const doc = await db.collection("posts").doc(params.id).get();

        if (!doc.exists) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const data = doc.data()!;
        return NextResponse.json({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
            publishedAt: data.publishedAt?.toDate?.()?.toISOString() || null,
        });
    } catch (error) {
        console.error("[admin/posts/id] GET error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * PUT /api/admin/posts/[id] — update post
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const admin = await verifyAdmin(request);
    if (admin instanceof Response) return admin;

    try {
        const body = await request.json();
        const db = getAdminDb();
        const docRef = db.collection("posts").doc(params.id);

        const doc = await docRef.get();
        if (!doc.exists) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const existingData = doc.data()!;

        // If slug is being changed, check for duplicates
        if (body.slug && body.slug !== existingData.slug) {
            if (!/^[a-z0-9-]+$/.test(body.slug)) {
                return NextResponse.json(
                    { error: "Slug must be lowercase letters, numbers, and hyphens only" },
                    { status: 400 }
                );
            }
            const existing = await db
                .collection("posts")
                .where("slug", "==", body.slug)
                .limit(1)
                .get();
            if (!existing.empty) {
                return NextResponse.json(
                    { error: "A post with this slug already exists" },
                    { status: 409 }
                );
            }
        }

        const allowedFields = [
            "title", "slug", "excerpt", "content",
            "readTime", "status", "relatedSolutions",
            "tags", "coverImageUrl", "seoTitle", "seoDescription",
        ];

        const updates: Record<string, unknown> = {
            updatedAt: FieldValue.serverTimestamp(),
        };

        for (const key of allowedFields) {
            if (body[key] !== undefined) {
                updates[key] = body[key];
            }
        }

        // Auto-set publishedAt when transitioning to published
        if (body.status === "published" && existingData.status !== "published") {
            updates.publishedAt = FieldValue.serverTimestamp();
        }

        await docRef.update(updates);

        // On-demand revalidation
        const currentSlug = existingData.slug;
        const newSlug = updates.slug || currentSlug;
        revalidatePath("/insights");
        if (currentSlug) revalidatePath(`/insights/${currentSlug}`);
        if (newSlug && newSlug !== currentSlug) revalidatePath(`/insights/${newSlug}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[admin/posts/id] PUT error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/posts/[id] — delete post
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const admin = await verifyAdmin(request);
    if (admin instanceof Response) return admin;

    try {
        const db = getAdminDb();
        const docRef = db.collection("posts").doc(params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Get slug before deleting for revalidation
        const slug = doc.data()?.slug;

        await docRef.delete();

        // On-demand revalidation
        revalidatePath("/insights");
        if (slug) revalidatePath(`/insights/${slug}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[admin/posts/id] DELETE error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
