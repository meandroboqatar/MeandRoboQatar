"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent, FormEvent } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

/* ── Types ────────────────────────────────────────────────────────── */
interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    ctas?: { label: string; href: string }[];
}

/* ── Constants ────────────────────────────────────────────────────── */
const STORAGE_KEY = "meandrobo_chat_history_v1";
const STAGE_KEY = "meandrobo_chat_stage_v1";
const SESSION_KEY = "meandrobo_session_id_v1";
const MAX_LOCAL_MESSAGES = 20;
const MAX_API_HISTORY = 10;

const QUICK_REPLIES = [
    { label: "Solutions", message: "What solutions does MeandRobo offer?" },
    { label: "Book Consultation", message: "I'd like to book a free consultation." },
    { label: "Request On-site", message: "I'd like to request an on-site assessment." },
    { label: "Contact", message: "How can I contact MeandRobo?" },
];

const WELCOME_MESSAGE: Message = {
    id: "welcome",
    role: "assistant",
    content:
        "Hi! 👋 I'm the MeandRobo assistant. I can help you explore our AI solutions for Qatar businesses and guide you to book a free consultation. What would you like to know?",
};

/* ── Helpers ──────────────────────────────────────────────────────── */
function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function extractCtasFromReply(text: string): { label: string; href: string }[] {
    const ctas: { label: string; href: string }[] = [];
    const linkRe = /\[([^\]]+)\]\((\/[^\s)]+)\)/g;
    let m: RegExpExecArray | null;
    while ((m = linkRe.exec(text)) !== null) {
        ctas.push({ label: m[1], href: m[2] });
    }
    if (ctas.length === 0 && /\/contact/i.test(text)) {
        ctas.push({ label: "Book Free Consultation", href: "/contact" });
    }
    return ctas;
}

function cleanReply(text: string): string {
    return text.replace(/\[([^\]]+)\]\(\/[^\s)]+\)/g, "$1");
}

/* ── localStorage helpers ─────────────────────────────────────────── */
function loadMessages(): Message[] | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return null;
        // Validate shape: each item needs id, role, content
        const valid = parsed.filter(
            (m: unknown): m is Message =>
                typeof m === "object" &&
                m !== null &&
                typeof (m as Message).id === "string" &&
                typeof (m as Message).content === "string" &&
                ((m as Message).role === "user" || (m as Message).role === "assistant")
        );
        return valid.length > 0 ? valid.slice(-MAX_LOCAL_MESSAGES) : null;
    } catch {
        return null;
    }
}

