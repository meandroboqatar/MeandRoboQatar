import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/chat/knowledge";
import { getAdminDb } from "@/lib/firebase-admin";
import { retrieveTopFaqs } from "@/lib/chat/faq-rag";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";

/* ── Rate Limiter (reuses same pattern as /api/leads) ─────────────── */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
        return false;
    }
    entry.count++;
    return entry.count > RATE_LIMIT;
}

/* ── Validation ───────────────────────────────────────────────────── */
const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_ITEMS = 10;
const MAX_HISTORY_TEXT_LENGTH = 500;

interface HistoryEntry {
    role: "user" | "model";
    text: string;
}

interface ValidatedPayload {
    message: string;
    page?: string;
    stage?: string;
    sessionId?: string;
    history: HistoryEntry[];
}

function validatePayload(body: unknown): ValidatedPayload | null {
    if (!body || typeof body !== "object") return null;
    const obj = body as Record<string, unknown>;
    if (typeof obj.message !== "string") return null;

    const message = obj.message.trim();
    if (!message || message.length > MAX_MESSAGE_LENGTH) return null;

    const page = typeof obj.page === "string" ? obj.page.trim() : undefined;
    const stage = typeof obj.stage === "string" ? obj.stage : "collect_email";
    const sessionId = typeof obj.sessionId === "string" ? obj.sessionId : "unknown";

    // Validate optional history array
    const history: HistoryEntry[] = [];
    if (Array.isArray(obj.history)) {
        const items = obj.history.slice(-MAX_HISTORY_ITEMS);
        for (const item of items) {
            if (
                typeof item === "object" &&
                item !== null &&
                typeof (item as Record<string, unknown>).text === "string" &&
                typeof (item as Record<string, unknown>).role === "string"
            ) {
                const role = (item as Record<string, unknown>).role as string;
                const text = ((item as Record<string, unknown>).text as string).trim();
                if (
                    (role === "user" || role === "model") &&
                    text.length > 0 &&
                    text.length <= MAX_HISTORY_TEXT_LENGTH
                ) {
                    history.push({ role, text });
                }
            }
        }
    }

    return { message, page, stage, sessionId, history };
}

