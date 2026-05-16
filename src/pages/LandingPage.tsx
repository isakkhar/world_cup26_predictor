import React from 'react';
import { Trophy, LayoutGrid, Layers, ArrowRight, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-container">
      {/* Dynamic Background Elements */}
      <div className="bg-glow blue-glow"></div>
      <div className="bg-glow gold-glow"></div>
      <div className="stadium-overlay"></div>

      <nav className="top-nav">
        <div className="logo-section">
          <Trophy size={24} className="gold-text" />
          <span className="brand-name">WC2026<span className="dim">Predictor</span></span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#stats">Leaderboard</a>
          <button className="nav-cta" onClick={() => navigate('/predict')}>Start Now</button>
        </div>
      </nav>

      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            OFFICIAL 2026 BRACKET SIMULATOR
          </div>
          <h1 className="hero-main-title">
            Predict the <span className="text-gradient">Champions</span><br />
            of the World.
          </h1>
          <p className="hero-description">
            Experience the most advanced 48-team tournament predictor. 
            Simulate every match from the opening kickoff to the final at MetLife Stadium.
          </p>
          <div className="hero-cta-group">
            <button className="primary-cta" onClick={() => navigate('/predict')}>
              Launch Predictor <ArrowRight size={20} />
            </button>
            <button className="secondary-cta">
              How it works
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="trophy-platform">
            <img 
              src="/trophy.png" 
              alt="World Cup Trophy" 
              className="hero-trophy-img"
            />
            <div className="platform-glow"></div>
          </div>
        </div>
      </header>

      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why use our Predictor?</h2>
          <p className="section-subtitle">Designed for fans, experts, and data enthusiasts alike.</p>
        </div>
        
        <div className="features-grid">
          <div className="premium-feature-card">
            <div className="feature-icon blue">
              <LayoutGrid size={28} />
            </div>
            <h3>48-Team Logic</h3>
            <p>Full implementation of the new 12-group format including the complex 32-team knockout transition.</p>
          </div>

          <div className="premium-feature-card">
            <div className="feature-icon gold">
              <Layers size={28} />
            </div>
            <h3>3rd Place Math</h3>
            <p>Our algorithm handles all 495 possible third-place combinations instantly as you rank your groups.</p>
          </div>

          <div className="premium-feature-card">
            <div className="feature-icon purple">
              <Globe size={28} />
            </div>
            <h3>Global Insights</h3>
            <p>See live community trends. Who does the world think will lift the trophy in New York/New Jersey?</p>
          </div>
        </div>
      </section>

      <section id="stats" className="stats-showcase">
        <div className="stats-card-premium">
          <div className="stats-left">
            <div className="stat-badge">LIVE TRENDS</div>
            <h3>Current Favorites</h3>
            <p>Based on 25,000+ community brackets</p>
          </div>
          <div className="stats-right">
            <div className="mini-stat">
              <span className="stat-val">32%</span>
              <span className="stat-team">Spain</span>
              <div className="stat-bar"><div className="fill" style={{ width: '32%' }}></div></div>
            </div>
            <div className="mini-stat">
              <span className="stat-val">28%</span>
              <span className="stat-team">France</span>
              <div className="stat-bar"><div className="fill" style={{ width: '28%' }}></div></div>
            </div>
            <div className="mini-stat">
              <span className="stat-val">15%</span>
              <span className="stat-team">Argentina</span>
              <div className="stat-bar"><div className="fill" style={{ width: '15%' }}></div></div>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-info">
            <h3>WC2026<span className="dim">Predictor</span></h3>
            <p>The ultimate tournament simulation experience.</p>
          </div>
          <div className="footer-contact">
            <span>Sakkhar Saha</span>
            <span>isakkhar@gmail.com</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 • Designed AI Sakkhar Saha</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
