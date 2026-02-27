import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { verifyAdmin } from "@/lib/admin-auth";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";

/**
 * GET /api/admin/leads — list leads (paginated, newest first)
 * Query params: ?limit=25&startAfter=<docId>&status=<status>&search=<text>
 */
export async function GET(request: NextRequest) {
    const admin = await verifyAdmin(request);
    if (admin instanceof Response) return admin;

    try {
        const db = getAdminDb();
        const { searchParams } = new URL(request.url);
        const limit = Math.min(Number(searchParams.get("limit")) || 25, 100);
        const startAfter = searchParams.get("startAfter");
        const statusFilter = searchParams.get("status");
        const search = searchParams.get("search")?.toLowerCase().trim();

        let query = db
            .collection("leads")
            .orderBy("createdAt", "desc");

        // Filter by status if provided
        if (statusFilter && ["new", "contacted", "qualified", "closed"].includes(statusFilter)) {
            query = query.where("status", "==", statusFilter);
        }

        // Pagination
        if (startAfter) {
            const startDoc = await db.collection("leads").doc(startAfter).get();
            if (startDoc.exists) {
                query = query.startAfter(startDoc);
            }
        }

        // Fetch a larger batch if search is active (client-side filtering)
        const fetchLimit = search ? Math.min(limit * 4, 200) : limit;
        const snapshot = await query.limit(fetchLimit).get();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let leads: Record<string, any>[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
                lastContactAt: data.lastContactAt?.toDate?.()?.toISOString() || null,
            };
        });

        // Client-side search filter (Firestore doesn't support full-text search)
        if (search) {
            leads = leads.filter((lead) => {
                const haystack = [
                    lead.fullName,
                    lead.email,
                    lead.phone,
                    lead.companyName,
                    lead.industry,
                    lead.message,
                    lead.notes,
                ].filter(Boolean).join(" ").toLowerCase();
                return haystack.includes(search);
            });
            leads = leads.slice(0, limit);
        }

        return NextResponse.json({
            leads,
            nextCursor: snapshot.docs.length === fetchLimit
                ? snapshot.docs[snapshot.docs.length - 1].id
                : null,
        });
    } catch (error) {
        console.error("[admin/leads] GET error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * PATCH /api/admin/leads — update lead fields
 * Body: { id: string, status?, notes?, assignedTo?, lastContactAt? }
 */
export async function PATCH(request: NextRequest) {
    const admin = await verifyAdmin(request);
    if (admin instanceof Response) return admin;

    try {
        const body = await request.json();
        const { id, status, notes, assignedTo, lastContactAt } = body;

        if (!id || typeof id !== "string") {
            return NextResponse.json({ error: "Lead ID required" }, { status: 400 });
        }

        const validStatuses = ["new", "contacted", "qualified", "closed"];
        const updates: Record<string, unknown> = {};

        if (status !== undefined) {
            if (!validStatuses.includes(status)) {
                return NextResponse.json(
                    { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
                    { status: 400 }
                );
            }
            updates.status = status;
        }

        if (notes !== undefined) {
            updates.notes = String(notes);
        }

        if (assignedTo !== undefined) {
            updates.assignedTo = String(assignedTo).trim();
        }

        if (lastContactAt !== undefined) {
            updates.lastContactAt = lastContactAt
                ? new Date(lastContactAt)
                : FieldValue.serverTimestamp();
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }

        const db = getAdminDb();
        await db.collection("leads").doc(id).update(updates);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[admin/leads] PATCH error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
