import React from "react";
import "./style.css";

export const HomePage = () => {
  const skills = [
    { name: "React", level: 90 },
    { name: "JavaScript", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "MongoDB", level: 75 },
    { name: "UI/UX Design", level: 88 },
    { name: "CSS / Tailwind", level: 85 },
  ];

  const projects = [
    {
      title: "InstaChef",
      description:
        "A food-tech web application for discovering and sharing recipes. Built with React and a modern UI/UX approach.",
      tags: ["React", "CSS", "UI/UX"],
    },
    {
      title: "Portfolio Website",
      description:
        "A personal portfolio site designed to showcase projects and skills with a clean, dark aesthetic.",
      tags: ["React", "Node.js", "Design"],
    },
    {
      title: "E-Commerce Dashboard",
      description:
        "A full-stack admin dashboard for managing products, orders, and analytics with real-time data.",
      tags: ["React", "Node.js", "MongoDB"],
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
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#contact" className="nav-link nav-cta">Hire Me</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <p className="hero-greeting">Hello, I'm</p>
          <h1 className="hero-name">Alireza Akbari</h1>
          <h2 className="hero-role">
            Web Developer <span className="accent">&</span> UI/UX Designer
          </h2>
          <p className="hero-bio">
            I craft beautiful, functional web experiences — from pixel-perfect
            interfaces to robust backend systems.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">View My Work</a>
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
                I'm <strong>Alireza Akbari</strong>, a passionate web developer
                and UI/UX designer with a love for building clean, intuitive
                digital products. I work across the full stack — from designing
                in Figma to deploying with Node.js and MongoDB.
              </p>
              <p>
                My goal is to combine great design with solid engineering to
                create products that people enjoy using.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat">
                <span className="stat-number accent">3+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat">
                <span className="stat-number accent">20+</span>
                <span className="stat-label">Projects Done</span>
              </div>
              <div className="stat">
                <span className="stat-number accent">10+</span>
                <span className="stat-label">Happy Clients</span>
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

      {/* Projects */}
      <section className="projects" id="projects">
        <div className="section-inner">
          <h2 className="section-title">
            My <span className="accent">Projects</span>
          </h2>
          <div className="projects-grid">
            {projects.map((project) => (
              <div className="project-card" key={project.title}>
                <div className="project-top">
                  <div className="project-icon accent">&#123;&#125;</div>
                </div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
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
          <a href="mailto:alireza@example.com" className="btn btn-primary footer-btn">
            Get In Touch
          </a>
          <div className="footer-divider" />
          <p className="footer-copy">
            © 2024 Alireza Akbari. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
