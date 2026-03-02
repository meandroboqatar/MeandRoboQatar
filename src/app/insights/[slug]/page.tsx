import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/Badge";
import { CTABanner } from "@/components/CTABanner";
import { ShareButtons } from "@/components/ShareButtons";
import { getPostBySlug, getAllPublishedSlugs } from "@/lib/blog-firestore";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://meandrobo.com.qa";

export async function generateStaticParams() {
    const slugs = await getAllPublishedSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);
    if (!post) return {};
    return {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        alternates: { canonical: `${SITE_URL}/insights/${post.slug}` },
        openGraph: {
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt,
            type: "article",
            publishedTime: post.date,
            url: `${SITE_URL}/insights/${post.slug}`,
            ...(post.coverImageUrl ? { images: [post.coverImageUrl] } : {}),
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: { slug: string };
}) {
    const post = await getPostBySlug(params.slug);
    if (!post) notFound();

    const url = `${SITE_URL}/insights/${post.slug}`;
    const { html, headings } = parseMarkdown(post.content);

    // Schema.org JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        image: post.coverImageUrl ? [`${SITE_URL}${post.coverImageUrl}`] : [],
        datePublished: new Date(post.date).toISOString(),
        author: {
            "@type": "Organization",
            name: "MeandRobo Team",
            url: SITE_URL,
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Article Hero */}
            <header className="pt-32 pb-16 bg-brand-surface border-b border-brand-surface-border">
                <div className="max-w-4xl mx-auto px-4 md:px-8">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        {post.tags?.[0] && (
                            <Badge variant="green">{post.tags[0]}</Badge>
                        )}
                        <span className="text-brand-muted text-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {post.readTime}
                        </span>
                        <span className="text-brand-muted text-sm">
                            {new Date(post.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-brand-text mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <p className="text-lg text-brand-muted mb-8 leading-relaxed max-w-3xl">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-brand-text">MeandRobo Team</div>
                            <div className="text-xs text-brand-muted">AI Automation Experts</div>
                        </div>
                    </div>
                </div>
            </header>

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Sidebar (Sticky TOC + Share) */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-32">
                            <div className="mb-10">
                                <ShareButtons url={url} title={post.title} />
                            </div>

                            {headings.length > 0 && (
                                <nav className="border-l border-brand-surface-border pl-4">
                                    <h3 className="text-sm font-bold text-brand-text mb-4 uppercase tracking-wider">
                                        Table of Contents
                                    </h3>
                                    <ul className="space-y-3">
                                        {headings.map((h) => (
                                            <li key={h.id} className={`${h.level === 3 ? "ml-4" : ""}`}>
                                                <a
                                                    href={`#${h.id}`}
                                                    className="text-sm text-brand-muted hover:text-brand-green transition-colors line-clamp-2"
                                                >
                                                    {h.text}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            )}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <article className="lg:col-span-7">
                        {/* Mobile Share */}
                        <div className="lg:hidden mb-8 pb-8 border-b border-brand-surface-border">
                            <ShareButtons url={url} title={post.title} />
                        </div>

                        {/* Cover Image */}
                        {post.coverImageUrl && (
                            <div className="mb-12 rounded-2xl overflow-hidden shadow-sm border border-brand-surface-border">
                                <Image
                                    src={post.coverImageUrl}
                                    alt={post.title}
                                    width={1200}
                                    height={600}
                                    className="w-full h-auto object-cover"
                                    priority
                                />
                            </div>
                        )}

                        {/* Article Body */}
                        <div
                            className="prose prose-gray max-w-none
                                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-brand-text
                                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-brand-surface-border
                                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                                prose-p:text-brand-muted prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6
                                prose-li:text-brand-muted prose-li:text-lg
                                prose-strong:text-brand-text
                                prose-blockquote:border-l-4 prose-blockquote:border-brand-green prose-blockquote:bg-brand-surface/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:my-8 prose-blockquote:not-italic
                                prose-a:text-brand-green prose-a:font-medium prose-a:no-underline hover:prose-a:underline"
                            dangerouslySetInnerHTML={{ __html: html }}
                        />

                        {/* Strong CTA Block */}
                        <div className="mt-16 bg-brand-surface border border-brand-green/30 rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

                            <h3 className="text-2xl font-bold text-brand-text mb-4 relative z-10">
                                Ready to automate your customer support?
                            </h3>
                            <p className="text-brand-muted mb-8 max-w-xl mx-auto relative z-10">
                                Let’s discuss how MeandRobo can deploy a custom AI customer agent for your Qatar SME, saving you hours every day.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                                <Link href="/contact#assessment" className="btn-primary w-full sm:w-auto">
                                    Book Free Consultation
                                </Link>
                                <a
                                    href="https://wa.me/97477558819"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 rounded-brand font-medium transition-all duration-200 border border-brand-surface-border bg-white text-brand-text hover:border-brand-green hover:text-brand-green w-full sm:w-auto"
                                >
                                    Talk to a Human (WhatsApp)
                                </a>
                            </div>
                        </div>

                    </article>

                    {/* Right Sidebar (Related Solutions) */}
                    <aside className="lg:col-span-2">
                        <div className="sticky top-32">
                            {post.tags && post.tags.length > 0 && (
                                <div className="mb-10">
                                    <h3 className="text-sm font-bold text-brand-text mb-4 uppercase tracking-wider">
                                        Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-xs px-3 py-1.5 rounded-full bg-brand-surface border border-brand-surface-border text-brand-muted whitespace-nowrap"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {post.relatedSolutions && post.relatedSolutions.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-brand-text mb-4 uppercase tracking-wider">
                                        Related Solutions
                                    </h3>
                                    <div className="flex flex-col gap-3">
                                        {post.relatedSolutions.map((s) => (
                                            <Link
                                                key={s.href}
                                                href={s.href}
                                                className="group block p-4 bg-white border border-brand-surface-border rounded-xl hover:border-brand-green/50 transition-colors shadow-sm"
                                            >
                                                <h4 className="font-semibold text-brand-text text-sm mb-1 group-hover:text-brand-green transition-colors leading-tight">
                                                    {s.title}
                                                </h4>
                                                <span className="text-xs text-brand-green font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    Learn more
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                </div>
            </section>

            <CTABanner />
        </>
    );
}

/** Advanced markdown to HTML converter for blog content */
function parseMarkdown(md: string) {
    const headings: { id: string; text: string; level: number }[] = [];

    const html = md
        .trim()
        // Headings with IDs
        .replace(/^(##?#?)\s+(.+)$/gm, (match, hashes, text) => {
            const level = hashes.length;
            if (level === 2 || level === 3) {
                const id = text.toLowerCase().replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '');
                headings.push({ id, text, level });
                return `<h${level} id="${id}" class="scroll-mt-32">${text}</h${level}>`;
            }
            return `<h${level}>${text}</h${level}>`;
        })
        // Bold
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        // Images (Markdown format: ![alt](url))
        .replace(/!\[([^\]]*)\]\((.*?)\)/g, '<figure class="my-10"><img src="$2" alt="$1" class="w-full h-auto rounded-2xl border border-brand-surface-border shadow-sm bg-brand-surface" /><figcaption class="text-center text-sm text-brand-muted mt-3 italic">$1</figcaption></figure>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        // Unordered Lists
        .replace(/^- (.+)$/gm, "<li>$1</li>")
        .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul class="list-disc pl-5 mb-6 space-y-2">${match}</ul>`)
        // Blockquotes
        .replace(/^> (.*)$/gm, "<blockquote>$1</blockquote>")
        // Paragraphs (wrap lines that aren't HTML tags)
        .replace(/^(?!<(?:h|ul|li|figure|img|figcaption|blockquote|p))(.+\S.*)$/gm, "<p>$1</p>")
        // Clean up empty paragraphs
        .replace(/<p><\/p>/g, "");

    return { html, headings };
}
