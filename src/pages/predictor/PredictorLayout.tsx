import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Trophy, Sun, Moon, Download, RotateCcw } from 'lucide-react';
import { toPng } from 'html-to-image';
import { usePredictor } from '../../context/PredictorContext';
import Modal from '../../components/ui/Modal';
import './Predictor.css';

const PredictorLayout: React.FC = () => {
  const { theme, toggleTheme, resetAll, simulateTournament } = usePredictor();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);

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

  return (
    <div className={`predictor-page-wrapper theme-${theme}`}>
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
            <button className="download-btn" onClick={handleDownload} disabled={isDownloading || activeTab !== 'knockouts'}>
              {isDownloading ? <RotateCcw className="spinning" size={20} /> : <Download size={20} />}
            </button>
          </div>
        </header>

        <div className="predictor-top-bar">
          <div className="nav-tabs">
            <button className={`tab-button ${activeTab === 'groups' ? 'active' : ''}`} onClick={() => navigate('/predict/groups')}>Group Stage</button>
            <button className={`tab-button ${activeTab === 'third-place' ? 'active' : ''}`} onClick={() => navigate('/predict/third-place')}>Third Place</button>
            <button className={`tab-button ${activeTab === 'knockouts' ? 'active' : ''}`} onClick={() => navigate('/predict/knockouts')}>Knockouts</button>
            <button className={`tab-button ${activeTab === 'recap' ? 'active' : ''}`} onClick={() => navigate('/predict/recap')}>Recap</button>
            <button className={`tab-button ${activeTab === 'trends' ? 'active' : ''}`} onClick={() => navigate('/predict/trends')}>Trends</button>
          </div>
          <div className="top-bar-actions">
            <button className="auto-simulate-btn" onClick={() => setIsSimModalOpen(true)}>⚡ AUTO SIMULATE</button>
            <button className="start-over-top" onClick={() => { if(confirm('Are you sure you want to reset all predictions?')) resetAll(); }}><RotateCcw size={16} /> START OVER</button>
          </div>
        </div>

        <Outlet />
      </div>

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
    </div>
  );
};

export default PredictorLayout;
