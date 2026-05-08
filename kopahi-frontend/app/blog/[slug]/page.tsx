"use client";

import Link from "next/link";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import PageShell from "../../components/PageShell";
import Footer from "../../components/Footer";
import BlogImage from "../BlogImage";
import { api, ApiError } from "../../lib/api";

type ApiPost = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  publishedAt: string;
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
};

const readTime = (content: string) =>
  Math.max(1, Math.round(content.replace(/<[^>]+>/g, "").split(/\s+/).length / 200));

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);

  const [post, setPost] = useState<ApiPost | null>(null);
  const [related, setRelated] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get<{ success: boolean; post: ApiPost }>(`/api/blog/${slug}`);
        if (cancelled) return;
        setPost(res.post);

        const all = await api.get<{ success: boolean; posts: ApiPost[] }>("/api/blog");
        if (cancelled) return;
        const matches = all.posts
          .filter((p) => p.slug !== slug)
          .sort((a, b) => {
            const overlap = (x: ApiPost) =>
              x.tags?.filter((t) => res.post.tags?.includes(t)).length || 0;
            return overlap(b) - overlap(a);
          })
          .slice(0, 3);
        setRelated(matches);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setError("Post not found");
        } else {
          setError(err instanceof ApiError ? err.message : "Could not load post");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="bg-white text-gray-900 min-h-screen flex flex-col">
        <PageShell>
          <div className="py-32 text-center text-gray-500">Loading…</div>
        </PageShell>
        <Footer />
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="bg-white text-gray-900 min-h-screen flex flex-col">
        <PageShell>
          <div className="py-24 px-6 max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-3">Post not found</h1>
            <p className="text-gray-600 mb-8">{error || "This post may have been removed."}</p>
            <Link
              href="/blog"
              className="inline-block bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-bold"
            >
              Back to all stories
            </Link>
          </div>
        </PageShell>
        <Footer />
      </main>
    );
  }

  const initials = post.author
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  const primaryTag = post.tags?.[0] || "Story";

  return (
    <main className="bg-white text-gray-900 min-h-screen flex flex-col">
      <PageShell>
        <article className="flex-1">
          <header className="relative bg-gradient-to-br from-green-50 via-white to-green-50/40 pt-12 pb-10 md:pt-16 md:pb-14 px-6">
            <div className="max-w-3xl mx-auto">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-green-700 font-semibold hover:underline mb-6"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to all stories
              </Link>

              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-5">
                {primaryTag}
              </span>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
                {post.title}
              </h1>

              <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-4 flex-wrap text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-700 to-green-500 text-white flex items-center justify-center font-bold text-sm">
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{post.author}</p>
                    <p className="text-gray-500 text-xs">Kopahi journal</p>
                  </div>
                </div>
                <span className="text-gray-300">·</span>
                <span className="text-gray-600">{formatDate(post.publishedAt)}</span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-600 inline-flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {readTime(post.content)} min read
                </span>
              </div>
            </div>
          </header>

          <div className="px-6 -mt-2">
            <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
              <BlogImage
                src={post.coverImage}
                alt={post.title}
                category={primaryTag}
                fallbackText={post.title}
                className="w-full h-[280px] md:h-[480px] object-cover"
              />
            </div>
          </div>

          <section className="py-16 md:py-20 px-6">
            <div
              className="prose prose-lg prose-green mx-auto max-w-3xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.tags?.length > 0 && (
              <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="max-w-3xl mx-auto mt-12 bg-gradient-to-br from-green-50 via-white to-green-50/40 border border-green-100 rounded-3xl p-6 md:p-8 flex items-start gap-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-700 to-green-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
                {initials}
              </div>
              <div>
                <p className="font-bold text-lg tracking-tight">{post.author}</p>
                <p className="text-sm text-green-700 font-semibold mb-2">Kopahi journal</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Part of the team that sources, tests, and curates every product on Kopahi.
                </p>
              </div>
            </div>
          </section>
        </article>

        {related.length > 0 && (
          <section className="bg-gradient-to-br from-gray-50 via-white to-green-50/30 py-16 md:py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-white text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm">
                    Keep reading
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">More from the journal</h2>
                </div>
                <Link
                  href="/blog"
                  className="text-green-700 font-semibold hover:text-green-800 inline-flex items-center gap-2 group"
                >
                  All stories
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 hover:border-green-200 hover:-translate-y-1 transition-all duration-500"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <BlogImage
                        src={p.coverImage}
                        alt={p.title}
                        category={p.tags?.[0] || "Story"}
                        fallbackText={p.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6">
                      <span className="inline-block px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-3">
                        {p.tags?.[0] || "Story"}
                      </span>
                      <h3 className="font-bold tracking-tight mb-2 group-hover:text-green-700 transition-colors line-clamp-2">{p.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">{p.excerpt}</p>
                      <p className="text-xs text-gray-500">{formatDate(p.publishedAt)} · {readTime(p.content)} min read</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </PageShell>
      <Footer />
    </main>
  );
}
