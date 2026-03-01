"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { marked } from "marked";
import { api, type Post } from "@/lib/client-api";
import { useDarkMode } from "@/lib/useDarkMode";

marked.use({ breaks: true, gfm: true });

function readingTime(text = "") {
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200));
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [dark, setDark]       = useDarkMode();
  const [post, setPost]       = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBlog(params.slug)
      .then(setPost)
      .catch(() => router.replace("/blog"))
      .finally(() => setLoading(false));
  }, [params.slug, router]);

  return (
    <div className="min-h-screen bg-[#f0ede8] dark:bg-[#0d0d0d] text-[#111] dark:text-[#f0ede8] transition-colors duration-300">
      {/* Navbar */}
      <header className="sticky top-0 z-[100] flex items-center justify-between py-5 px-12 bg-[#f0ede8]/90 dark:bg-[#0d0d0d]/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10 tablet:px-6">
        <Link href="/" className="text-[20px] font-black tracking-[3px] text-accent">AA</Link>
        <nav className="flex items-center gap-6">
          <Link href="/blog" className="text-[14px] font-medium text-[#555] dark:text-[#999] hover:text-[#111] dark:hover:text-white transition-colors">← All Posts</Link>
          <button onClick={() => setDark(!dark)} aria-label="Toggle theme"
            className="relative w-14 h-7 rounded-full bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20">
            <motion.div animate={{ x: dark ? 29 : 4 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute top-1 w-5 h-5 rounded-full bg-[#111] dark:bg-white flex items-center justify-center text-[10px] text-white dark:text-[#111]">
              {dark ? "☽" : "☀"}
            </motion.div>
          </button>
        </nav>
      </header>

      {/* Loading skeleton */}
      {loading && (
        <div className="max-w-[720px] mx-auto px-12 py-20 tablet:px-6 animate-pulse">
          <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-32 mb-6" />
          <div className="h-12 bg-black/10 dark:bg-white/10 rounded w-4/5 mb-4" />
          <div className="h-12 bg-black/10 dark:bg-white/10 rounded w-3/5 mb-8" />
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-black/10 dark:bg-white/10 rounded" />)}
          </div>
        </div>
      )}

      {post && (
        <motion.article initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-[720px] mx-auto px-12 py-16 tablet:px-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[13px] text-[#777] dark:text-[#888]">{fmtDate(post.createdAt)}</span>
            <span className="text-[#bbb] dark:text-[#555]">·</span>
            <span className="text-[13px] text-[#777] dark:text-[#888]">{readingTime(post.content)} min read</span>
          </div>

          <h1 className="text-[42px] font-black leading-[1.1] mb-6 mobile:text-[30px]">{post.title}</h1>

          {post.excerpt && (
            <p className="text-[19px] text-[#555] dark:text-[#999] leading-[1.7] mb-10 pb-10 border-b border-black/10 dark:border-white/10">
              {post.excerpt}
            </p>
          )}

          {post.coverImage && (
            <img src={post.coverImage} alt={post.title} className="w-full rounded-2xl mb-10 object-cover max-h-[420px]" />
          )}

          <div
            className="blog-prose"
            dangerouslySetInnerHTML={{ __html: marked.parse(post.content) as string }}
          />

          <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 flex items-center justify-between flex-wrap gap-4">
            <Link href="/blog" className="text-[14px] font-semibold text-accent hover:underline">← Back to all posts</Link>
            <Link href="/" className="text-[14px] text-[#777] dark:text-[#888] hover:text-accent transition-colors">View Portfolio</Link>
          </div>
        </motion.article>
      )}
    </div>
  );
}