/* ── POST Handler ─────────────────────────────────────────────────── */
export async function POST(request: NextRequest) {
    // Size guard
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 10_000) {
        return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    // Rate limit
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
        return NextResponse.json(
            { error: "Too many requests. Please wait a few minutes." },
            { status: 429 }
        );
    }

    // Parse & validate
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const payload = validatePayload(body);
    if (!payload) {
        return NextResponse.json(
            { error: "Invalid request. 'message' is required (max 1000 chars)." },
            { status: 400 }
        );
    }

    // Check API key (server-only)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("[chat] GEMINI_API_KEY is not set");
        return NextResponse.json({ error: "Chat is temporarily unavailable." }, { status: 503 });
    }

    // ── FIRESTORE & GATE LOGIC ──────────────────────────────────────
    const db = getAdminDb();
    const chatRef = db?.collection("leads_chat").doc(payload.sessionId || "unknown");

    if (chatRef) {
        await chatRef.set({
            lastUpdated: FieldValue.serverTimestamp(),
            page: payload.page || "unknown",
            ip: ip,
        }, { merge: true });

        await chatRef.collection("messages").add({
            role: "user",
            content: payload.message,
            timestamp: FieldValue.serverTimestamp(),
        });
    }

    if (payload.stage === "collect_email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(payload.message)) {
            if (chatRef) await chatRef.set({ email: payload.message }, { merge: true });
            const reply = "Great, thanks! Please provide your Qatar phone number to continue.";
            if (chatRef) {
                await chatRef.collection("messages").add({
                    role: "assistant",
                    content: reply,
                    timestamp: FieldValue.serverTimestamp(),
                });
            }
            return NextResponse.json({ reply, stage: "collect_phone" });
        } else {
            const reply = "Before I can assist, please share a valid email address.";
            return NextResponse.json({ reply, stage: "collect_email" });
        }
    }

    if (payload.stage === "collect_phone") {
        const phone = payload.message.replace(/\s+/g, "");
        const isQatar = phone.match(/^(?:\+?974)?\d{8}$/);

        if (isQatar) {
            if (chatRef) await chatRef.set({ phone: phone }, { merge: true });
            const reply = "Perfect, thank you! How can I help you today?";
            if (chatRef) {
                await chatRef.collection("messages").add({
                    role: "assistant",
                    content: reply,
                    timestamp: FieldValue.serverTimestamp(),
                });
            }
            return NextResponse.json({ reply, stage: "ready" });
        } else {
            const reply = "Please provide a valid Qatar phone number (e.g. +974 77558819 or 8 local digits).";
            return NextResponse.json({ reply, stage: "collect_phone" });
        }
    }

    // Build messages
    const topFaqs = retrieveTopFaqs(payload.message, 2).map((r) => ({
        question: r.faq.question,
        answer: r.faq.answer,
        service: r.serviceName,
        id: r.faq.id,
    }));

    const systemPrompt = buildSystemPrompt(topFaqs);
    const userMessage = payload.page
        ? `[User is on page: ${payload.page}] ${payload.message}`
        : payload.message;

    // ── Model config ──────────────────────────────────────────────
    const PRIMARY_MODEL = "gemini-flash-latest";
    const FALLBACK_MODEL = "gemini-2.5-flash";
    const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

    // Build multi-turn contents from history + current message
    const contents: { role: string; parts: { text: string }[] }[] = [];

    // Add validated history entries
    for (const entry of payload.history) {
        contents.push({
            role: entry.role,
            parts: [{ text: entry.text }],
        });
    }

    // Add current user message at the end
    contents.push({
        role: "user",
        parts: [{ text: userMessage }],
    });

    const requestBody = JSON.stringify({
        system_instruction: {
            parts: [{ text: systemPrompt }],
        },
        contents,
        generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 400,
            topP: 0.8,
        },
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" },
        ],
    });

    const isDev = process.env.NODE_ENV !== "production";

    async function callGemini(model: string): Promise<Response> {
        return fetch(`${BASE_URL}/${model}:generateContent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey!,
            },
            body: requestBody,
        });
    }

    try {
        let geminiResponse = await callGemini(PRIMARY_MODEL);

        // Fallback: if primary returns 404 (model not found), retry with stable model
        if (geminiResponse.status === 404) {
            const errBody = await geminiResponse.text();
            const isModelNotFound =
                errBody.toLowerCase().includes("model") &&
                errBody.toLowerCase().includes("not found");

            if (isModelNotFound) {
                console.warn(`[chat] Primary model "${PRIMARY_MODEL}" returned 404, falling back to "${FALLBACK_MODEL}"`);
                geminiResponse = await callGemini(FALLBACK_MODEL);
            } else {
                // 404 but not model-related → surface error
                console.error("[chat] Gemini API 404 (non-model):", errBody);
                return NextResponse.json({
                    error: "Chat is temporarily unavailable. Please try again later.",
                    ...(isDev && { debugStatus: 404, debugBody: errBody.slice(0, 500) }),
                }, { status: 502 });
            }
        }

        if (!geminiResponse.ok) {
            const errText = await geminiResponse.text();
            console.error("[chat] Gemini API error:", geminiResponse.status, errText);

            // Keep the user-facing message generic; log has details.
            return NextResponse.json({
                error: "Chat is temporarily unavailable. Please try again later.",
                ...(isDev && { debugStatus: geminiResponse.status, debugBody: errText.slice(0, 500) }),
            }, { status: 502 });
        }

        const data = await geminiResponse.json();
        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I'm having trouble responding right now. Please contact us directly at +974 77558819.";

        if (chatRef) {
            await chatRef.collection("messages").add({
                role: "assistant",
                content: reply,
                timestamp: FieldValue.serverTimestamp(),
            });
        }

        return NextResponse.json({ reply, stage: "ready" });
    } catch (err) {
        console.error("[chat] Unexpected error:", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}