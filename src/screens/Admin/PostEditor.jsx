import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { marked } from "marked";
import { api } from "../../api";
import { useDarkMode } from "../../hooks/useDarkMode";
import "../HomePage/style.css";

marked.setOptions({ breaks: true, gfm: true });

const EASE = [0.25, 0.1, 0.25, 1];

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function readingTime(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Markdown toolbar button helper
const ToolbarBtn = ({ label, title, onClick }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className="px-2 py-1 rounded text-[13px] font-mono text-[#555] dark:text-[#999] hover:bg-black/10 dark:hover:bg-white/10 hover:text-[#111] dark:hover:text-white transition-all"
  >
    {label}
  </button>
);

export const PostEditor = () => {
  const [dark, setDark] = useDarkMode();
  const navigate        = useNavigate();
  const { id }          = useParams();
  const isEditing       = Boolean(id);
  const textareaRef     = useRef(null);

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", cover_image: "", published: false,
  });
  const [slugManual, setSlugManual] = useState(false);
  const [tab, setTab]               = useState("write"); // "write" | "preview"
  const [loading, setLoading]       = useState(isEditing);
  const [saving, setSaving]         = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [error, setError]           = useState("");
  const [saved, setSaved]           = useState(false);

  // Load existing post when editing
  useEffect(() => {
    if (!isEditing) return;
    api.adminGetBlog(id)
      .then((post) => {
        setForm({
          title: post.title, slug: post.slug, excerpt: post.excerpt || "",
          content: post.content, cover_image: post.cover_image || "", published: Boolean(post.published),
        });
        setSlugManual(true);
      })
      .catch((e) => {
        if (e.message.includes("401")) { localStorage.removeItem("admin_token"); navigate("/admin/login"); }
        else setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Auto-slug from title
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugManual ? prev.slug : slugify(title),
    }));
  };

  const handleSlugChange = (e) => {
    setSlugManual(true);
    setForm((prev) => ({ ...prev, slug: e.target.value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { url } = await api.uploadImage(file);
      setForm((p) => ({ ...p, cover_image: url }));
    } catch (err) {
      setError("Image upload failed: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Markdown toolbar helpers
  const insertMarkdown = (prefix, suffix = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const sel   = form.content.slice(start, end);
    const newContent =
      form.content.slice(0, start) + prefix + sel + suffix + form.content.slice(end);
    setForm((prev) => ({ ...prev, content: newContent }));
    // Restore cursor position after React re-render
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length + sel.length);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (isEditing) {
        await api.adminUpdateBlog(id, form);
      } else {
        await api.adminCreateBlog(form);
      }
      setSaved(true);
      setTimeout(() => navigate("/admin/dashboard"), 1000);
    } catch (err) {
      if (err.message.includes("401")) {
        localStorage.removeItem("admin_token");
        navigate("/admin/login");
      } else {
        setError(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl " +
    "px-4 py-3 text-[#111] dark:text-white placeholder:text-[#999] dark:placeholder:text-[#666] " +
    "focus:outline-none focus:border-accent/60 transition-all text-[15px]";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0ede8] dark:bg-[#0d0d0d] flex items-center justify-center">
        <p className="text-[#777] dark:text-[#888]">Loading post…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0ede8] dark:bg-[#0d0d0d] text-[#111] dark:text-[#f0ede8] transition-colors duration-300">

      {/* Navbar */}
      <header className="sticky top-0 z-[100] flex items-center justify-between py-4 px-10 bg-[#f0ede8]/90 dark:bg-[#0d0d0d]/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10 tablet:px-5">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-[18px] font-black tracking-[3px] text-accent">AA</Link>
          <span className="text-black/20 dark:text-white/20">|</span>
          <Link to="/admin/dashboard" className="text-[14px] font-semibold text-[#555] dark:text-[#999] hover:text-accent transition-colors">
            ← Dashboard
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setDark(!dark)} className="text-[13px] text-[#777] dark:text-[#888] hover:text-[#111] dark:hover:text-white transition-colors">
            {dark ? "☀" : "☽"}
          </button>
          {/* Publish toggle */}
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, published: !p.published }))}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition-all ${
              form.published
                ? "bg-green-500/15 text-green-500 border-green-500/30 hover:bg-green-500/25"
                : "bg-black/5 dark:bg-white/5 border-black/15 dark:border-white/15 text-[#555] dark:text-[#999] hover:border-accent/40 hover:text-accent"
            }`}
          >
            {form.published ? "✓ Published" : "Draft"}
          </button>
          <button
            form="post-form"
            type="submit"
            disabled={saving || saved}
            className="px-5 py-2 rounded-full bg-accent text-white text-[14px] font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_16px_rgba(224,53,0,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saved ? "✓ Saved!" : saving ? "Saving…" : isEditing ? "Update" : "Publish"}
          </button>
        </div>
      </header>

      <form id="post-form" onSubmit={handleSubmit} className="max-w-[1100px] mx-auto px-10 py-10 tablet:px-5">

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 text-red-500 text-[14px]">
            {error}
          </div>
        )}

        {/* Title — large, inline */}
        <input
          value={form.title}
          onChange={handleTitleChange}
          required
          placeholder="Post title…"
          className="w-full bg-transparent border-none outline-none text-[42px] font-black text-[#111] dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 mb-2 tablet:text-[28px]"
        />

        {/* Slug */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-[13px] text-[#777] dark:text-[#888]">/blog/</span>
          <input
            value={form.slug}
            onChange={handleSlugChange}
            placeholder="url-slug"
            className="text-[13px] bg-transparent border-none outline-none text-[#555] dark:text-[#999] focus:text-accent flex-1 min-w-0"
          />
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-8 tablet:grid-cols-1">

          {/* Left: Markdown editor */}
          <div className="flex flex-col">
            {/* Tabs */}
            <div className="flex items-center gap-1 mb-3">
              {["write", "preview"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded-lg text-[13px] font-semibold capitalize transition-all ${
                    tab === t
                      ? "bg-[#111] dark:bg-white text-white dark:text-[#111]"
                      : "text-[#555] dark:text-[#999] hover:text-[#111] dark:hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
              {tab === "write" && (
                <span className="ml-auto text-[12px] text-[#999] dark:text-[#666]">
                  {readingTime(form.content)} min read · {form.content.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              )}
            </div>

            {/* Toolbar (write mode only) */}
            {tab === "write" && (
              <div className="flex flex-wrap gap-1 px-2 py-2 mb-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl">
                <ToolbarBtn label="H1" title="Heading 1" onClick={() => insertMarkdown("# ")} />
                <ToolbarBtn label="H2" title="Heading 2" onClick={() => insertMarkdown("## ")} />
                <ToolbarBtn label="H3" title="Heading 3" onClick={() => insertMarkdown("### ")} />
                <span className="w-px h-5 bg-black/15 dark:bg-white/15 self-center mx-1" />
                <ToolbarBtn label="B"  title="Bold"    onClick={() => insertMarkdown("**", "**")} />
                <ToolbarBtn label="I"  title="Italic"  onClick={() => insertMarkdown("_", "_")} />
                <ToolbarBtn label="`"  title="Inline code" onClick={() => insertMarkdown("`", "`")} />
                <span className="w-px h-5 bg-black/15 dark:bg-white/15 self-center mx-1" />
                <ToolbarBtn label="—"  title="Blockquote" onClick={() => insertMarkdown("> ")} />
                <ToolbarBtn label="UL" title="Bullet list" onClick={() => insertMarkdown("- ")} />
                <ToolbarBtn label="OL" title="Ordered list" onClick={() => insertMarkdown("1. ")} />
                <ToolbarBtn label="```" title="Code block" onClick={() => insertMarkdown("```\n", "\n```")} />
                <ToolbarBtn label="🔗" title="Link" onClick={() => insertMarkdown("[", "](url)")} />
              </div>
            )}

            {/* Editor / Preview pane */}
            {tab === "write" ? (
              <textarea
                ref={textareaRef}
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                required
                placeholder="Write your post in Markdown…"
                className="w-full bg-white dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-2xl px-6 py-5 text-[15px] text-[#111] dark:text-[#f0ede8] placeholder:text-[#bbb] dark:placeholder:text-[#444] focus:outline-none focus:border-accent/40 transition-all resize-none font-mono leading-[1.7]"
                style={{ minHeight: "520px" }}
              />
            ) : (
              <div
                className="w-full bg-white dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-2xl px-8 py-6 blog-prose overflow-auto"
                style={{ minHeight: "520px" }}
                dangerouslySetInnerHTML={{ __html: form.content ? marked.parse(form.content) : '<p class="text-[#bbb] dark:text-[#555]">Nothing to preview yet…</p>' }}
              />
            )}
          </div>

          {/* Right: Meta fields */}
          <div className="flex flex-col gap-5">

            <div className="bg-white dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-2xl p-6">
              <h3 className="text-[13px] uppercase tracking-[2px] font-semibold text-[#777] dark:text-[#888] mb-4">Post Settings</h3>

              {/* Publish status */}
              <div className="flex items-center justify-between py-3 border-b border-black/10 dark:border-white/10">
                <span className="text-[14px] font-medium">Status</span>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, published: !p.published }))}
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold border transition-all ${
                    form.published
                      ? "bg-green-500/15 text-green-500 border-green-500/30"
                      : "bg-black/5 dark:bg-white/5 text-[#777] dark:text-[#888] border-black/10 dark:border-white/10"
                  }`}
                >
                  {form.published ? "Published" : "Draft"}
                </button>
              </div>

              {/* Excerpt */}
              <div className="mt-4 flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#555] dark:text-[#999]">
                  Excerpt <span className="text-[11px] text-[#aaa]">(optional)</span>
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                  placeholder="Brief summary shown in the blog list…"
                  rows={3}
                  className={`${inputCls} resize-none text-[14px]`}
                />
              </div>

              {/* Cover image */}
              <div className="mt-4 flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#555] dark:text-[#999]">
                  Cover Image <span className="text-[11px] text-[#aaa]">(optional)</span>
                </label>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {/* Upload button */}
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 rounded-xl border border-dashed border-black/20 dark:border-white/20 text-[13px] text-[#777] dark:text-[#888] hover:border-accent/50 hover:text-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading…" : "↑ Upload image"}
                </button>

                {/* URL fallback */}
                <input
                  value={form.cover_image}
                  onChange={(e) => setForm((p) => ({ ...p, cover_image: e.target.value }))}
                  placeholder="or paste a URL…"
                  className={`${inputCls} text-[14px]`}
                />

                {/* Preview */}
                {form.cover_image && (
                  <img
                    src={form.cover_image}
                    alt="Cover preview"
                    className="mt-2 w-full h-32 object-cover rounded-xl border border-black/10 dark:border-white/10"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                )}
              </div>

              {/* Slug (repeat for visibility) */}
              <div className="mt-4 flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#555] dark:text-[#999]">URL Slug</label>
                <input
                  value={form.slug}
                  onChange={handleSlugChange}
                  placeholder="url-slug"
                  className={`${inputCls} text-[14px]`}
                />
              </div>
            </div>

            {/* Save button */}
            <button
              type="submit"
              disabled={saving || saved}
              className="w-full py-4 rounded-2xl bg-accent text-white text-[15px] font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(224,53,0,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saved ? "✓ Saved!" : saving ? "Saving…" : isEditing ? "Update Post" : "Publish Post"}
            </button>

            <Link
              to="/admin/dashboard"
              className="w-full py-3 rounded-2xl border border-black/15 dark:border-white/15 text-[14px] font-semibold text-[#555] dark:text-[#999] hover:border-black/30 dark:hover:border-white/30 transition-all text-center block"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};
