import React, { useEffect, useRef } from 'react';
import { Trophy, LayoutGrid, Layers, ArrowRight, TrendingUp, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const cardsRef = useRef<HTMLDivElement>(null);

  // Dynamic glow effect for bento cards
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardsRef.current) return;
      const cards = cardsRef.current.getElementsByClassName('bento-card');
      for (const card of Array.from(cards) as HTMLElement[]) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="landing-container">
      {/* Dynamic Background Elements */}
      <div className="bg-glow-container">
        <div className="bg-glow glow-1"></div>
        <div className="bg-glow glow-2"></div>
        <div className="bg-glow glow-3"></div>
      </div>
      <div className="stadium-overlay"></div>

      <nav className="top-nav">
        <div className="logo-section">
          <Trophy size={28} className="gold-text" />
          <span className="brand-name">WC2026<span className="dim">Predictor</span></span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#stats">Live Insights</a>
          <button className="nav-cta" onClick={() => navigate('/predict')}>Start Predicting</button>
        </div>
      </nav>

      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            THE ULTIMATE 2026 BRACKET SIMULATOR
          </div>
          <h1 className="hero-main-title">
            Predict the <span className="text-gradient">Champions</span><br />
            of the World.
          </h1>
          <p className="hero-description">
            Experience the most advanced 48-team tournament predictor. 
            Simulate every match from the opening kickoff in North America to the final at MetLife Stadium.
          </p>
          <div className="hero-cta-group">
            <button className="primary-cta" onClick={() => navigate('/predict')}>
              Launch Predictor <ArrowRight size={24} />
            </button>
            <button className="secondary-cta" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Features
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
          <p className="section-subtitle">A stunning dashboard built for fans, experts, and data enthusiasts alike.</p>
        </div>
        
        <div className="features-bento-grid" ref={cardsRef}>
          <div className="bento-card large">
            <div className="bento-content">
              <div className="feature-icon-wrap icon-blue">
                <LayoutGrid size={32} />
              </div>
              <h3>48-Team Complex Logic</h3>
              <p>Full implementation of the new 12-group format including the complex 32-team knockout transition and automated bracket generation based on official FIFA rules.</p>
            </div>
            <div className="bento-visual">
              Interactive Group Stage UI
            </div>
          </div>

          <div className="bento-card">
            <div className="feature-icon-wrap icon-purple">
              <Layers size={32} />
            </div>
            <h3>3rd Place Math</h3>
            <p>Our algorithm handles all 495 possible third-place advancing combinations instantly as you rank your groups.</p>
          </div>

          <div className="bento-card">
            <div className="feature-icon-wrap icon-gold">
              <Trophy size={32} />
            </div>
            <h3>Rankings & Analysis</h3>
            <p>Access live FIFA rankings, star player info, and key historical stats for every single nation directly in the app.</p>
          </div>

          <div className="bento-card">
            <div className="feature-icon-wrap icon-pink">
              <TrendingUp size={32} />
            </div>
            <h3>Global Leaderboards</h3>
            <p>See live community trends. Who does the world think will lift the trophy? Share and compare your brackets.</p>
          </div>
          
          <div className="bento-card large">
            <div className="bento-content">
              <div className="feature-icon-wrap icon-blue" style={{ background: 'linear-gradient(135deg, #10b981, #059669)'}}>
                <ShieldCheck size={32} />
              </div>
              <h3>Instant Result Processing</h3>
              <p>Zero loading screens. Advance teams, pick match winners, and simulate the entire tournament flawlessly with an ultra-responsive client-side architecture.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="stats" className="stats-showcase">
        <div className="stats-card-premium">
          <div className="stats-left">
            <div className="stat-badge">LIVE TRENDS</div>
            <h3>Global Favorites</h3>
            <p>Based on over 50,000+ community tournament simulations. See who the world is backing to win it all in 2026.</p>
          </div>
          <div className="stats-right">
            <div className="mini-stat">
              <div className="stat-header">
                <span className="stat-team">Spain</span>
                <span className="stat-val">32%</span>
              </div>
              <div className="stat-bar"><div className="fill fill-1" style={{ width: '32%' }}></div></div>
            </div>
            <div className="mini-stat">
              <div className="stat-header">
                <span className="stat-team">France</span>
                <span className="stat-val">28%</span>
              </div>
              <div className="stat-bar"><div className="fill fill-2" style={{ width: '28%' }}></div></div>
            </div>
            <div className="mini-stat">
              <div className="stat-header">
                <span className="stat-team">Brazil</span>
                <span className="stat-val">15%</span>
              </div>
              <div className="stat-bar"><div className="fill fill-3" style={{ width: '15%' }}></div></div>
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
            <span><a href="mailto:isakkhar@gmail.com">isakkhar@gmail.com</a></span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 • Designed & Developed by <a href="https://github.com/isakkhar" target="_blank" rel="noopener noreferrer">Sakkhar</a></p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
