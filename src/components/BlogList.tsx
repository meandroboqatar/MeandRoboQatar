"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/Badge";

// Assuming BlogPost is imported or defined here for props
import { BlogPost } from "@/lib/blog-firestore";

interface BlogListProps {
    posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Extract all unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        posts.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
        return Array.from(tags).sort();
    }, [posts]);

    // Filter posts
    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const matchesSearch =
                !searchQuery ||
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTag = !selectedTag || post.tags?.includes(selectedTag);

            return matchesSearch && matchesTag;
        });
    }, [posts, searchQuery, selectedTag]);

    return (
        <div>
            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-10">
                <div className="w-full sm:w-72 relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-brand-surface-border rounded-full text-sm text-brand-text placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors"
                    />
                </div>

                {allTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
                        <button
                            onClick={() => setSelectedTag(null)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedTag === null
                                    ? "bg-brand-text text-white border-brand-text"
                                    : "bg-white text-brand-muted border-brand-surface-border hover:border-brand-text"
                                }`}
                        >
                            All
                        </button>
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedTag === tag
                                        ? "bg-brand-green/10 text-brand-green border-brand-green font-medium"
                                        : "bg-white text-brand-muted border-brand-surface-border hover:border-brand-green/50"
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Grid */}
            {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/insights/${post.slug}`}
                            className="group flex flex-col h-full bg-white border border-brand-surface-border rounded-2xl overflow-hidden hover:border-brand-green/50 hover:shadow-lg transition-all duration-300"
                        >
                            {/* Cover Image */}
                            <div className="relative w-full h-48 bg-brand-surface overflow-hidden">
                                {post.coverImageUrl ? (
                                    <Image
                                        src={post.coverImageUrl}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-brand-muted">
                                        <svg className="w-8 h-8 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm-2 15H7l4-5.5 3 4 2.5-3.5 1.5 2 1 3z" />
                                        </svg>
                                    </div>
                                )}
                                {/* Primary Tag Badge Overlay */}
                                {post.tags?.[0] && (
                                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-wider uppercase text-brand-text shadow-sm border border-black/5">
                                        {post.tags[0]}
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge variant="green">{post.readTime}</Badge>
                                    <span className="text-brand-muted text-xs">
                                        {new Date(post.date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold mb-3 text-brand-text group-hover:text-brand-green transition-colors line-clamp-2">
                                    {post.title}
                                </h2>

                                <p className="text-brand-muted text-sm leading-relaxed flex-1 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="mt-6 pt-4 border-t border-brand-surface-border">
                                    <span className="inline-flex items-center gap-1.5 text-brand-green text-sm font-medium group-hover:gap-2.5 transition-all duration-300">
                                        Read Article
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-brand-surface rounded-2xl border border-brand-surface-border border-dashed">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <svg className="w-6 h-6 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-brand-text mb-2">No articles found</h3>
                    <p className="text-brand-muted text-sm">
                        Try adjusting your search or filter criteria.
                    </p>
                    <button
                        onClick={() => { setSearchQuery(""); setSelectedTag(null); }}
                        className="mt-4 px-4 py-2 text-sm text-brand-green font-medium hover:underline"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}
