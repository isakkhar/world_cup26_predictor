import React, { useState } from 'react';
import { Trophy, Globe, AlertCircle } from 'lucide-react';
import { usePredictor } from '../../context/PredictorContext';
import './Predictor.css';

interface TrendItem {
  id: string;
  name: string;
  code: string;
  flag: string;
  percentage: number;
  votes: number;
  color: string;
}

interface ContinentTrend {
  name: string;
  favorite: string;
  favCode: string;
  flag: string;
  percentage: number;
  confidence: 'High' | 'Very High' | 'Medium';
}

const GlobalTrends: React.FC = () => {
  const { getTeamBySlot } = usePredictor();
  const [globalVotes, setGlobalVotes] = useState(1248530);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<'chart' | 'heatmap'>('chart');

  // Realistic mock initial predictions
  const [trends, setTrends] = useState<TrendItem[]>([
    { id: 'bra', name: 'Brazil', code: 'BR', flag: 'br', percentage: 38, votes: 474441, color: '#22c55e' },
    { id: 'fra', name: 'France', code: 'FR', flag: 'fr', percentage: 24, votes: 299647, color: '#3b82f6' },
    { id: 'arg', name: 'Argentina', code: 'AR', flag: 'ar', percentage: 16, votes: 199765, color: '#00c2ff' },
    { id: 'eng', name: 'England', code: 'GB-ENG', flag: 'gb-eng', percentage: 12, votes: 149823, color: '#ef4444' },
    { id: 'esp', name: 'Spain', code: 'ES', flag: 'es', percentage: 6, votes: 74911, color: '#f59e0b' },
    { id: 'others', name: 'Others', code: 'OTH', flag: 'un', percentage: 4, votes: 49943, color: '#64748b' }
  ]);

  const [continents] = useState<ContinentTrend[]>([
    { name: 'South America', favorite: 'Brazil', favCode: 'BR', flag: 'br', percentage: 55, confidence: 'Very High' },
    { name: 'Europe', favorite: 'France', favCode: 'FR', flag: 'fr', percentage: 32, confidence: 'High' },
    { name: 'North America', favorite: 'Mexico', favCode: 'MX', flag: 'mx', percentage: 28, confidence: 'Medium' },
    { name: 'Africa', favorite: 'Morocco', favCode: 'MA', flag: 'ma', percentage: 25, confidence: 'Medium' },
    { name: 'Asia', favorite: 'Japan', favCode: 'JP', flag: 'jp', percentage: 30, confidence: 'Medium' }
  ]);

  // Calculate SVG Donut segment parameters based on a radius of 40 (circumference = 251.32)
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.32

  const getStrokeDashArray = (percentage: number) => {
    const strokeLength = (percentage / 100) * circumference;
    return `${strokeLength.toFixed(2)} ${(circumference - strokeLength).toFixed(2)}`;
  };

  const getStrokeDashOffset = (index: number) => {
    let accumulatedPercentage = 0;
    for (let i = 0; i < index; i++) {
      accumulatedPercentage += trends[i].percentage;
    }
    return -((accumulatedPercentage / 100) * circumference);
  };

  // Simulate pouring in 100k votes
  const handleSimulateVotes = () => {
    if (isSimulating) return;
    setIsSimulating(true);

    const incrementCount = 100000;
    const duration = 1500; // 1.5 seconds
    const intervalTime = 30; // 30ms ticks
    const steps = duration / intervalTime;
    const votesPerStep = Math.floor(incrementCount / steps);

    let currentStep = 0;

    const interval = setInterval(() => {
      setGlobalVotes(prev => prev + votesPerStep);

      // Randomly wobble percentages slightly to simulate live dynamic shifts
      setTrends(prev => {
        const next = [...prev];
        // Introduce small wobbles that keep total sum 100
        const indexToGain = Math.floor(Math.random() * 4); // Top 4 teams
        const indexToLose = 4; // esp or others
        
        if (Math.random() > 0.7) {
          next[indexToGain].percentage += 1;
          next[indexToLose].percentage -= 1;
        }

        // Increment actual votes for all
        next.forEach(item => {
          const addedVotes = Math.floor(votesPerStep * (item.percentage / 100));
          item.votes += addedVotes;
        });

        return next;
      });

      currentStep++;
      if (currentStep >= steps) {
        clearInterval(interval);
        // Force exact final sums
        setGlobalVotes(prev => prev + (incrementCount - (votesPerStep * steps)));
        setIsSimulating(false);
      }
    }, intervalTime);
  };

  const userChamp = getTeamBySlot('W104');

  // Compare user's champion with global trends
  const getComparisonMessage = () => {
    if (!userChamp) {
      return (
        <div className="compare-tip-box">
          <AlertCircle size={20} className="compare-tip-icon" />
          <p>
            You haven't predicted a champion yet! Go back to the **Knockouts** tab, choose your champion, and return here to compare your choice with the global vote!
          </p>
        </div>
      );
    }

    // Match by name or flag
    const match = trends.find(t => t.name.toLowerCase() === userChamp.name.toLowerCase());
    
    if (match) {
      return (
        <div className="compare-success-box">
          <div className="compare-success-icon">🔥</div>
          <div className="compare-details">
            <h4>You choose <strong>{userChamp.name}</strong> as champion!</h4>
            <p>
              <strong>{match.percentage}%</strong> of global users agree with you. {userChamp.name} is currently the <strong>#{trends.indexOf(match) + 1}</strong> most popular prediction worldwide.
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="compare-success-box niche">
          <div className="compare-success-icon">⭐</div>
          <div className="compare-details">
            <h4>You choose <strong>{userChamp.name}</strong> as champion!</h4>
            <p>
              You've chosen a unique champion! Less than <strong>3%</strong> of global predictors crowned {userChamp.name}, making your bracket stand out with an exciting sleeper pick!
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="trends-view-container">
      {/* Title Header */}
      <div className="trends-header">
        <Globe size={40} className="trends-globe-icon animate-spin-slow" />
        <h2>Global Prediction Heatmap</h2>
        <p className="trends-subtitle">"Who is the World Backing?" — Live analytics of over {globalVotes.toLocaleString()} fans worldwide</p>
      </div>

      {/* Selector Tabs */}
      <div className="trends-tab-bar">
        <button 
          className={`trends-tab-btn ${activeTab === 'chart' ? 'active' : ''}`}
          onClick={() => setActiveTab('chart')}
        >
          📊 Trend Analytics
        </button>
        <button 
          className={`trends-tab-btn ${activeTab === 'heatmap' ? 'active' : ''}`}
          onClick={() => setActiveTab('heatmap')}
        >
          🗺️ Continent Heatmap
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'chart' ? (
        <div className="trends-analytics-layout">
          {/* Left Column: Visual Donut Chart */}
          <div className="donut-chart-card">
            <div className="svg-donut-wrapper">
              <svg viewBox="0 0 100 100" className="svg-donut">
                {/* Background Ring */}
                <circle cx="50" cy="50" r={radius} fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="6.5" />
                
                {/* Dynamic Trend Arcs */}
                {trends.map((item, i) => (
                  <circle
                    key={item.id}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth="6.5"
                    strokeDasharray={getStrokeDashArray(item.percentage)}
                    strokeDashoffset={getStrokeDashOffset(i)}
                    strokeLinecap="round"
                    className="donut-segment"
                  />
                ))}
              </svg>
              <div className="donut-center-text">
                <Trophy size={36} className="center-trophy animate-bounce" />
                <span className="votes-count">{globalVotes.toLocaleString()}</span>
                <span className="votes-label">Votes</span>
              </div>
            </div>
            
            <button 
              className={`simulate-votes-btn ${isSimulating ? 'loading' : ''}`}
              onClick={handleSimulateVotes}
              disabled={isSimulating}
            >
              {isSimulating ? (
                <>⚡ Analyzing Live Votes...</>
              ) : (
                <>⚡ Simulate 100k Votes</>
              )}
            </button>
          </div>

          {/* Right Column: List & Details */}
          <div className="trends-legend-card">
            <h3 className="legend-title">Top Predicted Champions</h3>
            <div className="legend-list">
              {trends.map((item, idx) => (
                <div key={item.id} className="legend-item-row" style={{ '--team-color': item.color } as React.CSSProperties}>
                  <div className="legend-team-info">
                    <span className="rank-indicator">#{idx + 1}</span>
                    {item.flag !== 'un' ? (
                      <img 
                        src={`https://flagcdn.com/w40/${item.flag.toLowerCase()}.png`} 
                        alt="" 
                        className="legend-flag" 
                      />
                    ) : (
                      <span className="legend-flag-fallback">🏳️</span>
                    )}
                    <span className="team-name-label">{item.name}</span>
                  </div>
                  <div className="legend-metrics">
                    <span className="legend-percentage">{item.percentage}%</span>
                    <span className="legend-votes-count">{(item.votes).toLocaleString()} votes</span>
                  </div>
                  <div className="legend-bar-wrapper">
                    <div className="legend-bar-fill" style={{ width: `${item.percentage}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Continent Heatmap View */
        <div className="continent-heatmap-layout">
          <div className="continent-heatmap-grid">
            {continents.map((item) => (
              <div key={item.name} className="continent-card">
                <div className="continent-card-header">
                  <span className="continent-name">{item.name}</span>
                  <span className={`confidence-badge ${item.confidence.toLowerCase().replace(' ', '-')}`}>
                    {item.confidence} Confidence
                  </span>
                </div>
                <div className="continent-card-body">
                  <div className="continent-favorite-row">
                    <div className="fav-flag-wrapper">
                      <img 
                        src={`https://flagcdn.com/w80/${item.flag}.png`} 
                        alt="" 
                        className="fav-flag" 
                      />
                      <div className="fav-badge">#1</div>
                    </div>
                    <div className="fav-details">
                      <span className="fav-title">REGIONAL FAVORITE</span>
                      <span className="fav-name">{item.favorite}</span>
                    </div>
                  </div>
                  <div className="continent-progress-section">
                    <div className="progress-labels">
                      <span>Regional Vote</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <div className="continent-progress-bar">
                      <div 
                        className="continent-progress-fill" 
                        style={{ width: `${item.percentage}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Drawer */}
      <div className="trends-comparison-section">
        <h3 className="comparison-title">How Do Your Picks Compare?</h3>
        {getComparisonMessage()}
      </div>
    </div>
  );
};

export default GlobalTrends;
