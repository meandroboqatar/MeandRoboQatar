import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";

// Rate limiting: Map<IP, timestamp[]>
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5; // max 5 submissions per window

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    // Remove expired entries
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
    rateLimitMap.set(ip, recent);
    if (recent.length >= RATE_LIMIT_MAX) return true;
    recent.push(now);
    rateLimitMap.set(ip, recent);
    return false;
}

const ALLOWED_INDUSTRIES = ["Restaurant", "Coffee Shop", "Salon", "Rent-a-Car", "Other SME", ""];
const ALLOWED_SOLUTIONS = [
    "erp-pfp",
    "ai-customer-agent",
    "ai-call-center",
    "ai-creative-studio",
    "ai-website-chatbot",
];

function validatePayload(body: Record<string, unknown>) {
    const errors: string[] = [];

    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const companyName = String(body.companyName || "").trim();
    const industry = String(body.industry || "").trim();
    const message = String(body.message || "").trim();
    const sourcePage = String(body.sourcePage || "").trim();
    const interestedSolutions = Array.isArray(body.interestedSolutions) ? body.interestedSolutions : [];

    if (!fullName || fullName.length > 200) errors.push("Full name is required (max 200 chars)");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Valid email is required");
    if (!phone || phone.replace(/\D/g, "").length < 8) errors.push("Valid phone is required (min 8 digits)");
    if (companyName.length > 200) errors.push("Company name too long (max 200 chars)");
    if (industry && !ALLOWED_INDUSTRIES.includes(industry)) errors.push("Invalid industry");
    if (message.length > 2000) errors.push("Message too long (max 2000 chars)");

    for (const sol of interestedSolutions) {
        if (!ALLOWED_SOLUTIONS.includes(String(sol))) {
            errors.push(`Invalid solution: ${sol}`);
        }
    }

    return {
        errors,
        sanitized: {
            fullName,
            email: email.toLowerCase(),
            phone,
            companyName,
            industry,
            message,
            sourcePage,
            interestedSolutions: interestedSolutions.map(String).filter((s) => ALLOWED_SOLUTIONS.includes(s)),
        },
    };
}

export async function POST(request: NextRequest) {
    try {
        // Payload size check
        const contentLength = request.headers.get("content-length");
        if (contentLength && parseInt(contentLength) > 10240) {
            return NextResponse.json({ error: "Payload too large" }, { status: 413 });
        }

        // Rate limiting
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: "Too many submissions. Please try again later." },
                { status: 429 }
            );
        }

        const body = await request.json();

        // Honeypot check
        if (body.website) {
            // Bot detected — return success to not reveal detection
            return NextResponse.json({ success: true });
        }

        const { errors, sanitized } = validatePayload(body);
        if (errors.length > 0) {
            return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
        }

        // Write to Firestore
        const db = getAdminDb();
        if (!db) {
            console.error("[leads] Firebase Admin not configured — cannot save lead");
            return NextResponse.json(
                { error: "Lead storage is temporarily unavailable. Please contact us directly." },
                { status: 503 }
            );
        }
        await db.collection("leads").add({
            ...sanitized,
            createdAt: FieldValue.serverTimestamp(),
            userAgent: request.headers.get("user-agent") || "",
            ip,
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("Lead submission error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
