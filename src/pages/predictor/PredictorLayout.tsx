import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Trophy, Sun, Moon, Download, RotateCcw, User as UserIcon, LogOut } from 'lucide-react';
import { toPng } from 'html-to-image';
import { usePredictor } from '../../context/PredictorContext';
import Modal from '../../components/ui/Modal';
import './Predictor.css';

const PredictorLayout: React.FC = () => {
  const { 
    theme, toggleTheme, resetAll, simulateTournament,
    isSharedMode, sharedUsername, sharedScore, exitSharedMode,
    user, authLoading, signOut
  } = usePredictor();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);

  const activeTab = location.pathname.split('/').pop() || 'groups';

  const handleDownload = async () => {
    const knockoutView = document.querySelector('.knockout-view');
    if (!knockoutView) return;
    
    setIsDownloading(true);
    setTimeout(async () => {
      try {
        const dataUrl = await toPng(knockoutView as HTMLElement, { 
          cacheBust: true, 
          pixelRatio: 2,
          backgroundColor: theme === 'dark' ? '#020617' : '#ffffff',
        });
        const link = document.createElement('a');
        link.download = `world-cup-2026-bracket.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Download failed', err);
      } finally {
        setIsDownloading(false);
      }
    }, 500);
  };

  const handleRestrictedTabClick = (path: string) => {
    if (!user) {
      setIsGateModalOpen(true);
    } else {
      navigate(path);
    }
  };

  return (
    <div className={`predictor-page-wrapper theme-${theme}`}>
      {isSharedMode && (
        <div className="shared-banner">
          <div className="shared-banner-content">
            <span className="shared-banner-text">
              👀 You are interactively viewing <strong>{sharedUsername}</strong>'s prediction (Score: <strong>{sharedScore} pts</strong>)
            </span>
            <button className="exit-shared-btn" onClick={exitSharedMode}>Exit Shared View</button>
          </div>
        </div>
      )}

      <div className="predictor-container">
        <header className="main-header">
          <div className="header-actions-left">
            <Link to="/" className="back-home-link"><Home size={18} /> <span>Home</span></Link>
          </div>
          <div className="title-wrapper">
            <Trophy size={32} />
            <h1>2026 World Cup Predictor</h1>
          </div>
          <p>Make your picks and crown the world champion!</p>
          <div className="header-actions-right">
            <button className="theme-toggle" onClick={toggleTheme}>{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
            
            {!authLoading && (
              user ? (
                <>
                  <button 
                    className={`auth-header-btn profile ${activeTab === 'profile' ? 'active' : ''}`} 
                    onClick={() => navigate('/predict/profile')}
                    title="View Dashboard"
                  >
                    <UserIcon size={14} />
                    <span>{user.user_metadata?.username || user.email?.split('@')[0]}</span>
                  </button>
                  <button 
                    className="auth-header-btn logout" 
                    onClick={() => {
                      if (confirm('Are you sure you want to log out and clear active session?')) {
                        signOut().then(() => navigate('/predict/groups'));
                      }
                    }}
                    title="Log Out"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button 
                  className="auth-header-btn login" 
                  onClick={() => navigate('/predict/auth')}
                >
                  <UserIcon size={14} />
                  <span>Sign In</span>
                </button>
              )
            )}

            <button className="download-btn" onClick={handleDownload} disabled={isDownloading || activeTab !== 'knockouts'}>
              {isDownloading ? <RotateCcw className="spinning" size={20} /> : <Download size={20} />}
            </button>
          </div>
        </header>

        <div className="predictor-top-bar">
          <div className="nav-tabs">
            <button className={`tab-button ${activeTab === 'groups' ? 'active' : ''}`} onClick={() => navigate('/predict/groups')}>Group Stage</button>
            <button className={`tab-button ${activeTab === 'third-place' ? 'active' : ''}`} onClick={() => handleRestrictedTabClick('/predict/third-place')}>Third Place {!user && '🔒'}</button>
            <button className={`tab-button ${activeTab === 'knockouts' ? 'active' : ''}`} onClick={() => handleRestrictedTabClick('/predict/knockouts')}>Knockouts {!user && '🔒'}</button>
            <button className={`tab-button ${activeTab === 'recap' ? 'active' : ''}`} onClick={() => handleRestrictedTabClick('/predict/recap')}>Recap {!user && '🔒'}</button>
            <button className={`tab-button ${activeTab === 'trends' ? 'active' : ''}`} onClick={() => handleRestrictedTabClick('/predict/trends')}>Trends {!user && '🔒'}</button>
            <button className={`tab-button ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => navigate('/predict/leaderboard')}>Leaderboard</button>
            {user && <button className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => navigate('/predict/profile')}>Profile</button>}
          </div>
          
          {!isSharedMode && (
            <div className="top-bar-actions">
              <button 
                className="auto-simulate-btn" 
                onClick={() => {
                  if (!user) setIsGateModalOpen(true);
                  else setIsSimModalOpen(true);
                }}
              >
                ⚡ AUTO SIMULATE
              </button>
              <button className="start-over-top" onClick={() => { if(confirm('Are you sure you want to reset all predictions?')) resetAll(); }}><RotateCcw size={16} /> START OVER</button>
            </div>
          )}
        </div>

        <Outlet />
      </div>

      {/* Auto-Simulate Modal */}
      <Modal 
        isOpen={isSimModalOpen} 
        onClose={() => setIsSimModalOpen(false)} 
        title="⚡ Auto-Simulate Tournament" 
        hideCancel={true} 
        confirmText="Cancel"
        onConfirm={() => setIsSimModalOpen(false)}
      >
        <div className="simulation-modal-content">
          <p className="sim-intro">
            Choose your tournament simulation style. Running a simulation will overwrite your current predictions.
          </p>
          <div className="sim-options-grid">
            <div className="sim-option-card" onClick={() => { simulateTournament('safe'); setIsSimModalOpen(false); }}>
              <div className="sim-option-icon">🛡️</div>
              <h3>Safe Mode</h3>
              <p>Strictly follows FIFA World Rankings. Strongest teams qualify and win matches.</p>
            </div>
            <div className="sim-option-card chaos" onClick={() => { simulateTournament('chaos'); setIsSimModalOpen(false); }}>
              <div className="sim-option-icon">⚡</div>
              <h3>Chaos Mode</h3>
              <p>Calculates relative win probabilities. Includes dramatic upsets and unexpected champions!</p>
            </div>
          </div>
        </div>
      </Modal>

      {/* 🔐 Registration Gate Lock Modal */}
      <Modal 
        isOpen={isGateModalOpen} 
        onClose={() => setIsGateModalOpen(false)} 
        title="🔐 Unlock 2026 World Cup Simulator" 
        hideCancel={true} 
        confirmText="Keep Editing Group Stage"
        onConfirm={() => setIsGateModalOpen(false)}
      >
        <div className="gate-modal-content">
          <div className="gate-lock-icon">🔒</div>
          <h3>Create a Free Account to Advance!</h3>
          <p className="gate-intro">
            You are doing great! Sign up or log in in seconds to unlock full simulator features, compete in rankings, and save your live bracket:
          </p>
          <ul className="gate-benefits-list">
            <li>⚡ <strong>Auto-Simulate:</strong> Skip picking and simulate the entire tournament instantly.</li>
            <li>🥉 <strong>Third-Placed Rankings:</strong> Pick the best 8 of 12 group stage third-place teams.</li>
            <li>🌳 <strong>Knockout Bracket:</strong> Predict matches from the Round of 32 all the way to the World Cup Final!</li>
            <li>🌍 <strong>Leaderboard & Sharing:</strong> Sync picks, earn ranking points, and share your interactive picks URL!</li>
          </ul>
          
          <div className="gate-modal-buttons">
            <button 
              className="gate-submit-btn" 
              onClick={() => {
                setIsGateModalOpen(false);
                navigate('/predict/auth');
              }}
            >
              Sign In / Register Now
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PredictorLayout;
