import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import "./style.css";

const EMAILJS_SERVICE_ID  = "service_4wybl75";
const EMAILJS_TEMPLATE_ID = "template_cuh0gy8";
const EMAILJS_PUBLIC_KEY  = "z2tTgeKX1tEBNoZ1n";

// ─── Dark mode hook ───────────────────────────────────────────────────────────
function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);
  return [dark, setDark];
}

// ─── Animation variants ───────────────────────────────────────────────────────
const EASE = [0.25, 0.1, 0.25, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.6 } },
};

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

const slideRight = {
  hidden: { opacity: 0, x: 60 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};

const staggerFast = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

const VP = { once: true, margin: "-80px" };

// ─── Contact Modal ────────────────────────────────────────────────────────────
const ContactModal = ({ onClose }) => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  form.name,
          from_email: form.email,
          subject:    form.subject,
          message:    form.message,
          to_email:   "alirezakbarim@gmail.com",
        },
        EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const inputCls =
    "w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl " +
    "px-4 py-3 text-[#111] dark:text-white placeholder:text-[#999] dark:placeholder:text-[#666] " +
    "focus:outline-none focus:border-accent/60 transition-all text-[15px]";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{    opacity: 0, scale: 0.93, y: 24 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-black/10 dark:border-white/10">
          <div>
            <h2 className="text-[24px] font-extrabold text-[#111] dark:text-white">
              Get In <span className="text-accent">Touch</span>
            </h2>
            <p className="text-[#666] dark:text-[#999] text-[14px] mt-1">I'll reply within 24 hours.</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[#666] dark:text-[#999] hover:text-[#111] dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-all text-lg leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex flex-col items-center gap-4 py-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center text-[28px]">✓</div>
              <p className="text-[18px] font-bold text-[#111] dark:text-white">Message sent!</p>
              <p className="text-[#666] dark:text-[#999] text-[14px]">Thanks for reaching out. I'll get back to you soon.</p>
              <button onClick={onClose} className="mt-2 px-6 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 text-[#666] dark:text-[#999] hover:text-[#111] dark:hover:text-white transition-all text-[14px]">
                Close
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 tablet:grid-cols-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] text-[#666] dark:text-[#999] font-medium">Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] text-[#666] dark:text-[#999] font-medium">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" className={inputCls} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-[#666] dark:text-[#999] font-medium">Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} required placeholder="What's this about?" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-[#666] dark:text-[#999] font-medium">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Tell me about your project..." className={`${inputCls} resize-none`} />
              </div>
              {status === "error" && (
                <p className="text-red-500 text-[13px] bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  Something went wrong. Please try again or email{" "}
                  <a href="mailto:alirezakbarim@gmail.com" className="underline">alirezakbarim@gmail.com</a>.
                </p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-1 w-full py-[14px] rounded-xl text-[15px] font-semibold bg-accent text-white hover:bg-accent-dark transition-colors shadow-[0_0_24px_rgba(224,53,0,0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "sending" ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export const HomePage = () => {
  const [dark, setDark]       = useDarkMode();
  const [contactOpen, setContactOpen] = useState(false);
  const [imgError, setImgError]       = useState(false);

  const techStack = [
    "React.js", "Next.js", "Flutter", "WordPress", "Node.js",
    "UI/UX Design", "TypeScript", "Tailwind CSS", "PHP", "Figma",
    "PostgreSQL", "Firebase",
  ];

  const skills = [
    { name: "React.js / Next.js", level: 90 },
    { name: "JavaScript / TypeScript", level: 88 },
    { name: "Flutter", level: 80 },
    { name: "HTML / CSS", level: 92 },
    { name: "WordPress", level: 85 },
    { name: "UI/UX Design", level: 82 },
  ];

  const services = [
    { title: "Web Development", desc: "Full-stack apps with React, Next.js and Node.js. Fast, scalable, and pixel-perfect." },
    { title: "UI/UX Design",    desc: "Clean, modern interfaces designed for engagement and conversion.", highlighted: true },
    { title: "Mobile Apps",     desc: "Cross-platform mobile applications with Flutter, targeting iOS and Android." },
    { title: "WordPress",       desc: "Custom themes, plugins, and Elementor-powered sites that perform." },
  ];

  const experience = [
    {
      role: "Senior Web Designer", company: "Mishov Markets",
      period: "Sep 2025 – Feb 2026", location: "Istanbul, Türkiye",
      description: "Designed and delivered high-quality web interfaces for a fast-growing markets platform, focusing on visual consistency and user experience.",
      tags: ["UI/UX", "Web Design", "React"],
    },
    {
      role: "Full-stack Developer", company: "NiaTech",
      period: "May 2024 – Nov 2024", location: "Istanbul, Türkiye",
      description: "Developed modern, high-performance web applications using Next.js. Designed and built user interfaces, developed backend APIs, worked with databases, and ensured application performance and security.",
      tags: ["Next.js", "React", "Node.js", "APIs"],
    },
    {
      role: "Frontend Developer", company: "Dextern",
      period: "Jun 2022 – Jan 2024", location: "Ireland",
      description: "Developed modern, interactive web applications using React.js and cross-platform mobile apps with Flutter. Also used WordPress for dynamic websites, implementing responsive UIs and optimizing performance.",
      tags: ["React.js", "Flutter", "WordPress"],
    },
    {
      role: "Web Developer", company: "Zebrit",
      period: "Jun 2022 – Nov 2023", location: "Ireland",
      description: "Built and customized WordPress websites for various clients. Developed custom themes and plugins, optimized performance, ensured responsive design, and managed content with Elementor.",
      tags: ["WordPress", "Elementor", "PHP"],
    },
    {
      role: "Web Developer", company: "49 Tech Hub",
      period: "Apr 2021 – Jun 2022", location: "Istanbul, Turkey",
      description: "Created WordPress-based websites with custom themes and plugins. Optimized website performance and provided ongoing technical support and regular updates for client projects.",
      tags: ["WordPress", "Elementor", "HTML/CSS"],
    },
  ];

  const education = [
    { degree: "Master of Engineering — AI & Data Science", school: "İstanbul Aydin University", period: "Oct 2025 – Oct 2027", ongoing: true  },
    { degree: "Bachelor's Degree — Computer Engineering",  school: "İstanbul Aydin University", period: "Jan 2020 – Dec 2024", ongoing: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f0ede8] dark:bg-[#0d0d0d] text-[#111] dark:text-[#f0ede8] transition-colors duration-300 overflow-x-hidden">

      <AnimatePresence>
        {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
      </AnimatePresence>

      {/* ══ NAVBAR ══════════════════════════════════════════════════════════════ */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="sticky top-0 z-[100] flex items-center justify-between py-5 px-12 bg-[#f0ede8]/90 dark:bg-[#0d0d0d]/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10 tablet:px-6"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          className="text-[20px] font-black tracking-[3px] text-accent"
        >
          AA
        </motion.div>

        {/* Nav links */}
        <motion.nav
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } }}
          className="flex items-center gap-8 tablet:gap-5 mobile:hidden"
        >
          {["About", "Skills", "Experience", "Education"].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              variants={fadeIn}
              className="text-[#555] dark:text-[#999] text-[14px] font-medium hover:text-[#111] dark:hover:text-white transition-colors"
            >
              {item}
            </motion.a>
          ))}
        </motion.nav>

        {/* Right controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-3"
        >
          {/* Theme toggle pill */}
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
            className="relative w-14 h-7 rounded-full bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 transition-colors"
          >
            <motion.div
              animate={{ x: dark ? 29 : 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute top-1 w-5 h-5 rounded-full bg-[#111] dark:bg-white flex items-center justify-center text-[10px] text-white dark:text-[#111]"
            >
              {dark ? "☽" : "☀"}
            </motion.div>
          </button>

          <button
            onClick={() => setContactOpen(true)}
            className="bg-accent text-white px-5 py-[9px] rounded-full text-[14px] font-semibold hover:bg-accent-dark transition-colors cursor-pointer"
          >
            Hire Me
          </button>
        </motion.div>
      </motion.header>

      {/* ══ HERO ════════════════════════════════════════════════════════════════ */}
      <section className="px-12 pt-20 pb-10 max-w-[1200px] mx-auto w-full tablet:px-6" id="hero">
        <div className="flex items-start justify-between gap-12 tablet:flex-col">

          {/* Left: massive typography */}
          <motion.div
            className="flex-1"
            initial="hidden"
            animate="show"
            variants={stagger}
          >
            <motion.p variants={fadeIn} className="text-[12px] font-semibold uppercase tracking-[3px] text-accent mb-5">
              Available for work
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="font-black leading-[0.9] uppercase text-[#111] dark:text-[#f0ede8]"
              style={{ fontSize: "clamp(54px, 10.5vw, 148px)" }}
            >
              Full-stack
            </motion.h1>
            <motion.h1
              variants={fadeUp}
              className="font-black leading-[0.9] uppercase text-[#111] dark:text-[#f0ede8]"
              style={{ fontSize: "clamp(54px, 10.5vw, 148px)" }}
            >
              Developer
            </motion.h1>
            <motion.div variants={fadeUp} className="mt-7 flex items-center gap-3">
              <div className="h-px w-16 bg-black/25 dark:bg-white/25" />
              <span className="text-[13px] uppercase tracking-[2px] text-[#777] dark:text-[#888]">
                Alireza Akbari
              </span>
            </motion.div>

            {/* Stats — shown on tablet where photo is hidden */}
            <motion.div
              variants={staggerFast}
              className="hidden tablet:grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-black/10 dark:border-white/10"
            >
              {[
                { num: "5+", label: "Years Exp." },
                { num: "5",  label: "Companies"  },
                { num: "2",  label: "Degrees"     },
              ].map(({ num, label }) => (
                <motion.div key={label} variants={fadeUp} className="flex flex-col gap-1">
                  <span className="text-[36px] font-black leading-none text-accent">{num}</span>
                  <span className="text-[12px] text-[#777] dark:text-[#888] uppercase tracking-[1px]">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: photo card + intro + CTAs */}
          <motion.div
            className="flex-shrink-0 w-[340px] tablet:w-full tablet:max-w-[480px] mobile:max-w-full"
            variants={slideRight}
            initial="hidden"
            animate="show"
          >
            {/* Photo */}
            <div className="relative">
              {imgError ? (
                <div className="w-full h-[420px] rounded-2xl bg-gradient-to-br from-accent to-[#ff6b35] flex items-center justify-center shadow-xl">
                  <span className="text-[72px] font-black text-white">AA</span>
                </div>
              ) : (
                <img
                  src="/alireza.jpg"
                  alt="Alireza Akbari"
                  onError={() => setImgError(true)}
                  className="w-full h-[420px] object-cover object-top rounded-2xl shadow-xl"
                />
              )}

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.4, ease: EASE }}
                className="absolute -bottom-5 -left-5 bg-accent text-white rounded-2xl px-5 py-4 shadow-xl"
              >
                <div className="text-[26px] font-black leading-none">5+</div>
                <div className="text-[11px] font-semibold opacity-90 mt-1 uppercase tracking-[1px]">Years Exp.</div>
              </motion.div>
            </div>

            {/* Intro */}
            <p className="mt-10 text-[15px] text-[#555] dark:text-[#999] leading-[1.8]">
              Passionate about building visually appealing and user-friendly products.
              Experienced in React.js, Next.js, Flutter, and WordPress — currently based in Istanbul.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex gap-3">
              <a
                href="#experience"
                className="flex-1 text-center px-4 py-3 rounded-full text-[14px] font-semibold bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-colors"
              >
                View Work
              </a>
              <button
                onClick={() => setContactOpen(true)}
                className="flex-1 px-4 py-3 rounded-full text-[14px] font-semibold border border-black/20 dark:border-white/20 text-[#555] dark:text-[#999] hover:border-accent hover:text-accent transition-colors cursor-pointer"
              >
                Contact Me →
              </button>
            </div>
          </motion.div>
        </div>

        {/* Stats bar — desktop only */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6, ease: EASE }}
          className="mt-20 pt-8 border-t border-black/10 dark:border-white/10 grid grid-cols-4 tablet:hidden gap-6"
        >
          {[
            { num: "5+", label: "Years Experience" },
            { num: "5",  label: "Companies Worked" },
            { num: "2",  label: "Degrees"          },
            { num: "∞",  label: "Curiosity"        },
          ].map(({ num, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-[38px] font-black leading-none text-accent">{num}</span>
              <span className="text-[12px] text-[#777] dark:text-[#888] uppercase tracking-[1px]">{label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ══ MARQUEE ════════════════════════════════════════════════════════════ */}
      <div className="bg-accent text-white py-4 mt-12 overflow-hidden">
        <div
          className="flex animate-marquee whitespace-nowrap"
          style={{ width: "max-content" }}
        >
          {[...techStack, ...techStack].map((tech, i) => (
            <span
              key={i}
              className="mx-8 text-[13px] font-semibold uppercase tracking-[2px] flex-shrink-0"
            >
              ◆ {tech}
            </span>
          ))}
        </div>
      </div>

      {/* ══ ABOUT ══════════════════════════════════════════════════════════════ */}
      <section className="px-12 py-24 max-w-[1200px] mx-auto w-full tablet:px-6" id="about">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VP}
          variants={stagger}
          className="grid grid-cols-2 gap-20 items-center tablet:grid-cols-1 tablet:gap-12"
        >
          {/* Left: copy */}
          <motion.div variants={slideLeft}>
            <p className="text-[12px] uppercase tracking-[3px] text-accent font-semibold mb-4">About</p>
            <h2 className="text-[42px] font-black leading-[1.1] mb-6 mobile:text-[30px]">
              Building things<br />that <span className="text-accent">matter</span>
            </h2>
            <p className="text-[16px] text-[#555] dark:text-[#999] leading-[1.8] mb-4">
              I'm <strong className="text-[#111] dark:text-white">Alireza</strong>, a passionate web developer and UI/UX
              designer with a strong background in HTML, CSS, JavaScript, Flutter, and React.js.
              I love creating beautiful, functional products that people enjoy using.
            </p>
            <p className="text-[16px] text-[#555] dark:text-[#999] leading-[1.8] mb-8">
              I've worked on e-commerce websites, marketing sites, and mobile applications.
              Always learning, always building — currently based in <strong className="text-[#111] dark:text-white">Istanbul</strong>.
              When I'm not coding, you can find me outdoors or tinkering with new tech.
            </p>
            <button
              onClick={() => setContactOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111] dark:bg-white text-white dark:text-[#111] text-[14px] font-semibold hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-colors cursor-pointer"
            >
              Let's work together →
            </button>
          </motion.div>

          {/* Right: stats */}
          <motion.div variants={slideRight} className="flex flex-col gap-0">
            {[
              { num: "5+", label: "Years of professional experience building web products" },
              { num: "5",  label: "Companies worked at across Europe and Turkey"           },
              { num: "2",  label: "University degrees including MEng in AI & Data Science" },
            ].map(({ num, label }, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-start gap-6 py-8 border-b border-black/10 dark:border-white/10 first:pt-0 last:border-0 last:pb-0"
              >
                <span className="text-[52px] font-black leading-none text-accent flex-shrink-0">{num}</span>
                <p className="text-[15px] text-[#555] dark:text-[#999] leading-[1.6] mt-3">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ══ SKILLS / SERVICES ══════════════════════════════════════════════════ */}
      <section className="border-t border-black/10 dark:border-white/10" id="skills">
        <motion.div
          className="px-12 py-24 max-w-[1200px] mx-auto w-full tablet:px-6"
          initial="hidden"
          whileInView="show"
          viewport={VP}
          variants={stagger}
        >
          <div className="grid grid-cols-2 gap-20 items-start tablet:grid-cols-1 tablet:gap-12">

            {/* Left: skill bars */}
            <motion.div variants={slideLeft}>
              <p className="text-[12px] uppercase tracking-[3px] text-accent font-semibold mb-4">What I Do</p>
              <h2 className="text-[42px] font-black leading-[1.1] mb-6 mobile:text-[30px]">
                Services &<br /><span className="text-accent">Skills</span>
              </h2>
              <p className="text-[16px] text-[#555] dark:text-[#999] leading-[1.8] mb-10">
                From concept to production — I cover the full stack with a design-first mindset.
              </p>
              <div className="flex flex-col gap-5">
                {skills.map((skill, i) => (
                  <div key={skill.name} className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-[14px] font-semibold text-[#111] dark:text-[#f0ede8]">{skill.name}</span>
                      <span className="text-[13px] font-bold text-accent">{skill.level}%</span>
                    </div>
                    <div className="h-[4px] bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-accent rounded-full"
                        initial={{ width: "0%" }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, ease: "easeOut", delay: 0.1 + i * 0.06 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: service cards */}
            <motion.div variants={slideRight} className="grid grid-cols-2 gap-4 mobile:grid-cols-1">
              {services.map((svc, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`p-7 rounded-2xl flex flex-col gap-4 border transition-all ${
                    svc.highlighted
                      ? "bg-accent border-accent text-white"
                      : "bg-white dark:bg-white/[0.04] border-black/10 dark:border-white/10 hover:border-accent/50"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[16px] ${svc.highlighted ? "bg-white/20" : "bg-accent/10"}`}>
                    {["⚡", "✦", "📱", "🌐"][i]}
                  </div>
                  <h3 className={`text-[16px] font-bold leading-snug ${svc.highlighted ? "text-white" : "text-[#111] dark:text-white"}`}>
                    {svc.title}
                  </h3>
                  <p className={`text-[14px] leading-[1.7] ${svc.highlighted ? "text-white/80" : "text-[#555] dark:text-[#999]"}`}>
                    {svc.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ══ EXPERIENCE ═════════════════════════════════════════════════════════ */}
      <section className="border-t border-black/10 dark:border-white/10" id="experience">
        <motion.div
          className="px-12 py-24 max-w-[1200px] mx-auto w-full tablet:px-6"
          initial="hidden"
          whileInView="show"
          viewport={VP}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="flex items-end justify-between mb-16 mobile:flex-col mobile:items-start mobile:gap-2">
            <div>
              <p className="text-[12px] uppercase tracking-[3px] text-accent font-semibold mb-2">Career</p>
              <h2 className="text-[42px] font-black leading-[1.0] mobile:text-[30px]">Work Experience</h2>
            </div>
            <span className="text-[14px] text-[#777] dark:text-[#888]">2021 — Present</span>
          </motion.div>

          <div className="flex flex-col">
            {experience.map((job, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ x: 4, transition: { duration: 0.15 } }}
                className="group py-8 border-t border-black/10 dark:border-white/10 flex gap-8 items-start cursor-default tablet:flex-col tablet:gap-3"
              >
                {/* Date + location */}
                <div className="flex-shrink-0 w-[150px] tablet:w-auto">
                  <span className="text-[13px] text-[#777] dark:text-[#888] leading-[1.5] block">{job.period}</span>
                  <span className="text-[12px] text-[#aaa] dark:text-[#666] block mt-1">{job.location}</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-[18px] font-bold text-[#111] dark:text-white group-hover:text-accent transition-colors">
                    {job.role}
                  </h3>
                  <p className="text-[15px] font-semibold text-accent mt-1">{job.company}</p>
                  <p className="text-[14px] text-[#555] dark:text-[#999] leading-[1.7] mt-3">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[12px] font-medium px-3 py-1 rounded-full border border-black/15 dark:border-white/15 text-[#555] dark:text-[#999]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ EDUCATION ══════════════════════════════════════════════════════════ */}
      <section className="border-t border-black/10 dark:border-white/10" id="education">
        <motion.div
          className="px-12 py-24 max-w-[1200px] mx-auto w-full tablet:px-6"
          initial="hidden"
          whileInView="show"
          viewport={VP}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-16">
            <p className="text-[12px] uppercase tracking-[3px] text-accent font-semibold mb-2">Academic</p>
            <h2 className="text-[42px] font-black leading-[1.0] mobile:text-[30px]">Education</h2>
          </motion.div>

          <div className="flex flex-col">
            {education.map((edu, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ x: 4, transition: { duration: 0.15 } }}
                className="group py-10 border-t border-black/10 dark:border-white/10 flex gap-8 items-start tablet:flex-col tablet:gap-3"
              >
                <div className="flex-shrink-0 w-[150px] tablet:w-auto">
                  <span className="text-[13px] text-[#777] dark:text-[#888]">
                    {edu.period.split(" – ")[0]}
                  </span>
                  {edu.ongoing && (
                    <span className="block text-[11px] font-bold text-accent uppercase tracking-[0.5px] mt-1">
                      In Progress
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-[20px] font-bold text-[#111] dark:text-white group-hover:text-accent transition-colors leading-[1.3]">
                    {edu.degree}
                  </h3>
                  <p className="text-[15px] font-semibold text-accent mt-2">{edu.school}</p>
                  <p className="text-[13px] text-[#777] dark:text-[#888] mt-1">{edu.period}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ FOOTER ═════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#0d0d0d] text-[#f0ede8]" id="contact">
        <div className="px-12 pt-24 pb-12 max-w-[1200px] mx-auto w-full tablet:px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VP}
            variants={stagger}
          >
            <motion.p variants={fadeIn} className="text-[12px] uppercase tracking-[3px] text-accent font-semibold mb-6">
              Get In Touch
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="font-black leading-[0.93] uppercase text-[#f0ede8] mb-12"
              style={{ fontSize: "clamp(44px, 8.5vw, 124px)" }}
            >
              Let's Connect<br />There
            </motion.h2>

            <motion.div variants={fadeUp} className="flex gap-4 flex-wrap mb-20">
              <button
                onClick={() => setContactOpen(true)}
                className="px-8 py-4 rounded-full bg-accent text-white text-[15px] font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_30px_rgba(224,53,0,0.4)] cursor-pointer"
              >
                Send a Message
              </button>
              <a
                href="mailto:alirezakbarim@gmail.com"
                className="px-8 py-4 rounded-full border border-white/20 text-[#999] text-[15px] font-semibold hover:border-accent hover:text-accent transition-colors"
              >
                alirezakbarim@gmail.com
              </a>
            </motion.div>

            <motion.div variants={fadeIn} className="h-px bg-white/10 mb-8" />

            <motion.div variants={fadeIn} className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-[#555] text-[13px]">© 2026 Alireza Akbari. All rights reserved.</p>
              <div className="flex items-center gap-6">
                {["GitHub", "LinkedIn", "Dribbble"].map((s) => (
                  <span key={s} className="text-[13px] text-[#555] hover:text-[#999] transition-colors cursor-default">
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};