function saveMessages(messages: Message[]): void {
    try {
        // Only persist role, content, id — strip CTAs to save space
        const slim = messages.slice(-MAX_LOCAL_MESSAGES).map(({ id, role, content }) => ({
            id,
            role,
            content,
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(slim));
    } catch {
        // localStorage full or blocked — graceful no-op
    }
}

/** Build the history array to send to the API (last N messages, mapped for Gemini) */
function buildApiHistory(messages: Message[]): { role: "user" | "model"; text: string }[] {
    // Skip welcome message, take last MAX_API_HISTORY messages
    const relevant = messages
        .filter((m) => m.id !== "welcome")
        .slice(-MAX_API_HISTORY);
    return relevant.map((m) => ({
        role: m.role === "assistant" ? ("model" as const) : ("user" as const),
        text: m.content,
    }));
}

/* ── Component ────────────────────────────────────────────────────── */
export function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const [chatStage, setChatStage] = useState<"collect_email" | "collect_phone" | "ready">("collect_email");
    const [sessionId, setSessionId] = useState<string>("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();

    // Load from localStorage on mount (client only)
    useEffect(() => {
        const saved = loadMessages();
        if (saved && saved.length > 0) {
            setMessages(saved);
        }

        const savedStage = localStorage.getItem(STAGE_KEY) as any;
        if (savedStage) setChatStage(savedStage);

        let savedSession = localStorage.getItem(SESSION_KEY);
        if (!savedSession) {
            savedSession = uid() + uid();
            localStorage.setItem(SESSION_KEY, savedSession);
        }
        setSessionId(savedSession);

        setHydrated(true);
    }, []);

    // Save to localStorage whenever messages change (after hydration)
    useEffect(() => {
        if (hydrated) {
            saveMessages(messages);
        }
    }, [messages, hydrated]);

    // Scroll to bottom when messages update
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    // Focus input when panel opens
    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);

    const clearChat = useCallback(() => {
        setMessages([WELCOME_MESSAGE]);
        setChatStage("collect_email");
        const newSession = uid() + uid();
        setSessionId(newSession);
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.setItem(STAGE_KEY, "collect_email");
            localStorage.setItem(SESSION_KEY, newSession);
        } catch {
            // no-op
        }
    }, []);

    async function sendMessage(text: string) {
        const trimmed = text.trim();
        if (!trimmed || loading) return;

        const userMsg: Message = { id: uid(), role: "user", content: trimmed };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            // Build history from messages BEFORE this user message (exclude welcome)
            const history = buildApiHistory(messages);

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: trimmed,
                    page: pathname,
                    history,
                    stage: chatStage,
                    sessionId: sessionId,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            if (data.stage && data.stage !== chatStage) {
                setChatStage(data.stage);
                try {
                    localStorage.setItem(STAGE_KEY, data.stage);
                } catch { }
            }

            const reply = data.reply as string;
            const ctas = extractCtasFromReply(reply);
            const assistantMsg: Message = {
                id: uid(),
                role: "assistant",
                content: cleanReply(reply),
                ctas: ctas.length > 0 ? ctas : undefined,
            };
            setMessages((prev) => [...prev, assistantMsg]);
        } catch (err) {
            const errorMsg: Message = {
                id: uid(),
                role: "assistant",
                content:
                    err instanceof Error && err.message.includes("Too many")
                        ? "You've sent too many messages. Please wait a few minutes and try again."
                        : "Sorry, I'm having trouble right now. You can reach us directly at +974 77558819 or via WhatsApp.",
                ctas: [
                    { label: "Contact Us", href: "/contact" },
                    { label: "WhatsApp", href: "https://wa.me/97477558819" },
                ],
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        sendMessage(input);
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    }

    // Show quick replies only when not loading, and hide them if we are in the middle of lead capture.
    const showQuickReplies = messages.length <= 1 && !loading && chatStage !== "collect_phone";

    return (
        <>
            {/* ── Toggle Button ──────────────────────────────────────── */}
            <button
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close chat" : "Open chat assistant"}
                className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-brand-green rounded-full flex items-center justify-center shadow-lg hover:bg-brand-green-hover hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
            >
                {open ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                )}
            </button>

            {/* ── Chat Panel ─────────────────────────────────────────── */}
            {open && (
                <div
                    className="fixed bottom-40 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white border border-brand-surface-border rounded-2xl shadow-xl flex flex-col overflow-hidden animate-fade-in"
                    style={{ maxHeight: "min(520px, calc(100vh - 12rem))" }}
                    role="dialog"
                    aria-label="MeandRobo Chat Assistant"
                >
                    {/* Header */}
                    <div className="bg-brand-green px-4 py-3 flex items-center gap-3 shrink-0">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white text-sm font-semibold leading-tight">MeandRobo Assistant</h3>
                            <p className="text-white/70 text-xs">Services & Booking</p>
                        </div>
                        {/* Clear chat */}
                        <button
                            onClick={clearChat}
                            aria-label="Clear chat history"
                            title="Clear chat"
                            className="text-white/50 hover:text-white transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                        {/* Close chat */}
                        <button
                            onClick={() => setOpen(false)}
                            aria-label="Close chat"
                            className="text-white/70 hover:text-white transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 0 }}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user"
                                        ? "bg-brand-green text-white rounded-br-md"
                                        : "bg-brand-surface text-brand-text rounded-bl-md"
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                    {msg.ctas && msg.ctas.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {msg.ctas.map((cta) => (
                                                <Link
                                                    key={cta.href}
                                                    href={cta.href}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-full hover:bg-brand-green/20 transition-colors"
                                                    {...(cta.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                                >
                                                    {cta.label}
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-brand-surface rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-brand-muted/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-2 h-2 bg-brand-muted/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-2 h-2 bg-brand-muted/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Replies */}
                    {showQuickReplies && (
                        <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
                            {QUICK_REPLIES.map((qr) => (
                                <button
                                    key={qr.label}
                                    onClick={() => sendMessage(qr.message)}
                                    className="px-3 py-1.5 text-xs border border-brand-green/30 text-brand-green rounded-full hover:bg-brand-green/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green/40"
                                >
                                    {qr.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="border-t border-brand-surface-border px-3 py-2.5 flex items-center gap-2 shrink-0">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about our services..."
                            maxLength={1000}
                            disabled={loading}
                            aria-label="Type your message"
                            className="flex-1 bg-brand-surface border-none rounded-full px-4 py-2 text-sm text-brand-text placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-green/40 disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            aria-label="Send message"
                            className="w-9 h-9 bg-brand-green rounded-full flex items-center justify-center text-white hover:bg-brand-green-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-1 shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                            </svg>
                        </button>
                    </form>

                    {/* Disclaimer + Privacy */}
                    <div className="px-4 py-1.5 bg-brand-surface/50 text-center shrink-0">
                        <p className="text-[10px] text-brand-muted leading-relaxed">
                            Services & booking only. Chat history is stored on this device.
                            <br />
                            Please don&apos;t share confidential information.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
