"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/components/AdminAuthProvider";

interface Post {
    id: string;
    title: string;
    slug: string;
    status: string;
    createdAt?: string;
}

export default function AdminBlogPage() {
    const { token } = useAdminAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = useCallback(async () => {
        if (!token) return;
        try {
            const res = await fetch("/api/admin/posts", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (err) {
            console.error("Failed to load posts:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const deletePost = async (id: string) => {
        if (!token) return;
        if (!confirm("Delete this post? This action cannot be undone.")) return;

        try {
            await fetch(`/api/admin/posts/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error("Failed to delete post:", err);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-brand-text">Blog Posts</h1>
                <Link href="/admin/blog/new" className="btn-primary text-sm">
                    + New Post
                </Link>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green" />
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-20 text-brand-muted">
                    <p className="text-4xl mb-4">📝</p>
                    <p>No blog posts yet.</p>
                    <Link
                        href="/admin/blog/new"
                        className="text-brand-green hover:underline text-sm mt-2 inline-block"
                    >
                        Create your first post →
                    </Link>
                </div>
            ) : (
                <div className="bg-white border border-brand-surface-border rounded-xl overflow-hidden shadow-card">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-brand-surface-border bg-gray-50 text-left">
                                    <th className="px-4 py-3 font-medium text-brand-muted">
                                        Title
                                    </th>
                                    <th className="px-4 py-3 font-medium text-brand-muted">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 font-medium text-brand-muted hidden md:table-cell">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 font-medium text-brand-muted text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map((post) => (
                                    <tr
                                        key={post.id}
                                        className="border-b border-brand-surface-border hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <p className="font-medium">{post.title}</p>
                                            <p className="text-xs text-brand-muted mt-0.5">
                                                /insights/{post.slug}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`text-xs font-medium px-2.5 py-1 rounded-full ${post.status === "published"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {post.status === "published"
                                                    ? "Published"
                                                    : "Draft"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-brand-muted text-xs hidden md:table-cell">
                                            {post.createdAt
                                                ? new Date(post.createdAt).toLocaleDateString()
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-3">
                                            <Link
                                                href={`/admin/blog/${post.id}/edit`}
                                                className="text-brand-green hover:underline text-xs"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => deletePost(post.id)}
                                                className="text-red-500 hover:underline text-xs"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
