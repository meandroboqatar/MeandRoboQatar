"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdminAuth } from "@/components/AdminAuthProvider";

const SOLUTION_OPTIONS = [
    { value: "erp-pfp", label: "ERP & PFP" },
    { value: "ai-customer-agent", label: "AI Customer Agent" },
    { value: "ai-call-center", label: "AI Call Center" },
    { value: "ai-creative-studio", label: "AI Creative Studio" },
    { value: "ai-website-chatbot", label: "AI Website Chatbot" },
];

interface RelatedSolution {
    title: string;
    href: string;
}

export default function EditPostPage() {
    const { token } = useAdminAuth();
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [readTime, setReadTime] = useState("5 min read");
    const [status, setStatus] = useState("draft");
    const [selectedSolutions, setSelectedSolutions] = useState<string[]>([]);
    const [tagsInput, setTagsInput] = useState("");
    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDescription, setSeoDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const fetchPost = useCallback(async () => {
        if (!token) return;
        try {
            const res = await fetch(`/api/admin/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                setError("Post not found");
                setLoading(false);
                return;
            }

            const data = await res.json();
            setTitle(data.title || "");
            setSlug(data.slug || "");
            setExcerpt(data.excerpt || "");
            setContent(data.content || "");
            setReadTime(data.readTime || "5 min read");
            setStatus(data.status || "draft");
            setTagsInput(Array.isArray(data.tags) ? data.tags.join(", ") : "");
            setCoverImageUrl(data.coverImageUrl || "");
            setSeoTitle(data.seoTitle || "");
            setSeoDescription(data.seoDescription || "");

            // Reconstruct selected solutions from relatedSolutions
            if (Array.isArray(data.relatedSolutions)) {
                const values = data.relatedSolutions
                    .map((rs: RelatedSolution) => {
                        const match = rs.href?.replace(/^\//, "").replace(/-qatar$/, "");
                        return SOLUTION_OPTIONS.find((o) => o.value === match)?.value;
                    })
                    .filter(Boolean) as string[];
                setSelectedSolutions(values);
            }
        } catch (err) {
            console.error("Failed to load post:", err);
            setError("Failed to load post");
        } finally {
            setLoading(false);
        }
    }, [token, postId]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    const toggleSolution = (value: string) => {
        setSelectedSolutions((prev) =>
            prev.includes(value)
                ? prev.filter((s) => s !== value)
                : [...prev, value]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setError("");
        setSaving(true);

        const tags = tagsInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

        try {
            const res = await fetch(`/api/admin/posts/${postId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    slug,
                    excerpt,
                    content,
                    readTime,
                    status,
                    tags,
                    coverImageUrl: coverImageUrl.trim(),
                    seoTitle: seoTitle.trim(),
                    seoDescription: seoDescription.trim(),
                    relatedSolutions: selectedSolutions.map((value) => ({
                        title: SOLUTION_OPTIONS.find((s) => s.value === value)?.label || value,
                        href: `/${value}-qatar`,
                    })),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Failed to update post");
                setSaving(false);
                return;
            }

            router.push("/admin/blog");
        } catch {
            setError("Network error. Please try again.");
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl">
            <h1 className="text-2xl font-bold text-brand-text mb-6">Edit Post</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Content */}
                <div className="bg-white border border-brand-surface-border rounded-xl p-6 shadow-card space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-brand-text mb-1.5">
                            Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2.5 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brand-text mb-1.5">
                            Slug *
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-brand-muted">/insights/</span>
                            <input
                                type="text"
                                required
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                pattern="^[a-z0-9-]+$"
                                className="flex-1 px-4 py-2.5 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brand-text mb-1.5">
                            Excerpt
                        </label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2.5 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green resize-y"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brand-text mb-1.5">
                            Content (Markdown) *
                        </label>
                        <textarea
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={15}
                            className="w-full px-4 py-2.5 border border-brand-surface-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green resize-y"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brand-text mb-1.5">
                            Tags
                        </label>
                        <input
                            type="text"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            className="w-full px-4 py-2.5 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                            placeholder="AI, automation, Qatar SME (comma separated)"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brand-text mb-1.5">
                            Cover Image URL
                        </label>
                        <input
                            type="url"
                            value={coverImageUrl}
                            onChange={(e) => setCoverImageUrl(e.target.value)}
                            className="w-full px-4 py-2.5 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                            placeholder="https://storage.googleapis.com/..."
                        />
                        {coverImageUrl && (
                            <div className="mt-2 rounded-lg overflow-hidden border border-brand-surface-border max-h-40">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={coverImageUrl}
                                    alt="Cover preview"
                                    className="w-full h-40 object-cover"
                                    onError={(e) => (e.currentTarget.style.display = "none")}
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-brand-text mb-1.5">
                                Read Time
                            </label>
                            <input
                                type="text"
                                value={readTime}
                                onChange={(e) => setReadTime(e.target.value)}
                                className="w-full px-4 py-2.5 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-text mb-1.5">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-2.5 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brand-text mb-1.5">
                            Related Solutions
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {SOLUTION_OPTIONS.map((sol) => (
                                <button
                                    key={sol.value}
                                    type="button"
                                    onClick={() => toggleSolution(sol.value)}
                                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedSolutions.includes(sol.value)
                                            ? "bg-brand-green/10 border-brand-green text-brand-green"
                                            : "border-brand-surface-border text-brand-muted hover:border-brand-green"
                                        }`}
                                >
                                    {sol.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SEO */}
                <div className="bg-white border border-brand-surface-border rounded-xl p-6 shadow-card space-y-5">
                    <h2 className="text-sm font-semibold text-brand-text flex items-center gap-2">
                        🔍 SEO Settings
                    </h2>
                    <div>
                        <label className="block text-sm font-medium text-brand-text mb-1.5">
                            SEO Title
                        </label>
                        <input
                            type="text"
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            className="w-full px-4 py-2.5 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                            placeholder="Defaults to post title if empty"
                        />
                        <p className="text-xs text-brand-muted mt-1">
                            {seoTitle.length}/60 characters
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-text mb-1.5">
                            SEO Description
                        </label>
                        <textarea
                            value={seoDescription}
                            onChange={(e) => setSeoDescription(e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2.5 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green resize-y"
                            placeholder="Defaults to excerpt if empty"
                        />
                        <p className="text-xs text-brand-muted mt-1">
                            {seoDescription.length}/160 characters
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary disabled:opacity-50"
                    >
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/admin/blog")}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
