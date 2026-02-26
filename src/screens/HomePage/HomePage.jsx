import React from "react";
import "./style.css";

export const HomePage = () => {
  return (
    <div className="home-page">
      <header className="header">
        <div className="logo">
          <span className="logo-text">InstaChef</span>
        </div>
        <nav className="nav">
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">Recipes</a>
          <a href="#" className="nav-link">About</a>
          <a href="#" className="nav-link">Contact</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Cook Smarter, Eat Better</h1>
          <p className="hero-subtitle">
            Discover thousands of delicious recipes tailored to your taste and lifestyle.
          </p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">Why InstaChef?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🍳</div>
            <h3 className="feature-title">Easy Recipes</h3>
            <p className="feature-desc">Step-by-step guides for every skill level.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🥗</div>
            <h3 className="feature-title">Healthy Options</h3>
            <p className="feature-desc">Nutritious meals that taste amazing.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Quick & Fast</h3>
            <p className="feature-desc">Ready in 30 minutes or less.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p className="footer-text">© 2024 InstaChef. All rights reserved.</p>
      </footer>
    </div>
  );
};
