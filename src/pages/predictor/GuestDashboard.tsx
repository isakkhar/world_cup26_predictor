import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, ShieldAlert, Trophy, ArrowRight, RotateCcw, Sparkles, BarChart2 } from 'lucide-react';
import { usePredictor } from '../../context/PredictorContext';
import { getTeamColors } from '../../data/tournament';
import './Predictor.css';

const GuestDashboard: React.FC = () => {
  const { 
    predictions, 
    thirdPlaceSelected, 
    knockoutPredictions, 
    getTeamBySlot, 
    resetAll 
  } = usePredictor();
  const navigate = useNavigate();

  // 1. Group Stage calculations
  const totalGroups = 12;
  const completedGroupsCount = Object.keys(predictions).filter(
    groupId => predictions[groupId]?.length === 4
  ).length;
  const groupsPercent = Math.round((completedGroupsCount / totalGroups) * 100);

  // 2. Third Place calculations
  const completedThirdPlaceCount = thirdPlaceSelected.length;
  const thirdPlacePercent = Math.round((completedThirdPlaceCount / 8) * 100);

  // 3. Knockouts calculations
  const completedKnockoutsCount = Object.keys(knockoutPredictions).length;
  const knockoutsPercent = Math.round((completedKnockoutsCount / 32) * 100);

  // 4. Retrieve champion
  const champion = getTeamBySlot('W104');
  const championColors = champion ? getTeamColors(champion.id) : null;

  return (
    <div className="profile-container">
      {/* Background Glow */}
      <div className="auth-bg-orbs">
        <div className="auth-orb auth-orb-1" style={{ background: 'var(--primary, #c09300)' }}></div>
        <div className="auth-orb auth-orb-2" style={{ background: '#3b82f6' }}></div>
      </div>

      <div className="profile-card card-glowing-border">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-circle guest-avatar">
            <UserIcon size={32} />
          </div>
          <h2>Guest Predictor</h2>
          <div className="guest-badge-pill">
            <span className="pulse-dot"></span>
            Offline Mode / Local Session
          </div>
        </div>

        {/* Local Statistics Grid */}
        <div className="profile-stats-grid">
          <div className="profile-stat-item">
            <BarChart2 className="stat-icon" size={18} />
            <div className="stat-info">
              <span className="stat-label">Groups Ranks</span>
              <span className="stat-val">{completedGroupsCount} / {totalGroups} Ranked</span>
              <div className="stat-progress-bar">
                <div className="fill" style={{ width: `${groupsPercent}%`, backgroundColor: 'var(--primary)' }}></div>
              </div>
            </div>
          </div>
          <div className="profile-stat-item">
            <ShieldAlert className="stat-icon" size={18} />
            <div className="stat-info">
              <span className="stat-label">Best 3rd-Place</span>
              <span className="stat-val">{completedThirdPlaceCount} / 8 Selected</span>
              <div className="stat-progress-bar">
                <div className="fill" style={{ width: `${thirdPlacePercent}%`, backgroundColor: '#3b82f6' }}></div>
              </div>
            </div>
          </div>
          <div className="profile-stat-item">
            <Trophy className="stat-icon" size={18} />
            <div className="stat-info">
              <span className="stat-label">Knockout Stage</span>
              <span className="stat-val">{completedKnockoutsCount} / 32 Matches</span>
              <div className="stat-progress-bar">
                <div className="fill" style={{ width: `${knockoutsPercent}%`, backgroundColor: '#10b981' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Predicted Champion Section */}
        <div className="featured-champion-wrapper">
          <h3>🏆 Predicted Champion Showcase</h3>
          {champion ? (
            <div 
              className="featured-champion-card animate-fade-in"
              style={{
                borderColor: championColors?.primary,
                boxShadow: `0 0 25px ${championColors?.primaryGlow}, inset 0 0 10px ${championColors?.primaryGlow}`
              }}
            >
              <div className="champion-glow-backdrop" style={{ background: championColors?.primaryGlow }}></div>
              
              <div className="champion-card-layout">
                <div className="champion-flag-showcase">
                  <img 
                    src={`https://flagcdn.com/w160/${champion.flag.toLowerCase()}.png`} 
                    alt={champion.name} 
                    className="champion-large-flag card-glowing-border"
                  />
                  <div className="trophy-badge">🏆</div>
                </div>

                <div className="champion-details-showcase">
                  <div className="champion-accent-tag" style={{ backgroundColor: championColors?.primary }}>
                    2026 WORLD CHAMPION
                  </div>
                  <h4>{champion.name}</h4>
                  
                  <div className="champion-metadata-list">
                    <div className="meta-row">
                      <span className="meta-lbl">FIFA World Rank:</span>
                      <span className="meta-val">#{champion.rank}</span>
                    </div>
                    {champion.starPlayer && (
                      <div className="meta-row">
                        <span className="meta-lbl">Star Player:</span>
                        <span className="meta-val highlight">{champion.starPlayer}</span>
                      </div>
                    )}
                    {champion.keyStat && (
                      <div className="meta-row">
                        <span className="meta-lbl">Key Strength:</span>
                        <span className="meta-val">{champion.keyStat}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="featured-champion-card empty-state">
              <div className="empty-trophy-circle">
                <Trophy size={36} className="trophy-dimmed" />
              </div>
              <h4>No Champion Selected Yet</h4>
              <p>Predict all the knockout matches in the Knockouts tab to crown your 2026 World Cup champion and display them here!</p>
              <button className="navigate-stage-btn" onClick={() => navigate('/predict/knockouts')}>
                Go to Knockouts Bracket <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* 🔐 Cloud Sync Callout Card */}
        <div className="guest-sync-card card-glowing-border">
          <div className="guest-sync-glow"></div>
          <div className="guest-sync-header">
            <Sparkles size={22} className="sync-icon-sparkle" />
            <h3>🔐 Sync Your Bracket to the Cloud!</h3>
          </div>
          <p className="guest-sync-intro">
            Your bracket predictions are currently saved <strong>only on this browser/device</strong>. Register a free account now to enjoy premium cloud features:
          </p>
          <ul className="guest-sync-benefits">
            <li>🛡️ <strong>Permanent Backup:</strong> Never lose your bracket if you clear browser cookies or switch devices.</li>
            <li>🌍 <strong>Interactive Sharing:</strong> Generate a unique, clickable predictions URL to share and challenge friends!</li>
            <li>🏆 <strong>Global Leaderboard:</strong> Compete in real-time rankings and watch your bracket score live as the games happen.</li>
          </ul>

          <button className="guest-sync-submit-btn" onClick={() => navigate('/predict/auth')}>
            Sign Up / Log In Now <ArrowRight size={16} />
          </button>
        </div>

        {/* Reset Actions */}
        <div className="profile-footer-actions">
          <button 
            className="profile-logout-btn reset-guest" 
            onClick={() => {
              if (confirm('Are you sure you want to reset all of your local predictions and clear Guest session?')) {
                resetAll();
              }
            }}
          >
            <RotateCcw size={14} /> Reset Local Predictions
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;
