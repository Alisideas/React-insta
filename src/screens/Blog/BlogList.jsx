import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../api";
import { useDarkMode } from "../../hooks/useDarkMode";
import "../../screens/HomePage/style.css";

const EASE = [0.25, 0.1, 0.25, 1];
const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

function readingTime(text = "") {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export const BlogList = () => {
  const [dark, setDark]   = useDarkMode();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    api.getBlogs()
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f0ede8] dark:bg-[#0d0d0d] text-[#111] dark:text-[#f0ede8] transition-colors duration-300">

      {/* Navbar */}
      <header className="sticky top-0 z-[100] flex items-center justify-between py-5 px-12 bg-[#f0ede8]/90 dark:bg-[#0d0d0d]/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10 tablet:px-6">
        <Link to="/" className="text-[20px] font-black tracking-[3px] text-accent">AA</Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-[14px] font-medium text-[#555] dark:text-[#999] hover:text-[#111] dark:hover:text-white transition-colors">
            ← Portfolio
          </Link>
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
            className="relative w-14 h-7 rounded-full bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20"
          >
            <motion.div
              animate={{ x: dark ? 29 : 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute top-1 w-5 h-5 rounded-full bg-[#111] dark:bg-white flex items-center justify-center text-[10px] text-white dark:text-[#111]"
            >
              {dark ? "☽" : "☀"}
            </motion.div>
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-12 pt-20 pb-12 max-w-[900px] mx-auto tablet:px-6">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.p variants={fadeUp} className="text-[12px] uppercase tracking-[3px] text-accent font-semibold mb-4">
            Writing
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-black leading-[0.95] uppercase mb-6"
            style={{ fontSize: "clamp(48px, 8vw, 100px)" }}
          >
            Blogs
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[16px] text-[#555] dark:text-[#999] leading-[1.8] max-w-[540px]">
            Thoughts on web development, design, and building things that matter.
          </motion.p>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="h-px bg-black/10 dark:bg-white/10 max-w-[900px] mx-auto px-12 tablet:px-6" style={{ maxWidth: "900px", marginLeft: "auto", marginRight: "auto" }}>
        <div className="h-px bg-black/10 dark:bg-white/10" />
      </div>

      {/* Posts */}
      <section className="px-12 py-16 max-w-[900px] mx-auto tablet:px-6">
        {loading && (
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse py-8 border-b border-black/10 dark:border-white/10">
                <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-24 mb-4" />
                <div className="h-7 bg-black/10 dark:bg-white/10 rounded w-3/4 mb-3" />
                <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-full mb-2" />
                <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="py-16 text-center">
            <p className="text-[#999] text-[15px]">Could not load posts. Make sure the server is running.</p>
            <p className="text-[13px] text-[#bbb] dark:text-[#666] mt-2">{error}</p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-[48px] mb-4">✍️</p>
            <p className="text-[18px] font-bold mb-2">No posts yet</p>
            <p className="text-[15px] text-[#555] dark:text-[#999]">Check back soon!</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="flex flex-col"
          >
            {posts.map((post) => (
              <motion.article
                key={post.id}
                variants={fadeUp}
                className="group py-10 border-b border-black/10 dark:border-white/10 last:border-0"
              >
                <div className="flex items-start justify-between gap-6 tablet:flex-col tablet:gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[13px] text-[#777] dark:text-[#888]">{fmtDate(post.created_at)}</span>
                      <span className="text-[#bbb] dark:text-[#555]">·</span>
                      <span className="text-[13px] text-[#777] dark:text-[#888]">
                        {readingTime(post.excerpt + " " + (post.content || ""))} min read
                      </span>
                    </div>
                    <h2 className="text-[22px] font-bold text-[#111] dark:text-white group-hover:text-accent transition-colors mb-2 leading-snug">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-[15px] text-[#555] dark:text-[#999] leading-[1.7] line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  {post.cover_image && (
                    <img
                      src={post.cover_image}
                      alt=""
                      className="w-24 h-24 rounded-xl object-cover flex-shrink-0 tablet:w-full tablet:h-48"
                    />
                  )}
                </div>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 mt-5 text-[14px] font-semibold text-accent hover:gap-3 transition-all"
                >
                  Read article →
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 dark:border-white/10 px-12 py-8 max-w-[900px] mx-auto tablet:px-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="text-[13px] text-[#777] dark:text-[#888]">© 2026 Alireza Akbari</p>
          <Link to="/" className="text-[13px] text-[#777] dark:text-[#888] hover:text-accent transition-colors">
            Back to Portfolio
          </Link>
        </div>
      </footer>
    </div>
  );
};
