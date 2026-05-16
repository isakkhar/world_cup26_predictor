import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Info, ArrowRight, RotateCcw, Trophy, Check, Star, Home, Download, Moon, Sun, Search } from 'lucide-react';
import { toPng } from 'html-to-image';
import { tournamentData } from '../data/tournament';
import type { Team } from '../data/tournament';
import { knockoutStructure } from '../data/bracket';
import Modal from '../components/ui/Modal';
import './Predictor.css';

const Predictor: React.FC = () => {
  const bracketRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('wc2026_theme') as 'dark' | 'light') || 'dark';
  });
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'groups' | 'third-place' | 'knockouts'>('groups');
  const [isDownloading, setIsDownloading] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('wc2026_theme', newTheme);
    document.body.className = `theme-${newTheme}`;
  };

  const handleDownload = async () => {
    if (bracketRef.current === null) return;
    setIsDownloading(true);
    setTimeout(async () => {
      try {
        const dataUrl = await toPng(bracketRef.current as HTMLElement, { 
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

  const showTeamStats = (team: Team) => {
    setSelectedTeam(team);
    setIsStatsModalOpen(true);
  };

  const [predictions, setPredictions] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('wc2026_predictions');
    return saved ? JSON.parse(saved) : {};
  });

  const [thirdPlaceSelected, setThirdPlaceSelected] = useState<string[]>(() => {
    const saved = localStorage.getItem('wc2026_third_place');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [knockoutPredictions, setKnockoutPredictions] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('wc2026_knockouts');
    return saved ? JSON.parse(saved) : {};
  });


  useEffect(() => {
    localStorage.setItem('wc2026_predictions', JSON.stringify(predictions));
  }, [predictions]);

  useEffect(() => {
    localStorage.setItem('wc2026_third_place', JSON.stringify(thirdPlaceSelected));
  }, [thirdPlaceSelected]);

  useEffect(() => {
    localStorage.setItem('wc2026_knockouts', JSON.stringify(knockoutPredictions));
  }, [knockoutPredictions]);

  const handleRankTeam = (groupId: string, teamId: string) => {
    setPredictions(prev => {
      const currentRanks = prev[groupId] || [];
      if (currentRanks.includes(teamId)) {
        const index = currentRanks.indexOf(teamId);
        return { ...prev, [groupId]: currentRanks.slice(0, index) };
      }
      if (currentRanks.length >= 4) return prev;
      const newRanks = [...currentRanks, teamId];
      const group = tournamentData.find(g => g.id === groupId);
      if (group && newRanks.length === 3) {
        const remainingTeam = group.teams.find(t => !newRanks.includes(t.id));
        if (remainingTeam) newRanks.push(remainingTeam.id);
      }
      return { ...prev, [groupId]: newRanks };
    });
  };

  const toggleThirdPlaceTeam = (teamId: string) => {
    setThirdPlaceSelected(prev => {
      if (prev.includes(teamId)) return prev.filter(id => id !== teamId);
      if (prev.length < 8) return [...prev, teamId];
      return prev;
    });
    setKnockoutPredictions({});
  };

  const handleKnockoutWinner = (matchId: string, teamId: string) => {
    setKnockoutPredictions(prev => {
      const currentWinner = prev[matchId];
      const newPredictions = { ...prev };
      if (currentWinner === teamId) delete newPredictions[matchId];
      else newPredictions[matchId] = teamId;
      return clearDependentMatches(matchId, newPredictions);
    });
  };

  const clearDependentMatches = (matchId: string, predictions: Record<string, string>): Record<string, string> => {
    const currentMatch = knockoutStructure.find(m => m.id === matchId);
    if (!currentMatch?.nextMatchId) return predictions;
    const nextMatchId = currentMatch.nextMatchId;
    if (predictions[nextMatchId]) {
      delete predictions[nextMatchId];
      return clearDependentMatches(nextMatchId, predictions);
    }
    return predictions;
  };

  const [knockoutRound, setKnockoutRound] = useState<'R32' | 'R16' | 'QF' | 'SF' | 'F' | '3RD'>('R32');

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

  const getTeamBySlot = (slot: string): Team | null => {
    if (/^[A-L][1-3]$/.test(slot)) {
      const groupId = slot[0];
      const rank = parseInt(slot[1]) - 1;
      const teamId = (predictions[groupId] || [])[rank];
      if (!teamId) return null;
      for (const group of tournamentData) {
        const team = group.teams.find(t => t.id === teamId);
        if (team) return team;
      }
    }
    if (/^L\d+$/.test(slot)) {
      const matchId = slot.substring(1);
      const match = knockoutStructure.find(m => m.id === matchId);
      if (!match) return null;
      const winnerId = knockoutPredictions[matchId];
      if (!winnerId) return null;
      const t1 = getTeamBySlot(match.team1Slot);
      const t2 = getTeamBySlot(match.team2Slot);
      if (!t1 || !t2) return null;
      return winnerId === t1.id ? t2 : t1;
    }
    if (/^T[1-8]$/.test(slot)) {
      const index = parseInt(slot.substring(1)) - 1;
      const teamId = thirdPlaceSelected[index];
      if (!teamId) return null;
      for (const group of tournamentData) {
        const team = group.teams.find(t => t.id === teamId);
        if (team) return team;
      }
    }
    if (/^W\d+$/.test(slot)) {
      const matchId = slot.substring(1);
      const winnerId = knockoutPredictions[matchId];
      if (!winnerId) return null;
      for (const group of tournamentData) {
        const team = group.teams.find(t => t.id === winnerId);
        if (team) return team;
      }
    }
    return null;
  };

  const getQualifiedTeamsList = () => {
    return thirdPlaceSelected.map(id => {
      for (const group of tournamentData) {
        const team = group.teams.find(t => t.id === id);
        if (team) return team;
      }
      return null;
    }).filter(Boolean);
  };

  const renderHeader = () => (
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
  );

  return (
    <div className={`predictor-page-wrapper theme-${theme}`}>
      <div className="predictor-container">
        {renderHeader()}

        <div className="predictor-top-bar">
          <div className="nav-tabs">
            <button className={`tab-button ${activeTab === 'groups' ? 'active' : ''}`} onClick={() => setActiveTab('groups')}>Group Stage</button>
            <button className={`tab-button ${activeTab === 'third-place' ? 'active' : ''}`} onClick={() => setActiveTab('third-place')}>Third Place</button>
            <button className={`tab-button ${activeTab === 'knockouts' ? 'active' : ''}`} onClick={() => setActiveTab('knockouts')}>Knockouts</button>
          </div>
          <button className="start-over-top" onClick={() => { localStorage.clear(); window.location.reload(); }}><RotateCcw size={16} /> START OVER</button>
        </div>

        {activeTab === 'groups' && (
          <>
            <div className="premium-info-card">
              <Info size={20} className="info-icon-blue" />
              <div className="info-text-content">
                <span className="info-title">Tournament Analysis</span>
                <p className="info-desc">Tap flags to view team stats. Rank teams 1st to 3rd in each group.</p>
              </div>
            </div>
            <div className="groups-grid">
              {tournamentData.map(group => (
                <div key={group.id} className="group-card">
                  <div className="group-header"><h2>{group.name}</h2></div>
                  {group.teams.map(team => {
                    const rank = (predictions[group.id] || []).indexOf(team.id) + 1;
                    return (
                      <div key={team.id} className={`team-row ${rank ? 'ranked' : ''}`} onClick={() => handleRankTeam(group.id, team.id)}>
                        <div className="team-flag-wrapper" onClick={(e) => { e.stopPropagation(); showTeamStats(team); }}>
                          <img src={`https://flagcdn.com/w80/${team.flag.toLowerCase()}.png`} alt="" className="team-flag" />
                          <div className="flag-overlay"><Search size={14} /></div>
                        </div>
                        <span className="team-name">{team.name}</span>
                        {rank > 0 ? <div className="rank-badge">{rank}</div> : <div className="rank-circle"></div>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <footer className="predictor-footer">
              <button className="continue-button" onClick={() => setActiveTab('third-place')}>CONTINUE TO THIRD PLACE <ArrowRight size={20} /></button>
            </footer>
          </>
        )}

        {activeTab === 'third-place' && (
          <div className="third-place-view">
            <div className="premium-info-card gold">
              <Star size={20} className="info-icon-gold" />
              <div className="info-text-content">
                <span className="info-title">BEST THIRD-PLACE TEAMS</span>
                <p className="info-desc">Select exactly 8 teams to advance to the knockout bracket.</p>
              </div>
              <div className="qualification-tracker">
                <span className="qualified-count">{thirdPlaceSelected.length} / 8</span>
                <div className="mini-progress-dots">
                  {[...Array(8)].map((_, i) => <div key={i} className={`dot ${i < thirdPlaceSelected.length ? 'active' : ''}`} />)}
                </div>
              </div>
            </div>

            <div className="qualified-teams-strip">
              <div className="strip-label">QUALIFIED TEAMS {thirdPlaceSelected.length}/8</div>
              <div className="strip-flags">
                {getQualifiedTeamsList().map(team => (
                  <img key={team!.id} src={`https://flagcdn.com/w80/${team!.flag.toLowerCase()}.png`} alt="" className="mini-flag" />
                ))}
              </div>
            </div>

            <div className="tp-list-grid">
              {tournamentData.map(group => {
                const team = group.teams.find(t => t.id === (predictions[group.id] || [])[2]);
                if (!team) return null;
                const isSelected = thirdPlaceSelected.includes(team.id);
                return (
                  <div key={team.id} className={`tp-strip-card ${isSelected ? 'selected' : ''}`} onClick={() => toggleThirdPlaceTeam(team.id)}>
                    <div className="tp-flag-box" onClick={(e) => { e.stopPropagation(); showTeamStats(team); }}>
                      <img src={`https://flagcdn.com/w80/${team.flag.toLowerCase()}.png`} alt="" />
                      <div className="tp-flag-hover"><Search size={14} /></div>
                    </div>
                    <div className="tp-info-box">
                      <div className="tp-team-name">{team.name}</div>
                      <div className="tp-meta">{group.name} • FIFA #{team.rank}</div>
                    </div>
                    {isSelected ? <div className="rank-badge"><Check size={14} /></div> : <div className="rank-circle"></div>}
                  </div>
                );
              }).filter(Boolean)}
            </div>
            <footer className="predictor-footer">
              <button className="continue-button" disabled={thirdPlaceSelected.length !== 8} onClick={() => setActiveTab('knockouts')}>CONFIRM & ADVANCE <ArrowRight size={20} /></button>
            </footer>
          </div>
        )}

        {activeTab === 'knockouts' && (
          <div className="knockout-view" ref={bracketRef}>
            <div className="premium-info-card knockout">
              <Trophy size={20} className="info-icon-blue" />
              <div className="info-text-content">
                <span className="info-title">KNOCKOUT STAGE</span>
                <p className="info-desc">Select match winners to advance. Complete all rounds to crown the champion.</p>
              </div>
              <div className="qualification-tracker">
                <span className="qualified-count">Progress: {Object.keys(knockoutPredictions).length} / 32</span>
                <div className="mini-progress-bar"><div className="fill" style={{ width: `${(Object.keys(knockoutPredictions).length / 32) * 100}%` }} /></div>
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
                    <div className="ko-match-meta">MATCH {match.id} • {match.side.toUpperCase()}</div>
                    <div className="ko-teams-container">
                      {[team1, team2].map((team, i) => (
                        <div key={i} className={`ko-team-box ${team?.id === winnerId ? 'winner' : ''} ${!team ? 'tbd' : ''}`} onClick={() => team && handleKnockoutWinner(match.id, team.id)}>
                          <div className="team-info-main">
                            {team && <img src={`https://flagcdn.com/w80/${team.flag.toLowerCase()}.png`} alt="" className="ko-flag-icon" />}
                            <span className="team-name">{team?.name || 'TBD'}</span>
                          </div>
                          {team?.id === winnerId && <Check size={14} />}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {knockoutPredictions['104'] && (
              <div className="celebration-view">
                <Trophy size={80} color="#FFD700" />
                <div className="celebration-champion-name">{getTeamBySlot('W104')?.name}</div>
                <div className="celebration-subtitle">2026 WORLD CUP CHAMPION</div>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={isStatsModalOpen} onClose={() => setIsStatsModalOpen(false)} title="Team Analysis" hideCancel={true} confirmText="Close" onConfirm={() => setIsStatsModalOpen(false)}>
        {selectedTeam && (
          <div className="team-stats-modal-refined">
            <div className="modal-team-header-center">
              <img src={`https://flagcdn.com/w160/${selectedTeam.flag.toLowerCase()}.png`} alt="" className="modal-flag-large" />
              <h3>{selectedTeam.name}</h3>
              <p className="modal-rank-text">FIFA World Rank: #{selectedTeam.rank}</p>
            </div>
            <div className="stats-list-refined">
              <div className="stat-row"><span className="label">Star Player</span><span className="value">{selectedTeam.starPlayer}</span></div>
              <div className="stat-row"><span className="label">Last WC</span><span className="value">{selectedTeam.lastWC}</span></div>
              <div className="stat-row"><span className="label">Key Analysis</span><span className="value">{selectedTeam.keyStat}</span></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Predictor;
