import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { verifyAdmin } from "@/lib/admin-auth";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";

/**
 * GET /api/admin/leads — list leads (paginated, newest first)
 * Query params: ?limit=25&startAfter=<docId>&status=<status>&search=<text>&source=<source>&dateFrom=<iso>&dateTo=<iso>&assignedTo=<name>
 */
export async function GET(request: NextRequest) {
    const admin = await verifyAdmin(request);
    if (admin instanceof Response) return admin;

    try {
        const db = getAdminDb();
        if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
        const { searchParams } = new URL(request.url);
        const limit = Math.min(Number(searchParams.get("limit")) || 25, 100);
        const startAfter = searchParams.get("startAfter");
        const statusFilter = searchParams.get("status");
        const sourceFilter = searchParams.get("source");
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");
        const assignedToFilter = searchParams.get("assignedTo");
        const search = searchParams.get("search")?.toLowerCase().trim();

        let query = db
            .collection("leads")
            .orderBy("createdAt", "desc");

        // Filter by status if provided
        if (statusFilter && ["new", "contacted", "qualified", "closed"].includes(statusFilter)) {
            query = query.where("status", "==", statusFilter);
        }

        // Filter by source if provided
        const validSources = ["manual", "chatbot", "contact-form", "consultation-form"];
        if (sourceFilter && validSources.includes(sourceFilter)) {
            query = query.where("source", "==", sourceFilter);
        }

        // Pagination
        if (startAfter) {
            const startDoc = await db.collection("leads").doc(startAfter).get();
            if (startDoc.exists) {
                query = query.startAfter(startDoc);
            }
        }

        // Fetch a larger batch if search/date/assigned filter is active (client-side filtering)
        const needsClientFilter = !!(search || dateFrom || dateTo || assignedToFilter);
        const fetchLimit = needsClientFilter ? Math.min(limit * 4, 200) : limit;
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

        // Client-side date range filter
        if (dateFrom) {
            const from = new Date(dateFrom).getTime();
            leads = leads.filter((l) => l.createdAt && new Date(l.createdAt).getTime() >= from);
        }
        if (dateTo) {
            const to = new Date(dateTo).getTime() + 86400000; // include full day
            leads = leads.filter((l) => l.createdAt && new Date(l.createdAt).getTime() < to);
        }

        // Client-side assigned filter
        if (assignedToFilter) {
            leads = leads.filter((l) =>
                (l.assignedTo || "").toLowerCase() === assignedToFilter.toLowerCase()
            );
        }

        // Client-side search filter
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
        }

        if (needsClientFilter) {
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
 * POST /api/admin/leads — create a new lead manually
 */
export async function POST(request: NextRequest) {
    const admin = await verifyAdmin(request);
    if (admin instanceof Response) return admin;

    try {
        const body = await request.json();
        const { fullName, email, phone, companyName, industry, message, status, assignedTo, notes } = body;

        if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
            return NextResponse.json({ error: "Full name is required" }, { status: 400 });
        }

        const db = getAdminDb();
        if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });

        const leadData: Record<string, unknown> = {
            fullName: String(fullName).trim(),
            email: email ? String(email).trim().toLowerCase() : "",
            phone: phone ? String(phone).trim() : "",
            companyName: companyName ? String(companyName).trim() : "",
            industry: industry ? String(industry).trim() : "",
            message: message ? String(message).trim() : "",
            status: status || "new",
            assignedTo: assignedTo ? String(assignedTo).trim() : "",
            notes: notes ? String(notes).trim() : "",
            source: "manual",
            sourcePage: "admin",
            createdAt: FieldValue.serverTimestamp(),
        };

        const docRef = await db.collection("leads").add(leadData);

        return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
    } catch (error) {
        console.error("[admin/leads] POST error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * PATCH /api/admin/leads — update lead fields
 * Body: { id: string, fullName?, email?, phone?, companyName?, industry?, message?, status?, notes?, assignedTo?, lastContactAt? }
 */
export async function PATCH(request: NextRequest) {
    const admin = await verifyAdmin(request);
    if (admin instanceof Response) return admin;

    try {
        const body = await request.json();
        const { id, ...fields } = body;

        if (!id || typeof id !== "string") {
            return NextResponse.json({ error: "Lead ID required" }, { status: 400 });
        }

        const validStatuses = ["new", "contacted", "qualified", "closed"];
        const updates: Record<string, unknown> = {};

        // Editable fields
        const stringFields = ["fullName", "email", "phone", "companyName", "industry", "message", "notes", "assignedTo"];
        for (const key of stringFields) {
            if (fields[key] !== undefined) {
                updates[key] = String(fields[key]).trim();
            }
        }

        if (fields.status !== undefined) {
            if (!validStatuses.includes(fields.status)) {
                return NextResponse.json(
                    { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
                    { status: 400 }
                );
            }
            updates.status = fields.status;
        }

        if (fields.interestedSolutions !== undefined) {
            updates.interestedSolutions = Array.isArray(fields.interestedSolutions)
                ? fields.interestedSolutions.map(String)
                : [];
        }

        if (fields.lastContactAt !== undefined) {
            updates.lastContactAt = fields.lastContactAt
                ? new Date(fields.lastContactAt)
                : FieldValue.serverTimestamp();
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }

        updates.updatedAt = FieldValue.serverTimestamp();

        const db = getAdminDb();
        if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
        await db.collection("leads").doc(id).update(updates);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[admin/leads] PATCH error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/leads — delete a lead
 * Body: { id: string }
 */
export async function DELETE(request: NextRequest) {
    const admin = await verifyAdmin(request);
    if (admin instanceof Response) return admin;

    try {
        const body = await request.json();
        const { id } = body;

        if (!id || typeof id !== "string") {
            return NextResponse.json({ error: "Lead ID required" }, { status: 400 });
        }

        const db = getAdminDb();
        if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });

        const docRef = db.collection("leads").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        }

        await docRef.delete();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[admin/leads] DELETE error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
