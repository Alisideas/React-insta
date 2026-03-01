"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/client-api";
import { useDarkMode } from "@/lib/useDarkMode";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function AdminLoginPage() {
  const [dark, setDark]   = useDarkMode();
  const router            = useRouter();
  const [form, setForm]   = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading]   = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("admin_token")) router.replace("/admin/dashboard");
    api.checkSetup().then(({ needsSetup }) => setNeedsSetup(needsSetup)).catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await api.login(form);
      localStorage.setItem("admin_token", token);
      router.replace("/admin/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl " +
    "px-4 py-3 text-[#111] dark:text-white placeholder:text-[#999] dark:placeholder:text-[#666] " +
    "focus:outline-none focus:border-accent/60 transition-all text-[15px]";

  return (
    <div className="min-h-screen bg-[#f0ede8] dark:bg-[#0d0d0d] text-[#111] dark:text-[#f0ede8] transition-colors duration-300 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}
        className="w-full max-w-[420px]">
        <div className="text-center mb-10">
          <Link href="/" className="text-[24px] font-black tracking-[4px] text-accent block mb-6">AA</Link>
          <h1 className="text-[28px] font-black mb-2">Admin Login</h1>
          <p className="text-[14px] text-[#555] dark:text-[#999]">Sign in to manage your blog</p>
        </div>

        <div className="bg-white dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-[#555] dark:text-[#999]">Username</label>
              <input name="username" value={form.username} onChange={(e) => setForm(p => ({ ...p, username: e.target.value }))}
                required placeholder="admin" className={inputCls} autoComplete="username" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-[#555] dark:text-[#999]">Password</label>
              <input type="password" name="password" value={form.password} onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                required placeholder="••••••••" className={inputCls} autoComplete="current-password" />
            </div>
            {error && <p className="text-red-500 text-[13px] bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
            <button type="submit" disabled={loading}
              className="mt-2 w-full py-[14px] rounded-xl text-[15px] font-semibold bg-accent text-white hover:bg-accent-dark transition-colors shadow-[0_0_24px_rgba(224,53,0,0.3)] disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center space-y-3">
          {needsSetup && (
            <p className="text-[14px] text-[#777] dark:text-[#888]">
              First time?{" "}
              <Link href="/admin/setup" className="text-accent font-semibold hover:underline">Create admin account →</Link>
            </p>
          )}
          <div className="flex items-center justify-between">
            <Link href="/" className="text-[13px] text-[#777] dark:text-[#888] hover:text-accent transition-colors">← Back to Portfolio</Link>
            <button onClick={() => setDark(!dark)} className="text-[13px] text-[#777] dark:text-[#888] hover:text-[#111] dark:hover:text-white transition-colors">
              {dark ? "☀ Light" : "☽ Dark"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
