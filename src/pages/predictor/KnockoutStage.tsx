import React, { useState, useEffect } from 'react';
import { Trophy, Check, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { knockoutStructure } from '../../data/bracket';
import { usePredictor } from '../../context/PredictorContext';
import type { Team } from '../../data/tournament';
import Modal from '../../components/ui/Modal';

const matchDetails: Record<string, { date: string; venue: string; city: string }> = {
  // Round of 32
  '73': { date: 'June 28, 2026', venue: 'SoFi Stadium', city: 'Los Angeles, USA' },
  '74': { date: 'June 28, 2026', venue: 'BMO Field', city: 'Toronto, Canada' },
  '75': { date: 'June 29, 2026', venue: 'Estadio Azteca', city: 'Mexico City, Mexico' },
  '76': { date: 'June 29, 2026', venue: 'Gillette Stadium', city: 'Boston, USA' },
  '77': { date: 'June 29, 2026', venue: 'NRG Stadium', city: 'Houston, USA' },
  '78': { date: 'June 30, 2026', venue: 'MetLife Stadium', city: 'New York / New Jersey, USA' },
  '79': { date: 'June 30, 2026', venue: 'Estadio Akron', city: 'Guadalajara, Mexico' },
  '80': { date: 'June 30, 2026', venue: 'Arrowhead Stadium', city: 'Kansas City, USA' },
  '81': { date: 'July 1, 2026', venue: 'Lincoln Financial Field', city: 'Philadelphia, USA' },
  '82': { date: 'July 1, 2026', venue: 'Lumen Field', city: 'Seattle, USA' },
  '83': { date: 'July 1, 2026', venue: 'Estadio BBVA', city: 'Monterrey, Mexico' },
  '84': { date: 'July 2, 2026', venue: 'Hard Rock Stadium', city: 'Miami, USA' },
  '85': { date: 'July 2, 2026', venue: 'AT&T Stadium', city: 'Dallas, USA' },
  '86': { date: 'July 2, 2026', venue: 'Mercedes-Benz Stadium', city: 'Atlanta, USA' },
  '87': { date: 'July 3, 2026', venue: 'BC Place', city: 'Vancouver, Canada' },
  '88': { date: 'July 3, 2026', venue: 'Levi\'s Stadium', city: 'San Francisco, USA' },

  // Round of 16
  '89': { date: 'July 4, 2026', venue: 'Lincoln Financial Field', city: 'Philadelphia, USA' },
  '90': { date: 'July 4, 2026', venue: 'NRG Stadium', city: 'Houston, USA' },
  '91': { date: 'July 5, 2026', venue: 'MetLife Stadium', city: 'New York / New Jersey, USA' },
  '92': { date: 'July 5, 2026', venue: 'Estadio Azteca', city: 'Mexico City, Mexico' },
  '93': { date: 'July 6, 2026', venue: 'AT&T Stadium', city: 'Dallas, USA' },
  '94': { date: 'July 6, 2026', venue: 'Lumen Field', city: 'Seattle, USA' },
  '95': { date: 'July 7, 2026', venue: 'Mercedes-Benz Stadium', city: 'Atlanta, USA' },
  '96': { date: 'July 7, 2026', venue: 'BC Place', city: 'Vancouver, Canada' },

  // Quarter-Finals
  '97': { date: 'July 9, 2026', venue: 'Gillette Stadium', city: 'Boston, USA' },
  '98': { date: 'July 10, 2026', venue: 'SoFi Stadium', city: 'Los Angeles, USA' },
  '99': { date: 'July 11, 2026', venue: 'Hard Rock Stadium', city: 'Miami, USA' },
  '100': { date: 'July 11, 2026', venue: 'Arrowhead Stadium', city: 'Kansas City, USA' },

  // Semi-Finals
  '101': { date: 'July 14, 2026', venue: 'AT&T Stadium', city: 'Dallas, USA' },
  '102': { date: 'July 15, 2026', venue: 'Mercedes-Benz Stadium', city: 'Atlanta, USA' },

  // 3rd Place & Final
  '103': { date: 'July 18, 2026', venue: 'Hard Rock Stadium', city: 'Miami, USA' },
  '104': { date: 'July 19, 2026', venue: 'MetLife Stadium', city: 'New York / New Jersey, USA' },
};

const getSeededH2H = (team1Code: string, team2Code: string, rank1: number, rank2: number) => {
  const combined = [team1Code, team2Code].sort().join('-');
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = combined.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const played = (hash % 31) + 10; // 10 to 40 matches
  const totalRank = rank1 + rank2;
  const strengthRatio1 = rank2 / totalRank;

  const fluctuation = ((hash % 11) - 5) / 15;
  const winPercent1 = Math.min(0.8, Math.max(0.2, strengthRatio1 + fluctuation));
  
  const wins1 = Math.round(winPercent1 * played);
  const drawPercent = 0.15 + ((hash % 11) / 100);
  let draws = Math.round(drawPercent * played);
  let wins2 = played - wins1 - draws;
  if (wins2 < 0) {
    wins2 = 0;
    draws = played - wins1;
  }

  const generateForm = (teamRank: number, seedOffset: number) => {
    const formOptions = ['W', 'W', 'D', 'L', 'W', 'L', 'D', 'W', 'W', 'L'];
    const results: string[] = [];
    for (let i = 0; i < 5; i++) {
      const idx = (hash + i + seedOffset + Math.round(100 / teamRank)) % formOptions.length;
      results.push(formOptions[idx]);
    }
    return results;
  };

  const form1 = generateForm(rank1, 1);
  const form2 = generateForm(rank2, 2);

  const probT1 = Math.round((rank2 / (rank1 + rank2)) * 100);
  const probT2 = 100 - probT1;

  return { played, wins1, wins2, draws, form1, form2, probT1, probT2 };
};

const playStadiumCheer = () => {
  try {
    const audio = new Audio('/stadium_cheer.mp3');
    audio.volume = 0.6;
    audio.play().catch(e => console.log('Audio autoplay blocked by browser', e));
  } catch (err) {
    console.error('Failed to play local stadium cheer', err);
  }
};

const KnockoutStage: React.FC = () => {
  const navigate = useNavigate();
  const { knockoutPredictions, handleKnockoutWinner, getTeamBySlot, user } = usePredictor();
  const [knockoutRound, setKnockoutRound] = useState<'R32' | 'R16' | 'QF' | 'SF' | 'F' | '3RD'>('R32');
  const [comparisonTeams, setComparisonTeams] = useState<{ t1: Team; t2: Team } | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/predict/groups');
    }
  }, [user, navigate]);

  const handleOpenComparison = (t1: Team, t2: Team) => {
    setComparisonTeams({ t1, t2 });
    setIsComparisonOpen(true);
  };

  const championId = knockoutPredictions['104'];

  useEffect(() => {
    if (championId) {
      playStadiumCheer();
      
      const duration = 4 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => {
        clearInterval(interval);
      };
    }
  }, [championId]);

  const knockoutRounds = [
    { key: 'R32' as const, label: 'Round of 32', matchCount: 16 },
    { key: 'R16' as const, label: 'Round of 16', matchCount: 8 },
    { key: 'QF' as const, label: 'Quarter-Finals', matchCount: 4 },
    { key: 'SF' as const, label: 'Semi-Finals', matchCount: 2 },
    { key: '3RD' as const, label: '3rd Place', matchCount: 1 },
    { key: 'F' as const, label: 'Final', matchCount: 1 },
  ];

  const getCompletedMatchesForRound = (roundKey: string) => {
    return knockoutStructure.filter(m => m.round === roundKey && knockoutPredictions[m.id]).length;
  };

  return (
    <div className="knockout-view">
      <div className="premium-info-card rank-guide-card">
        <div className="guide-icon-3d">
          <Trophy size={24} color="#ffffff" strokeWidth={2.5} />
        </div>
        <div className="info-text-content">
          <span className="info-title-blue">KNOCKOUT STAGE</span>
          <p className="info-desc-blue">
            <strong>Select match winners:</strong> Tap teams to advance them. Complete all rounds to crown the champion.
          </p>
        </div>
        <div className="qualification-tracker">
          <span className="qualified-count" style={{ color: '#0369a1', fontWeight: 800 }}>Progress: {Object.keys(knockoutPredictions).length} / 32</span>
          <div className="mini-progress-bar" style={{ backgroundColor: 'rgba(2,132,199,0.15)' }}><div className="fill" style={{ width: `${(Object.keys(knockoutPredictions).length / 32) * 100}%`, backgroundColor: '#0284c7' }} /></div>
        </div>
      </div>

      <div className="round-selection-bar">
        {knockoutRounds.map(round => {
          const completed = getCompletedMatchesForRound(round.key);
          const isActive = knockoutRound === round.key;
          return (
            <button key={round.key} className={`round-tab-new ${isActive ? 'active' : ''}`} onClick={() => setKnockoutRound(round.key)}>
              <div className="round-name">{round.label.toUpperCase()}</div>
              <div className="round-count">{completed}/{round.matchCount}</div>
            </button>
          );
        })}
      </div>

      <div className="knockout-matches-grid">
        {knockoutStructure.filter(m => m.round === knockoutRound).map(match => {
          const team1 = getTeamBySlot(match.team1Slot);
          const team2 = getTeamBySlot(match.team2Slot);
          const winnerId = knockoutPredictions[match.id];
          return (
            <div key={match.id} className="ko-match-card">
              <div className="ko-match-meta">
                <span>MATCH {match.id} • {match.side.toUpperCase()}</span>
                {team1 && team2 && (
                  <button className="match-compare-trigger" onClick={() => handleOpenComparison(team1, team2)}>
                    <BarChart2 size={12} /> Compare
                  </button>
                )}
              </div>
              <div className="ko-teams-container">
                {[team1, team2].map((team, i) => (
                  <div key={i} className={`ko-team-box ${team?.id === winnerId ? 'winner' : ''} ${!team ? 'tbd' : ''}`} onClick={() => team && handleKnockoutWinner(match.id, team.id)}>
                    <div className="team-info-main">
                      {team && <img src={`https://flagcdn.com/w80/${team.flag.toLowerCase()}.png`} alt="" className="ko-flag-icon" />}
                      {team ? (
                        <div className="team-name-group">
                          <span className="team-name">{team.name}</span>
                          <span className="team-fifa-rank">FIFA #{team.rank}</span>
                        </div>
                      ) : (
                        <span className="team-name">TBD</span>
                      )}
                    </div>
                    {team?.id === winnerId && <Check size={14} />}
                  </div>
                ))}
              </div>
              {matchDetails[match.id] && (
                <div className="ko-match-details">
                  <span className="detail-venue">{matchDetails[match.id].venue}</span>
                  <span className="detail-city">{matchDetails[match.id].city}</span>
                  <span className="detail-date">{matchDetails[match.id].date}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {knockoutPredictions['104'] && (
        <div 
          className="celebration-view cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 flex flex-col items-center justify-center p-6 border border-amber-500/20 bg-amber-500/5 rounded-3xl"
          onClick={() => navigate('/predict/recap')}
          style={{ cursor: 'pointer' }}
          title="Click to view prediction recap"
        >
          <Trophy size={80} color="#FFD700" className="animate-pulse" />
          <div className="celebration-champion-name">{getTeamBySlot('W104')?.name}</div>
          <div className="celebration-subtitle">2026 WORLD CUP CHAMPION</div>
          <span className="text-[10px] text-slate-500 font-medium tracking-wider mt-2 opacity-65 hover:opacity-100 transition-opacity">🏆 Click to View Prediction Recap</span>
        </div>
      )}

      <Modal 
        isOpen={isComparisonOpen} 
        onClose={() => setIsComparisonOpen(false)} 
        title="📊 Match Comparison & Analysis" 
        hideCancel={true} 
        confirmText="Close"
        onConfirm={() => setIsComparisonOpen(false)}
      >
        {comparisonTeams && (() => {
          const { t1, t2 } = comparisonTeams;
          const stats = getSeededH2H(t1.code, t2.code, t1.rank, t2.rank);
          return (
            <div className="comparison-modal-refined">
              <div className="comparison-teams-header">
                <div className="comp-team-side left-side">
                  <img src={`https://flagcdn.com/w160/${t1.flag.toLowerCase()}.png`} alt="" className="comp-flag-large" />
                  <h4>{t1.name}</h4>
                  <span className="comp-rank">FIFA Rank: #{t1.rank}</span>
                </div>
                <div className="comp-vs-badge">VS</div>
                <div className="comp-team-side right-side">
                  <img src={`https://flagcdn.com/w160/${t2.flag.toLowerCase()}.png`} alt="" className="comp-flag-large" />
                  <h4>{t2.name}</h4>
                  <span className="comp-rank">FIFA Rank: #{t2.rank}</span>
                </div>
              </div>

              <div className="comp-prob-section">
                <div className="comp-section-title">Win Probability</div>
                <div className="prob-bar-wrapper">
                  <div className="prob-label left">{stats.probT1}%</div>
                  <div className="prob-bar-container">
                    <div className="prob-fill-left" style={{ width: `${stats.probT1}%` }} />
                    <div className="prob-fill-right" style={{ width: `${stats.probT2}%` }} />
                  </div>
                  <div className="prob-label right">{stats.probT2}%</div>
                </div>
              </div>

              <div className="comp-h2h-section">
                <div className="comp-section-title">Head-to-Head History</div>
                <div className="h2h-stats-summary">
                  Matches Played: <strong>{stats.played}</strong>
                </div>
                <div className="h2h-chart-grid">
                  <div className="h2h-stat-box">
                    <span className="count">{stats.wins1}</span>
                    <span className="lbl">{t1.name} Wins</span>
                  </div>
                  <div className="h2h-stat-box draw">
                    <span className="count">{stats.draws}</span>
                    <span className="lbl">Draws</span>
                  </div>
                  <div className="h2h-stat-box">
                    <span className="count">{stats.wins2}</span>
                    <span className="lbl">{t2.name} Wins</span>
                  </div>
                </div>
              </div>

              <div className="comp-form-section">
                <div className="comp-section-title">Recent Form</div>
                <div className="form-comparison-row">
                  <div className="form-badges">
                    {stats.form1.map((f, i) => (
                      <span key={i} className={`form-badge ${f.toLowerCase()}`}>{f}</span>
                    ))}
                  </div>
                  <span className="form-mid-label">vs</span>
                  <div className="form-badges">
                    {stats.form2.map((f, i) => (
                      <span key={i} className={`form-badge ${f.toLowerCase()}`}>{f}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="comp-details-table">
                <div className="comp-section-title">Key Matchups</div>
                <div className="comp-table-row">
                  <div className="comp-cell left">{t1.starPlayer || 'N/A'}</div>
                  <div className="comp-cell mid">Star Player</div>
                  <div className="comp-cell right">{t2.starPlayer || 'N/A'}</div>
                </div>
                <div className="comp-table-row">
                  <div className="comp-cell left">{t1.lastWC || 'N/A'}</div>
                  <div className="comp-cell mid">Last World Cup</div>
                  <div className="comp-cell right">{t2.lastWC || 'N/A'}</div>
                </div>
                <div className="comp-table-row">
                  <div className="comp-cell left text-dim-cell">{t1.keyStat || 'N/A'}</div>
                  <div className="comp-cell mid">Key Analysis</div>
                  <div className="comp-cell right text-dim-cell">{t2.keyStat || 'N/A'}</div>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

export default KnockoutStage;
