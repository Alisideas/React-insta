"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/client-api";
import { useDarkMode } from "@/lib/useDarkMode";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function AdminSetupPage() {
  useDarkMode();
  const router = useRouter();
  const [form, setForm]         = useState({ username: "", password: "", confirm: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [alreadySetup, setAlreadySetup] = useState(false);

  useEffect(() => {
    api.checkSetup()
      .then(({ needsSetup }) => { if (!needsSetup) setAlreadySetup(true); })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) return setError("Passwords do not match");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    try {
      await api.setup({ username: form.username, password: form.password });
      setDone(true);
      setTimeout(() => router.push("/admin/login"), 2000);
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
          <h1 className="text-[28px] font-black mb-2">Create Admin Account</h1>
          <p className="text-[14px] text-[#555] dark:text-[#999]">One-time setup for your blog dashboard</p>
        </div>

        <div className="bg-white dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-2xl p-8 shadow-xl">
          {alreadySetup ? (
            <div className="text-center py-4">
              <div className="text-[40px] mb-4">🔒</div>
              <p className="font-bold mb-2">Admin already exists</p>
              <p className="text-[14px] text-[#555] dark:text-[#999] mb-6">An admin account has already been created.</p>
              <Link href="/admin/login" className="inline-block px-6 py-3 rounded-xl bg-accent text-white text-[14px] font-semibold hover:bg-accent-dark transition-colors">Go to Login</Link>
            </div>
          ) : done ? (
            <div className="text-center py-4">
              <div className="text-[40px] mb-4">✅</div>
              <p className="font-bold mb-2">Account created!</p>
              <p className="text-[14px] text-[#555] dark:text-[#999]">Redirecting to login…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#555] dark:text-[#999]">Username</label>
                <input value={form.username} onChange={(e) => setForm(p => ({ ...p, username: e.target.value }))}
                  required placeholder="admin" className={inputCls} autoComplete="username" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#555] dark:text-[#999]">Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                  required placeholder="At least 6 characters" className={inputCls} autoComplete="new-password" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#555] dark:text-[#999]">Confirm Password</label>
                <input type="password" value={form.confirm} onChange={(e) => setForm(p => ({ ...p, confirm: e.target.value }))}
                  required placeholder="Repeat password" className={inputCls} autoComplete="new-password" />
              </div>
              {error && <p className="text-red-500 text-[13px] bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
              <button type="submit" disabled={loading}
                className="mt-2 w-full py-[14px] rounded-xl text-[15px] font-semibold bg-accent text-white hover:bg-accent-dark transition-colors shadow-[0_0_24px_rgba(224,53,0,0.3)] disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Creating…" : "Create Account"}
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/admin/login" className="text-[13px] text-[#777] dark:text-[#888] hover:text-accent transition-colors">
            ← Already have an account? Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
