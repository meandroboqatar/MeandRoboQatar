import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/Section";
import { Badge } from "@/components/Badge";
import { CTABanner } from "@/components/CTABanner";
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

    return (
        <>
            <Section className="pt-28 sm:pt-32">
                <article className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <Badge variant="green">{post.readTime}</Badge>
                        <span className="text-brand-muted text-sm">
                            {new Date(post.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                        {post.title}
                    </h1>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-xs px-2.5 py-1 rounded-full bg-brand-green/10 text-brand-green"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Cover Image */}
                    {post.coverImageUrl && (
                        <div className="mb-8 rounded-xl overflow-hidden border border-brand-surface-border">
                            <Image
                                src={post.coverImageUrl}
                                alt={post.title}
                                width={800}
                                height={400}
                                className="w-full h-auto object-cover"
                                priority
                            />
                        </div>
                    )}

                    <div
                        className="prose prose-gray max-w-none
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-brand-text
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-brand-muted prose-p:leading-relaxed
              prose-li:text-brand-muted
              prose-strong:text-brand-text
              prose-a:text-brand-green prose-a:no-underline hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
                    />

                    {/* Related Solutions */}
                    {post.relatedSolutions.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-brand-surface-border">
                            <h3 className="font-semibold mb-4">Related Solutions</h3>
                            <div className="flex flex-wrap gap-3">
                                {post.relatedSolutions.map((s) => (
                                    <Link
                                        key={s.href}
                                        href={s.href}
                                        className="px-4 py-2 text-sm border border-brand-surface-border rounded-brand hover:border-brand-green hover:text-brand-green transition-colors"
                                    >
                                        {s.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </Section>

            <CTABanner />
        </>
    );
}

/** Simple markdown to HTML converter for blog content */
function markdownToHtml(md: string): string {
    return md
        .trim()
        .replace(/^### (.+)$/gm, "<h3>$1</h3>")
        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
        .replace(/^- (.+)$/gm, "<li>$1</li>")
        .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
        .replace(/^(?!<[hul])(.*\S.*)$/gm, "<p>$1</p>")
        .replace(/<p><\/p>/g, "");
}
