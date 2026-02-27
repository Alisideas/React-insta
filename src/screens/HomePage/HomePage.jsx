import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import "./style.css";

const EMAILJS_SERVICE_ID  = "service_4wybl75";
const EMAILJS_TEMPLATE_ID = "template_cuh0gy8";
const EMAILJS_PUBLIC_KEY  = "z2tTgeKX1tEBNoZ1n";

// ─── Shared animation variants ───────────────────────────────────────────────
const EASE = [0.25, 0.1, 0.25, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.7, ease: EASE } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.7 } },
};

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.7, ease: EASE } },
};

const slideRight = {
  hidden: { opacity: 0, x: 60 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.7, ease: EASE } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};

const staggerFast = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

const VP = { once: true, margin: "-80px" }; // shared viewport config
// ─────────────────────────────────────────────────────────────────────────────

const inputCls =
  "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white " +
  "placeholder:text-muted focus:outline-none focus:border-accent/60 " +
  "focus:bg-white/10 transition-all text-[15px]";

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
        { from_name: form.name, from_email: form.email, subject: form.subject, message: form.message, to_email: "alirezakbarim@gmail.com" },
        EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{    opacity: 0, scale: 0.93, y: 24 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-white/10">
          <div>
            <h2 className="text-[24px] font-extrabold">
              Get In <span className="text-accent">Touch</span>
            </h2>
            <p className="text-muted text-[14px] mt-1">I'll reply within 24 hours.</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted hover:text-white hover:bg-white/10 transition-all text-lg leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal body */}
        <div className="px-8 py-6">
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex flex-col items-center gap-4 py-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center text-[28px]">✓</div>
              <p className="text-[18px] font-bold text-white">Message sent!</p>
              <p className="text-muted text-[14px]">Thanks for reaching out. I'll get back to you soon.</p>
              <button onClick={onClose} className="mt-2 px-6 py-2 rounded-xl bg-white/5 border border-white/15 text-muted hover:text-white hover:bg-white/10 transition-all text-[14px]">Close</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 tablet:grid-cols-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] text-muted font-medium">Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] text-muted font-medium">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" className={inputCls} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-muted font-medium">Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} required placeholder="What's this about?" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-muted font-medium">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Tell me about your project..." className={`${inputCls} resize-none`} />
              </div>
              {status === "error" && (
                <p className="text-red-400 text-[13px] bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  Something went wrong. Please try again or email me at{" "}
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

export const HomePage = () => {
  const [contactOpen, setContactOpen] = useState(false);

  const skills = [
    { name: "React.js / Next.js", level: 90 },
    { name: "JavaScript",         level: 88 },
    { name: "Flutter",            level: 80 },
    { name: "HTML / CSS",         level: 92 },
    { name: "WordPress",          level: 85 },
    { name: "UI/UX Design",       level: 82 },
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
      description: "Developed modern, high-performance web applications using Next.js. Designed and built user interfaces with React/Next.js, developed backend APIs, worked with databases, and ensured application performance and security.",
      tags: ["Next.js", "React", "Node.js", "APIs"],
    },
    {
      role: "Frontend Developer", company: "Dextern",
      period: "Jun 2022 – Jan 2024", location: "Ireland",
      description: "Developed modern, interactive web applications using React.js and built cross-platform mobile apps with Flutter. Also used WordPress for dynamic websites, implementing responsive UIs and optimizing performance.",
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
    { degree: "Master of Engineering — AI & Data Science", school: "İstanbul Aydin University", period: "Oct 2025 – Oct 2027", ongoing: true },
    { degree: "Bachelor's Degree — Computer Engineering",  school: "İstanbul Aydin University", period: "Jan 2020 – Dec 2024", ongoing: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#080810] relative overflow-x-hidden">

      {/* Decorative glow orbs */}
      <div className="fixed top-[-15%] right-[-10%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-[50%] left-[60%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Contact modal with enter/exit animation */}
      <AnimatePresence>
        {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
      </AnimatePresence>

      {/* ── Sticky Glass Navbar — slides down on page load ── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="sticky top-0 z-[100] flex items-center justify-between py-5 px-12 bg-white/5 backdrop-blur-2xl border-b border-white/10 shadow-lg tablet:px-6 tablet:py-4"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          className="text-[22px] font-extrabold text-accent tracking-[2px]"
        >
          AA
        </motion.div>
        <motion.nav
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } }}
          className="flex items-center gap-8 tablet:gap-4"
        >
          {["About", "Skills", "Experience", "Education"].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              variants={fadeIn}
              className="text-muted text-[15px] font-medium hover:text-white transition-colors"
            >
              {item}
            </motion.a>
          ))}
          <motion.button
            variants={fadeIn}
            onClick={() => setContactOpen(true)}
            className="bg-accent/90 backdrop-blur-sm text-white px-[22px] py-[10px] rounded-xl font-semibold hover:bg-accent transition-colors border border-accent/50 cursor-pointer"
          >
            Hire Me
          </motion.button>
        </motion.nav>
      </motion.header>

      {/* ── Hero — staggered entrance on page load ── */}
      <section
        className="min-h-[calc(100vh-80px)] flex items-center justify-between gap-12 max-w-[1100px] mx-auto px-8 py-20 w-full tablet:flex-col tablet:text-center"
        id="hero"
      >
        {/* Left content — staggered fade-up */}
        <motion.div
          className="flex-1 max-w-[600px]"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.p variants={fadeUp} className="text-accent text-[18px] font-semibold tracking-[2px] uppercase mb-2">
            Hello, I'm
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-[64px] font-black leading-[1.05] mb-3 tablet:text-[44px] mobile:text-[36px]">
            Alireza
          </motion.h1>
          <motion.h2 variants={fadeUp} className="text-[26px] font-semibold text-muted mb-6">
            Full-stack Developer <span className="text-accent">&</span> UI/UX Designer
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[17px] text-muted leading-[1.7] mb-10 max-w-[500px] tablet:max-w-full">
            Passionate about building visually appealing and user-friendly websites
            and applications. Experienced in React.js, Next.js, Flutter, and
            WordPress — currently based in Istanbul.
          </motion.p>
          <motion.div variants={fadeUp} className="flex gap-4 flex-wrap tablet:justify-center">
            <a href="#experience" className="inline-block px-8 py-[14px] rounded-xl text-[15px] font-semibold bg-accent text-white hover:bg-accent-dark transition-colors shadow-[0_0_24px_rgba(224,53,0,0.35)]">
              View Experience
            </a>
            <button
              onClick={() => setContactOpen(true)}
              className="inline-block px-8 py-[14px] rounded-xl text-[15px] font-semibold bg-white/5 backdrop-blur-sm border border-white/20 text-white hover:border-accent/60 hover:bg-white/10 transition-all cursor-pointer"
            >
              Contact Me
            </button>
          </motion.div>
        </motion.div>

        {/* Right — avatar slides in from right, then floats */}
        <motion.div
          className="flex-shrink-0 relative w-[280px] h-[280px] mobile:w-[200px] mobile:h-[200px]"
          variants={slideRight}
          initial="hidden"
          animate="show"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-[260px] h-[260px] rounded-full bg-gradient-to-br from-accent to-[#ff6b35] flex items-center justify-center relative z-[1] shadow-[0_0_60px_rgba(224,53,0,0.4)] mobile:w-[180px] mobile:h-[180px]"
          >
            <span className="text-[72px] font-black text-white tracking-[4px] mobile:text-[52px]">AA</span>
          </motion.div>
          <div className="absolute -top-[10px] -left-[10px] w-[280px] h-[280px] rounded-full border-2 border-dashed border-accent opacity-40 animate-spin-slow mobile:w-[200px] mobile:h-[200px]" />
        </motion.div>
      </section>

      {/* ── About ── */}
      <section className="border-t border-white/[0.08]" id="about">
        <motion.div
          className="max-w-[1100px] mx-auto px-8 py-24"
          initial="hidden"
          whileInView="show"
          viewport={VP}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-[40px] font-extrabold mb-14 text-center mobile:text-[30px]">
            About <span className="text-accent">Me</span>
          </motion.h2>
          <div className="grid grid-cols-2 gap-16 items-center tablet:grid-cols-1 tablet:gap-10">
            {/* Text card slides in from left */}
            <motion.div
              variants={slideLeft}
              className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl"
            >
              <p className="text-[16px] text-muted leading-[1.8] mb-4">
                I'm <strong className="text-white">Alireza</strong>, a passionate web developer and UI/UX
                designer with a strong background in HTML, CSS, JavaScript, Flutter,
                and React.js. I love creating beautiful, functional products that people enjoy using.
              </p>
              <p className="text-[16px] text-muted leading-[1.8] mb-4">
                I have worked on a variety of projects including e-commerce websites, marketing
                websites, and mobile applications. I'm always looking to learn new technologies
                and stay up-to-date with the latest industry trends.
              </p>
              <p className="text-[16px] text-muted leading-[1.8]">
                When I'm not coding, you can find me staying active outdoors or tinkering with
                new tech gadgets. Currently based in <strong className="text-white">Istanbul</strong>!
              </p>
            </motion.div>

            {/* Stats stagger in from right */}
            <motion.div variants={staggerFast} className="flex flex-col gap-6">
              {[
                { num: "5+", label: "Years Experience" },
                { num: "5",  label: "Companies Worked At" },
                { num: "2",  label: "Degrees (incl. MEng AI)" },
              ].map(({ num, label }) => (
                <motion.div
                  key={label}
                  variants={slideRight}
                  whileHover={{ x: 6, transition: { duration: 0.2 } }}
                  className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl px-8 py-6 shadow-xl flex items-center gap-6"
                >
                  <span className="text-[48px] font-black leading-none text-accent">{num}</span>
                  <span className="text-[15px] text-muted uppercase tracking-[1px]">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Skills ── */}
      <section className="border-t border-white/[0.08]" id="skills">
        <motion.div
          className="max-w-[1100px] mx-auto px-8 py-24"
          initial="hidden"
          whileInView="show"
          viewport={VP}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-[40px] font-extrabold mb-14 text-center mobile:text-[30px]">
            My <span className="text-accent">Skills</span>
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl grid grid-cols-2 gap-y-8 gap-x-16 tablet:grid-cols-1"
          >
            {skills.map((skill, i) => (
              <div className="flex flex-col gap-2" key={skill.name}>
                <div className="flex justify-between">
                  <span className="text-[15px] font-semibold">{skill.name}</span>
                  <span className="text-[14px] font-bold text-accent">{skill.level}%</span>
                </div>
                <div className="h-[6px] bg-white/10 rounded-full overflow-hidden">
                  {/* Width animates from 0 to level% when scrolled into view */}
                  <motion.div
                    className="h-full bg-accent rounded-full shadow-[0_0_8px_rgba(224,53,0,0.6)]"
                    initial={{ width: "0%" }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 + i * 0.06 }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Experience ── */}
      <section className="border-t border-white/[0.08]" id="experience">
        <motion.div
          className="max-w-[1100px] mx-auto px-8 py-24"
          initial="hidden"
          whileInView="show"
          viewport={VP}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-[40px] font-extrabold mb-14 text-center mobile:text-[30px]">
            Work <span className="text-accent">Experience</span>
          </motion.h2>
          <div className="flex flex-col relative pl-8 border-l-2 border-white/10">
            {experience.map((job, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="relative pb-10 last:pb-0"
              >
                <div className="absolute -left-[41px] top-2 w-[14px] h-[14px] rounded-full bg-accent border-[3px] border-[#080810] z-[1] shadow-[0_0_10px_rgba(224,53,0,0.6)]" />
                <motion.div
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-xl px-8 py-7 flex flex-col gap-[14px] hover:border-accent/40 hover:bg-white/[0.07] transition-colors shadow-xl"
                >
                  <div className="flex justify-between items-start gap-4 flex-wrap tablet:flex-col">
                    <div>
                      <h3 className="text-[18px] font-bold mb-1">{job.role}</h3>
                      <p className="text-[15px] font-semibold text-accent">{job.company}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 tablet:items-start">
                      <span className="text-[13px] text-muted whitespace-nowrap">{job.period}</span>
                      <span className="text-[12px] text-muted whitespace-nowrap">{job.location}</span>
                    </div>
                  </div>
                  <p className="text-[14px] text-muted leading-[1.7]">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {job.tags.map((tag) => (
                      <span key={tag} className="bg-accent/10 backdrop-blur-sm text-accent text-[12px] font-semibold px-3 py-1 rounded-full border border-accent/25">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Education ── */}
      <section className="border-t border-white/[0.08]" id="education">
        <motion.div
          className="max-w-[1100px] mx-auto px-8 py-24"
          initial="hidden"
          whileInView="show"
          viewport={VP}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-[40px] font-extrabold mb-14 text-center mobile:text-[30px]">
            My <span className="text-accent">Education</span>
          </motion.h2>
          <motion.div variants={staggerFast} className="grid grid-cols-2 gap-6 tablet:grid-cols-1">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-xl p-8 flex gap-5 items-start hover:border-accent/40 hover:bg-white/[0.07] transition-colors shadow-xl"
              >
                <div className="text-[32px] flex-shrink-0">🎓</div>
                <div className="flex flex-col gap-[6px]">
                  <h3 className="text-[16px] font-bold leading-[1.4]">{edu.degree}</h3>
                  <p className="text-[14px] text-accent font-semibold">{edu.school}</p>
                  <span className="text-[13px] text-muted flex items-center gap-[10px] flex-wrap">
                    {edu.period}
                    {edu.ongoing && (
                      <span className="bg-accent/10 text-accent text-[11px] font-bold px-[10px] py-[2px] rounded-full border border-accent/25 uppercase tracking-[0.5px]">
                        In Progress
                      </span>
                    )}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Footer / Contact ── */}
      <footer className="border-t border-white/[0.08] px-8 pt-20 pb-10" id="contact">
        <motion.div
          className="max-w-[600px] mx-auto text-center"
          initial="hidden"
          whileInView="show"
          viewport={VP}
          variants={stagger}
        >
          <motion.div
            variants={fadeUp}
            className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl px-12 py-14 shadow-xl"
          >
            <h2 className="text-[40px] font-extrabold mb-4 mobile:text-[30px]">
              Let's <span className="text-accent">Work Together</span>
            </h2>
            <p className="text-muted text-[16px] mb-10">
              Have a project in mind? I'd love to hear from you.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setContactOpen(true)}
              className="inline-block px-8 py-[14px] rounded-xl text-[16px] font-semibold bg-accent text-white hover:bg-accent-dark transition-colors shadow-[0_0_24px_rgba(224,53,0,0.35)] cursor-pointer"
            >
              Get In Touch
            </motion.button>
          </motion.div>
          <motion.div variants={fadeIn} className="h-px bg-white/10 mt-12 mb-6" />
          <motion.p variants={fadeIn} className="text-muted text-[13px]">
            © 2026 Alireza. All rights reserved.
          </motion.p>
        </motion.div>
      </footer>
    </div>
  );
};
