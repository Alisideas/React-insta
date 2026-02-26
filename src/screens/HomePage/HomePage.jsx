import React from "react";
import "./style.css";

export const HomePage = () => {
  const skills = [
    { name: "React.js / Next.js", level: 90 },
    { name: "JavaScript", level: 88 },
    { name: "Flutter", level: 80 },
    { name: "HTML / CSS", level: 92 },
    { name: "WordPress", level: 85 },
    { name: "UI/UX Design", level: 82 },
  ];

  const experience = [
    {
      role: "Senior Web Designer",
      company: "Mishov Markets",
      period: "Sep 2025 – Feb 2026",
      location: "Istanbul, Türkiye",
      description:
        "Designed and delivered high-quality web interfaces for a fast-growing markets platform, focusing on visual consistency and user experience.",
      tags: ["UI/UX", "Web Design", "React"],
    },
    {
      role: "Full-stack Developer",
      company: "NiaTech",
      period: "May 2024 – Nov 2024",
      location: "Istanbul, Türkiye",
      description:
        "Developed modern, high-performance web applications using Next.js. Designed and built user interfaces with React/Next.js, developed backend APIs, worked with databases, and ensured application performance and security.",
      tags: ["Next.js", "React", "Node.js", "APIs"],
    },
    {
      role: "Frontend Developer",
      company: "Dextern",
      period: "Jun 2022 – Jan 2024",
      location: "Ireland",
      description:
        "Developed modern, interactive web applications using React.js and built cross-platform mobile apps with Flutter. Also used WordPress for dynamic websites, implementing responsive UIs and optimizing performance.",
      tags: ["React.js", "Flutter", "WordPress"],
    },
    {
      role: "Web Developer",
      company: "Zebrit",
      period: "Jun 2022 – Nov 2023",
      location: "Ireland",
      description:
        "Built and customized WordPress websites for various clients. Developed custom themes and plugins, optimized performance, ensured responsive design, and managed content with Elementor.",
      tags: ["WordPress", "Elementor", "PHP"],
    },
    {
      role: "Web Developer",
      company: "49 Tech Hub",
      period: "Apr 2021 – Jun 2022",
      location: "Istanbul, Turkey",
      description:
        "Created WordPress-based websites with custom themes and plugins. Optimized website performance and provided ongoing technical support and regular updates for client projects.",
      tags: ["WordPress", "Elementor", "HTML/CSS"],
    },
  ];

  const education = [
    {
      degree: "Master of Engineering — AI & Data Science",
      school: "İstanbul Aydin University",
      period: "Oct 2025 – Oct 2027",
      ongoing: true,
    },
    {
      degree: "Bachelor's Degree — Computer Engineering",
      school: "İstanbul Aydin University",
      period: "Jan 2020 – Dec 2024",
      ongoing: false,
    },
  ];

  return (
    <div className="portfolio">
      {/* Header */}
      <header className="header">
        <div className="logo">AA</div>
        <nav className="nav">
          <a href="#about" className="nav-link">About</a>
          <a href="#skills" className="nav-link">Skills</a>
          <a href="#experience" className="nav-link">Experience</a>
          <a href="#education" className="nav-link">Education</a>
          <a href="#contact" className="nav-link nav-cta">Hire Me</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <p className="hero-greeting">Hello, I'm</p>
          <h1 className="hero-name">Alireza</h1>
          <h2 className="hero-role">
            Full-stack Developer <span className="accent">&</span> UI/UX Designer
          </h2>
          <p className="hero-bio">
            Passionate about building visually appealing and user-friendly websites
            and applications. Experienced in React.js, Next.js, Flutter, and
            WordPress — currently based in Istanbul.
          </p>
          <div className="hero-actions">
            <a href="#experience" className="btn btn-primary">View Experience</a>
            <a href="#contact" className="btn btn-outline">Contact Me</a>
          </div>
        </div>
        <div className="hero-avatar">
          <div className="avatar-circle">
            <span className="avatar-initials">AA</span>
          </div>
          <div className="avatar-ring" />
        </div>
      </section>

      {/* About */}
      <section className="about" id="about">
        <div className="section-inner">
          <h2 className="section-title">
            About <span className="accent">Me</span>
          </h2>
          <div className="about-grid">
            <div className="about-text">
              <p>
                I'm <strong>Alireza</strong>, a passionate web developer and UI/UX
                designer with a strong background in HTML, CSS, JavaScript, Flutter,
                and React.js. I love creating beautiful, functional products that
                people enjoy using.
              </p>
              <p>
                I have worked on a variety of projects including e-commerce
                websites, marketing websites, and mobile applications. I'm always
                looking to learn new technologies and stay up-to-date with the
                latest industry trends.
              </p>
              <p>
                When I'm not coding, you can find me staying active outdoors or
                tinkering with new tech gadgets. Currently based in{" "}
                <strong>Istanbul</strong>!
              </p>
            </div>
            <div className="about-stats">
              <div className="stat">
                <span className="stat-number accent">5+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat">
                <span className="stat-number accent">5</span>
                <span className="stat-label">Companies Worked At</span>
              </div>
              <div className="stat">
                <span className="stat-number accent">2</span>
                <span className="stat-label">Degrees (incl. MEng AI)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="skills" id="skills">
        <div className="section-inner">
          <h2 className="section-title">
            My <span className="accent">Skills</span>
          </h2>
          <div className="skills-grid">
            {skills.map((skill) => (
              <div className="skill-item" key={skill.name}>
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-percent accent">{skill.level}%</span>
                </div>
                <div className="skill-bar">
                  <div
                    className="skill-fill"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="experience-section" id="experience">
        <div className="section-inner">
          <h2 className="section-title">
            Work <span className="accent">Experience</span>
          </h2>
          <div className="timeline">
            {experience.map((job, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-dot" />
                <div className="timeline-card">
                  <div className="timeline-header">
                    <div>
                      <h3 className="job-role">{job.role}</h3>
                      <p className="job-company accent">{job.company}</p>
                    </div>
                    <div className="job-meta">
                      <span className="job-period">{job.period}</span>
                      <span className="job-location">{job.location}</span>
                    </div>
                  </div>
                  <p className="job-desc">{job.description}</p>
                  <div className="project-tags">
                    {job.tags.map((tag) => (
                      <span className="tag" key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="education-section" id="education">
        <div className="section-inner">
          <h2 className="section-title">
            My <span className="accent">Education</span>
          </h2>
          <div className="edu-grid">
            {education.map((edu, index) => (
              <div className="edu-card" key={index}>
                <div className="edu-icon accent">🎓</div>
                <div className="edu-body">
                  <h3 className="edu-degree">{edu.degree}</h3>
                  <p className="edu-school">{edu.school}</p>
                  <span className="edu-period">
                    {edu.period}
                    {edu.ongoing && <span className="edu-badge">In Progress</span>}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer className="footer" id="contact">
        <div className="footer-inner">
          <h2 className="footer-title">
            Let's <span className="accent">Work Together</span>
          </h2>
          <p className="footer-sub">
            Have a project in mind? I'd love to hear from you.
          </p>
          <a href="mailto:Alirezakbarim@gmail.com" className="btn btn-primary footer-btn">
            Get In Touch
          </a>
          <div className="footer-divider" />
          <p className="footer-copy">
            © 2026 Alireza. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
