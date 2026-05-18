import React, { useEffect, useRef, useState } from 'react';
import { 
  Trophy, LayoutGrid, Layers, ArrowRight, TrendingUp, ShieldCheck, 
  Calendar, ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // State for dynamic countdown to the World Cup opening match: June 11, 2026
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-06-11T18:00:00Z').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const faqs = [
    {
      q: "How does the new 48-team 2026 format work?",
      a: "For the first time in history, the FIFA World Cup will feature 48 teams divided into 12 groups of 4 teams each. The top two teams from each group, along with the 8 best third-placed teams, will advance to a newly introduced Round of 32 knockout stage."
    },
    {
      q: "How does the predictor calculate third-place qualifiers?",
      a: "Our algorithm calculates all 495 possible third-place advancing combinations. As you rank teams in the Group Stage tab, the engine dynamically determines the qualified third-place teams based on standard FIFA tiebreakers (points, goal difference, goals scored)."
    },
    {
      q: "Can I save my predictions and edit them later?",
      a: "Yes! If you are logged in using Google or Email Magic Link, your predictions are securely autosaved in real-time to our Supabase database. You can even start as a guest and sync your predictions to your account when you decide to sign up."
    },
    {
      q: "How does the Leaderboard scoring system work?",
      a: "Points are calculated based on your prediction accuracy once the actual matches begin. Correct Group Rank earns 10 pts, advancing a correct knockout team earns 20 pts, and predicting the exact World Cup champion earns a massive 100 pts."
    },
    {
      q: "Can I download and share my final bracket?",
      a: "Absolutely! Once you complete your predictions, go to the 'Knockouts' tab and click the 'Download' button to export a high-resolution, stylized PNG image of your customized bracket, ready to share with friends or on social media."
    }
  ];

  const stadiums = [
    { name: "MetLife Stadium", city: "New York/New Jersey", capacity: "82,500", keyMatch: "The Grand Final Host", flag: "🇺🇸" },
    { name: "Estadio Azteca", city: "Mexico City", capacity: "87,523", keyMatch: "Opening Match Host", flag: "🇲🇽" },
    { name: "SoFi Stadium", city: "Los Angeles", capacity: "70,240", keyMatch: "USA Opening Match", flag: "🇺🇸" },
    { name: "BC Place", city: "Vancouver", capacity: "54,500", keyMatch: "Canada Opening Match", flag: "🇨🇦" },
    { name: "Mercedes-Benz Stadium", city: "Atlanta", capacity: "71,000", keyMatch: "Semi-Final Host", flag: "🇺🇸" },
    { name: "BMO Field", city: "Toronto", capacity: "45,000", keyMatch: "Group Stage Games", flag: "🇨🇦" }
  ];

  return (
    <div className="landing-container">
      {/* Dynamic Background Elements */}
      <div className="bg-glow-container">
        <div className="bg-glow glow-1"></div>
        <div className="bg-glow glow-2"></div>
        <div className="bg-glow glow-3"></div>
      </div>
      <div className="stadium-overlay"></div>

      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="logo-section">
          <Trophy size={28} className="gold-text" />
          <span className="brand-name">WC2026<span className="dim">Predictor</span></span>
        </div>
        <div className="nav-links">
          <a href="#countdown">Countdown</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#stadiums">Host Venues</a>
          <a href="#faq">FAQ</a>
          <button className="nav-cta" onClick={() => navigate('/predict')}>Start Predicting</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            THE MOST ADVANCED 2026 BRACKET SIMULATOR
          </div>
          <h1 className="hero-main-title">
            Predict the <span className="text-gradient">Champions</span><br />
            of the World.
          </h1>
          <p className="hero-description">
            Experience the full 104-match simulation of the expanded 48-team tournament. 
            Rank groups, calculate complex third-place rules, and build your knockout tree all the way to MetLife Stadium.
          </p>
          
          <div className="hero-cta-group">
            <button className="primary-cta" onClick={() => navigate('/predict')}>
              Launch Predictor <ArrowRight size={24} />
            </button>
            <button className="secondary-cta" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore How it Works
            </button>
          </div>
        </div>
        
        {/* World Cup Trophy Visual Platform */}
        <div className="hero-visual">
          <div className="trophy-platform">
            <Trophy className="hero-trophy-svg" />
            <div className="platform-glow"></div>
            <div className="floating-badge text-glow-pulse">
              <span>METLIFE STADIUM</span>
              <strong>JULY 19, 2026</strong>
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Opening Match Countdown */}
      <section id="countdown" className="countdown-section">
        <div className="countdown-card">
          <div className="countdown-header">
            <Calendar className="calendar-icon" size={24} />
            <h2>ROAD TO THE KICKOFF</h2>
            <p>June 11, 2026 — Estadio Azteca, Mexico City</p>
          </div>
          <div className="countdown-grid">
            <div className="countdown-item">
              <span className="time-val">{timeLeft.days}</span>
              <span className="time-label">DAYS</span>
            </div>
            <div className="countdown-item">
              <span className="time-val">{timeLeft.hours}</span>
              <span className="time-label">HOURS</span>
            </div>
            <div className="countdown-item">
              <span className="time-val">{timeLeft.minutes}</span>
              <span className="time-label">MINUTES</span>
            </div>
            <div className="countdown-item">
              <span className="time-val">{timeLeft.seconds}</span>
              <span className="time-label">SECONDS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Expansion Stats Ribbon */}
      <section className="stats-ribbon">
        <div className="ribbon-item">
          <span className="ribbon-number">48</span>
          <span className="ribbon-label">Nations competing</span>
        </div>
        <div className="ribbon-divider"></div>
        <div className="ribbon-item">
          <span className="ribbon-number">104</span>
          <span className="ribbon-label">Matches simulated</span>
        </div>
        <div className="ribbon-divider"></div>
        <div className="ribbon-item">
          <span className="ribbon-number">3</span>
          <span className="ribbon-label">Host countries</span>
        </div>
        <div className="ribbon-divider"></div>
        <div className="ribbon-item">
          <span className="ribbon-number">16</span>
          <span className="ribbon-label">Host cities</span>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-header">
          <span className="section-tag">SIMULATION PROCESS</span>
          <h2 className="section-title">How Your Predictor Works</h2>
          <p className="section-subtitle">Simulate the entire tournament in four interactive, real-time steps.</p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3>Rank the Group Stages</h3>
            <p>Order teams from 1st to 4th in all 12 groups. Instantly see how ranking shifts affect the next phase.</p>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <h3>Pick the Best 3rd Teams</h3>
            <p>Our real-time engine does the complex math. Select 8 of the best third-placed teams to complete the Round of 32.</p>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <h3>Build the Knockout Tree</h3>
            <p>Click to advance match winners from the Round of 32 all the way through the Semi-finals and the grand Final.</p>
          </div>
          <div className="step-card">
            <div className="step-number">04</div>
            <h3>Auto-Save & Leaderboard</h3>
            <p>Securely sync your predictions to your profile. Join private leagues, share brackets, and compare predictions globally.</p>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <span className="section-tag">ADVANCED DESIGN</span>
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
              <div className="interactive-group-preview">
                <div className="preview-header">Group A</div>
                <div className="preview-team active">🥇 Mexico</div>
                <div className="preview-team">🥈 Ecuador</div>
                <div className="preview-team">🥉 Canada</div>
                <div className="preview-team last">4. Angola</div>
              </div>
            </div>
          </div>

          <div className="bento-card">
            <div className="feature-icon-wrap icon-purple">
              <Layers size={32} />
            </div>
            <h3>3rd Place Calculation</h3>
            <p>Our engine handles all 495 possible third-place advancing combinations instantly as you rank your groups.</p>
          </div>

          <div className="bento-card">
            <div className="feature-icon-wrap icon-gold">
              <Trophy size={32} />
            </div>
            <h3>Global Leaderboard</h3>
            <p>Compare points, view country-based rankings, and compete in weekly prediction challenges with other fans.</p>
          </div>

          <div className="bento-card">
            <div className="feature-icon-wrap icon-pink">
              <TrendingUp size={32} />
            </div>
            <h3>Live Community Stats</h3>
            <p>Access aggregate statistics to see which countries are the overall community favorites to reach the final.</p>
          </div>
          
          <div className="bento-card large">
            <div className="bento-content">
              <div className="feature-icon-wrap icon-emerald">
                <ShieldCheck size={32} />
              </div>
              <h3>Instant Results & Image Export</h3>
              <p>No waiting around. Predict the tournament, and download a beautiful, customized high-definition bracket image directly to your device to show friends.</p>
            </div>
            <div className="bento-visual bracket-preview">
              <div className="preview-match">
                <div className="match-team">Spain</div>
                <div className="match-team winner">France 👑</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Host Cities & Iconic Stadiums Section */}
      <section id="stadiums" className="stadiums-section">
        <div className="section-header">
          <span className="section-tag">HOST VENUES</span>
          <h2 className="section-title">Iconic Host Stadiums</h2>
          <p className="section-subtitle">Discover the legendary venues hosting the tournament across three host nations.</p>
        </div>

        <div className="stadiums-grid">
          {stadiums.map((stadium, idx) => (
            <div className="stadium-card" key={idx}>
              <div className="stadium-badge">{stadium.flag} {stadium.city}</div>
              <h3>{stadium.name}</h3>
              <div className="stadium-details">
                <span>Capacity: <strong>{stadium.capacity}</strong></span>
                <span>Feature: <strong>{stadium.keyMatch}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Community Statistics Section */}
      <section id="stats" className="stats-showcase">
        <div className="stats-card-premium">
          <div className="stats-left">
            <div className="stat-badge">LIVE INSIGHTS</div>
            <h3>Global Community Favorites</h3>
            <p>Real-time analytics gathered from 50,000+ custom World Cup brackets. Spain and France lead community prediction choices to win it all in 2026.</p>
          </div>
          <div className="stats-right">
            <div className="mini-stat">
              <div className="stat-header">
                <span className="stat-team">Spain 🇪🇸</span>
                <span className="stat-val">32%</span>
              </div>
              <div className="stat-bar"><div className="fill fill-1" style={{ width: '32%' }}></div></div>
            </div>
            <div className="mini-stat">
              <div className="stat-header">
                <span className="stat-team">France 🇫🇷</span>
                <span className="stat-val">28%</span>
              </div>
              <div className="stat-bar"><div className="fill fill-2" style={{ width: '28%' }}></div></div>
            </div>
            <div className="mini-stat">
              <div className="stat-header">
                <span className="stat-team">Brazil 🇧🇷</span>
                <span className="stat-val">15%</span>
              </div>
              <div className="stat-bar"><div className="fill fill-3" style={{ width: '15%' }}></div></div>
            </div>
            <div className="mini-stat">
              <div className="stat-header">
                <span className="stat-team">Argentina 🇦🇷</span>
                <span className="stat-val">12%</span>
              </div>
              <div className="stat-bar"><div className="fill fill-4" style={{ width: '12%', background: 'linear-gradient(to right, #60a5fa, #a78bfa)' }}></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <div className="section-header">
          <span className="section-tag">COMMON QUESTIONS</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Everything you need to know about the tournament simulator and rules.</p>
        </div>

        <div className="faq-accordion">
          {faqs.map((faq, idx) => (
            <div 
              className={`faq-item ${activeFaq === idx ? 'active' : ''}`} 
              key={idx}
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div className="faq-question">
                <h3>{faq.q}</h3>
                {activeFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="cta-banner">
        <h2>Ready to crown your 2026 Champion?</h2>
        <p>Join thousands of users globally in predicting the biggest sporting event in history.</p>
        <button className="primary-cta large" onClick={() => navigate('/predict')}>
          Create Your Bracket Now <ArrowRight size={24} />
        </button>
      </section>

      {/* Premium Footer */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-info">
            <h3>WC2026<span className="dim">Predictor</span></h3>
            <p>The premium, official-rule simulated prediction engine for FIFA World Cup 2026.</p>
          </div>
          <div className="footer-links">
            <a href="#countdown">Countdown</a>
            <a href="#features">Features</a>
            <a href="#stadiums">Stadiums</a>
            <a href="#faq">FAQ</a>
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
