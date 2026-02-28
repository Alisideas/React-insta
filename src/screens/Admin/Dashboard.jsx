import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../api";
import { useDarkMode } from "../../hooks/useDarkMode";
import "../HomePage/style.css";

const EASE = [0.25, 0.1, 0.25, 1];

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export const AdminDashboard = () => {
  const [dark, setDark] = useDarkMode();
  const navigate        = useNavigate();
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // post id to confirm
  const [deleting, setDeleting]           = useState(null);
  const [toggling, setToggling]           = useState(null);

  const fetchPosts = () => {
    setLoading(true);
    api.adminGetBlogs()
      .then(setPosts)
      .catch((e) => {
        if (e.message.includes("401") || e.message.includes("Unauthorized")) {
          logout();
        } else {
          setError(e.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login", { replace: true });
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.adminDeleteBlog(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert(e.message);
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  const handleTogglePublish = async (post) => {
    setToggling(post.id);
    try {
      const updated = { ...post, published: post.published ? 0 : 1 };
      await api.adminUpdateBlog(post.id, updated);
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, published: updated.published } : p)));
    } catch (e) {
      alert(e.message);
    } finally {
      setToggling(null);
    }
  };

  const published  = posts.filter((p) => p.published).length;
  const drafts     = posts.length - published;

  return (
    <div className="min-h-screen bg-[#f0ede8] dark:bg-[#0d0d0d] text-[#111] dark:text-[#f0ede8] transition-colors duration-300">

      {/* Navbar */}
      <header className="sticky top-0 z-[100] flex items-center justify-between py-4 px-10 bg-[#f0ede8]/90 dark:bg-[#0d0d0d]/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10 tablet:px-5">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-[18px] font-black tracking-[3px] text-accent">AA</Link>
          <span className="text-black/20 dark:text-white/20">|</span>
          <span className="text-[14px] font-semibold text-[#555] dark:text-[#999]">Blog Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/blog"
            target="_blank"
            className="text-[13px] text-[#555] dark:text-[#999] hover:text-accent transition-colors hidden tablet:hidden mobile:hidden sm:block"
          >
            View Blog ↗
          </Link>
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
            className="relative w-12 h-6 rounded-full bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20"
          >
            <motion.div
              animate={{ x: dark ? 24 : 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-[#111] dark:bg-white flex items-center justify-center text-[9px] text-white dark:text-[#111]"
            >
              {dark ? "☽" : "☀"}
            </motion.div>
          </button>
          <button
            onClick={logout}
            className="text-[13px] font-medium px-4 py-2 rounded-full border border-black/15 dark:border-white/15 text-[#555] dark:text-[#999] hover:border-red-400 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-10 py-10 tablet:px-5">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-[32px] font-black leading-tight">Posts</h1>
            <p className="text-[14px] text-[#555] dark:text-[#999] mt-1">
              {posts.length} total &nbsp;·&nbsp;
              <span className="text-green-500 font-medium">{published} published</span>
              &nbsp;·&nbsp;
              <span className="text-[#777] dark:text-[#888]">{drafts} draft{drafts !== 1 ? "s" : ""}</span>
            </p>
          </div>
          <Link
            to="/admin/new"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-white text-[14px] font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(224,53,0,0.3)]"
          >
            + New Post
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-6 py-4 mb-6 text-red-500 text-[14px]">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-20 bg-black/5 dark:bg-white/5 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-24">
            <p className="text-[56px] mb-4">📝</p>
            <h2 className="text-[22px] font-bold mb-3">No posts yet</h2>
            <p className="text-[15px] text-[#555] dark:text-[#999] mb-8">Create your first blog post to get started.</p>
            <Link
              to="/admin/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white text-[15px] font-semibold hover:bg-accent-dark transition-colors"
            >
              Write your first post →
            </Link>
          </div>
        )}

        {/* Posts table */}
        {!loading && !error && posts.length > 0 && (
          <div className="bg-white dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-black/10 dark:border-white/10 text-[12px] uppercase tracking-[1.5px] text-[#777] dark:text-[#666] font-semibold tablet:grid-cols-[1fr_auto_auto]">
              <span>Title</span>
              <span className="tablet:hidden">Date</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <AnimatePresence initial={false}>
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, paddingTop: 0, paddingBottom: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className={`grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-4 items-center tablet:grid-cols-[1fr_auto_auto] ${
                    i < posts.length - 1 ? "border-b border-black/[0.06] dark:border-white/[0.06]" : ""
                  }`}
                >
                  {/* Title */}
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-[#111] dark:text-white truncate">{post.title}</p>
                    <p className="text-[12px] text-[#999] dark:text-[#666] truncate mt-0.5">/{post.slug}</p>
                  </div>

                  {/* Date */}
                  <span className="text-[13px] text-[#777] dark:text-[#888] whitespace-nowrap tablet:hidden">
                    {fmtDate(post.updated_at || post.created_at)}
                  </span>

                  {/* Status toggle */}
                  <button
                    onClick={() => handleTogglePublish(post)}
                    disabled={toggling === post.id}
                    title={post.published ? "Click to unpublish" : "Click to publish"}
                    className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap ${
                      post.published
                        ? "bg-green-500/15 text-green-500 border border-green-500/25 hover:bg-green-500/25"
                        : "bg-black/5 dark:bg-white/5 text-[#777] dark:text-[#888] border border-black/10 dark:border-white/10 hover:border-accent/40 hover:text-accent"
                    } ${toggling === post.id ? "opacity-50 cursor-wait" : ""}`}
                  >
                    {toggling === post.id ? "…" : post.published ? "Published" : "Draft"}
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/edit/${post.id}`}
                      className="px-3 py-1.5 rounded-lg text-[13px] font-medium bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#555] dark:text-[#999] hover:border-accent/40 hover:text-accent transition-all whitespace-nowrap"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setConfirmDelete(post.id)}
                      className="px-3 py-1.5 rounded-lg text-[13px] font-medium bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#555] dark:text-[#999] hover:border-red-400/40 hover:text-red-500 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{    opacity: 0, scale: 0.93, y: 20 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[40px] mb-4">🗑️</div>
              <h3 className="text-[20px] font-bold mb-2 text-[#111] dark:text-white">Delete post?</h3>
              <p className="text-[14px] text-[#555] dark:text-[#999] mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-3 rounded-xl border border-black/15 dark:border-white/15 text-[14px] font-semibold text-[#555] dark:text-[#999] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  disabled={deleting === confirmDelete}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white text-[14px] font-semibold hover:bg-red-600 transition-all disabled:opacity-60"
                >
                  {deleting === confirmDelete ? "Deleting…" : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
