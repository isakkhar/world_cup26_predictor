import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Info, ArrowRight, RotateCcw, Trophy, Check, Star, Home } from 'lucide-react';
import { tournamentData } from '../data/tournament';
import type { Team } from '../data/tournament';
import { knockoutStructure } from '../data/bracket';
import type { BracketMatch } from '../data/bracket';
import Modal from '../components/ui/Modal';
import './Predictor.css';


const Predictor: React.FC = () => {
  const renderHeader = () => (
    <header className="main-header">
      <div className="header-actions-left">
        <Link to="/" className="back-home-link">
          <Home size={18} /> <span>Home</span>
        </Link>
      </div>
      <div className="header-content">
        <div className="title-wrapper">
          <div className="trophy-icon"><ArrowRight size={32} style={{ transform: 'rotate(-45deg)' }} /></div>
          <h1>2026 WC Bracket Predictor</h1>
        </div>
        <p>Make your picks and share your predictions!</p>
      </div>
    </header>
  );

  const [predictions, setPredictions] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('wc2026_predictions');
    return saved ? JSON.parse(saved) : {};
  });

  const [activeTab, setActiveTab] = useState<'groups' | 'third-place' | 'knockouts'>('groups');
  const [thirdPlaceSelected, setThirdPlaceSelected] = useState<string[]>(() => {
    const saved = localStorage.getItem('wc2026_third_place');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [knockoutPredictions, setKnockoutPredictions] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('wc2026_knockouts');
    return saved ? JSON.parse(saved) : {};
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: '' });

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
      
      // If team is already ranked, remove it and everything after it (re-ranking)
      if (currentRanks.includes(teamId)) {
        const index = currentRanks.indexOf(teamId);
        return {
          ...prev,
          [groupId]: currentRanks.slice(0, index)
        };
      }

      // If group is full, don't add more
      if (currentRanks.length >= 4) return prev;

      const newRanks = [...currentRanks, teamId];
      
      // Auto-fill the 4th team if 3 are picked
      const group = tournamentData.find(g => g.id === groupId);
      if (group && newRanks.length === 3) {
        const remainingTeam = group.teams.find(t => !newRanks.includes(t.id));
        if (remainingTeam) {
          newRanks.push(remainingTeam.id);
        }
      }

      return {
        ...prev,
        [groupId]: newRanks
      };
    });
  };


  const handleStartOver = () => {
    setModalConfig({
      title: 'Start Over?',
      message: 'This will clear all your current predictions. Do you want to proceed?',
      type: 'confirm'
    });
    setIsModalOpen(true);
  };

  const confirmAction = () => {
    if (modalConfig.type === 'confirm') {
      setPredictions({});
      setThirdPlaceSelected([]);
      setKnockoutPredictions({});
      setActiveTab('groups');
    }
    setIsModalOpen(false);
  };

  const toggleThirdPlaceTeam = (teamId: string) => {
    setThirdPlaceSelected(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId);
      }
      if (prev.length < 8) {
        return [...prev, teamId];
      }
      return prev;
    });
    // Reset knockouts if third place changes
    setKnockoutPredictions({});
  };

  const handleShare = async () => {
    const winner = getTeamBySlot('W104')?.name;
    const shareData = {
      title: '2026 World Cup Bracket Predictor',
      text: `Check out my 2026 World Cup Predictor! My champion is ${winner}! 🏆⚽`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} \n${shareData.url}`);
        setModalConfig({
          title: 'Link Copied!',
          message: 'Your prediction has been copied to clipboard. Share it with your friends!',
          type: 'alert'
        });
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleContinue = () => {
    const totalGroups = tournamentData.length;
    const completedGroups = Object.values(predictions).filter(ranks => ranks.length === 4).length;

    if (completedGroups < totalGroups) {
      setModalConfig({
        title: 'Groups Incomplete',
        message: `Please rank all teams in every group before continuing. Currently, ${completedGroups} of ${totalGroups} groups are complete.`,
        type: 'alert'
      });
      setIsModalOpen(true);
      return;
    }

    setActiveTab('third-place');
  };

  const renderGroupStage = () => (
    <>
        <div className="premium-info-card">
          <Info size={20} className="info-icon-blue" />
          <div className="info-text-content">
            <span className="info-title">How to Rank Teams</span>
            <p className="info-desc">Tap teams in order: 1st → 2nd → 3rd. The 4th team fills automatically.</p>
          </div>
        </div>

      <div className="groups-grid">
        {tournamentData.map((group) => {
          const groupRanks = predictions[group.id] || [];
          
          return (
            <div key={group.id} className="group-card">
              <div className="group-header">
                <h2>{group.name}</h2>
                <span className="tap-to-rank">TAP TO RANK</span>
              </div>
              <div className="teams-list">
                {group.teams.map((team) => {
                  const rank = groupRanks.indexOf(team.id) + 1;
                  
                  return (
                    <div 
                      key={team.id} 
                      className={`team-row ${rank ? `ranked rank-${rank}` : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRankTeam(group.id, team.id);
                      }}
                      style={{ pointerEvents: 'auto' }}
                    >
                      <div className="team-flag-wrapper">
                        <img 
                          src={`https://flagcdn.com/w80/${team.flag.toLowerCase()}.png`} 
                          alt={team.name} 
                          className="team-flag"
                        />
                      </div>
                      <div className="team-info-main">
                        <span className="team-name">{team.name}</span>
                        <span className="team-rank-small">FIFA #{team.rank}</span>
                      </div>
                      {rank > 0 ? (
                        <div className="rank-badge">{rank}</div>
                      ) : (
                        <div className="rank-circle"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  const renderThirdPlace = () => {
    const thirdPlaceTeams = tournamentData.map(group => {
      const ranks = predictions[group.id] || [];
      const thirdPlaceId = ranks[2]; // 3rd position index is 2
      const team = group.teams.find(t => t.id === thirdPlaceId);
      return team ? { ...team, groupName: group.name } : null;
    }).filter(Boolean);


    return (
      <div className="third-place-view">
        <div className="tp-header-section">
          <div className="premium-info-card">
          <Star size={20} className="info-icon-gold" />
          <div className="info-text-content">
            <span className="info-title">Best Third-Place Teams</span>
            <p className="info-desc">Select exactly 8 teams to advance to the knockout bracket.</p>
          </div>
          <div className="qualification-tracker-compact">
            <span className="qualified-count">{thirdPlaceSelected.length} / 8</span>
            <div className="tracker-mini-dots">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`mini-dot ${i < thirdPlaceSelected.length ? 'active' : ''}`} />
              ))}
            </div>
          </div>
        </div>
          
          <div className="qualification-tracker">
            <div className="tracker-label">
              <span>QUALIFIED TEAMS</span>
              <span className="count">{thirdPlaceSelected.length}/8</span>
            </div>
            <div className="tracker-slots">
              {[...Array(8)].map((_, i) => {
                const teamId = thirdPlaceSelected[i];
                const team = teamId ? tournamentData.flatMap(g => g.teams).find(t => t.id === teamId) : null;
                return (
                  <div key={i} className={`tracker-slot ${team ? 'active' : ''}`}>
                    {team ? (
                      <img src={`https://flagcdn.com/w80/${team.flag.toLowerCase()}.png`} alt="" />
                    ) : (
                      <div className="dot" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="tp-list-grid">
          {thirdPlaceTeams.map((team) => {
            const isSelected = thirdPlaceSelected.includes(team!.id);
            return (
              <div 
                key={team!.id} 
                className={`tp-strip-card ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleThirdPlaceTeam(team!.id)}
              >
                <div className="tp-flag-box">
                  <img src={`https://flagcdn.com/w80/${team!.flag.toLowerCase()}.png`} alt="" />
                </div>
                
                <div className="tp-info-box">
                  <div className="tp-team-name">{team!.name}</div>
                  <div className="tp-meta">
                    <span className="tp-group-tag">{team!.groupName}</span>
                    <span className="tp-rank-tag">FIFA #{team!.rank}</span>
                  </div>
                </div>

                <div className="tp-action-box">
                  {isSelected ? (
                    <div className="tp-check-icon"><ArrowRight size={20} style={{ color: 'white' }} /></div>
                  ) : (
                    <div className="tp-add-icon"><ArrowRight size={20} style={{ transform: 'rotate(45deg)', opacity: 0.5 }} /></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <footer className="predictor-footer">
          <button 
            className="continue-button" 
            disabled={thirdPlaceSelected.length !== 8}
            onClick={() => setActiveTab('knockouts')}
          >
            Confirm & Advance <ArrowRight size={20} />
          </button>
        </footer>
      </div>
    );
  };

  const getTeamBySlot = (slot: string): Team | null => {
    // Group winners/runners-up: A1, B2, etc.
    if (/^[A-L][1-3]$/.test(slot)) {
      const groupId = slot[0];
      const rank = parseInt(slot[1]) - 1;
      const groupRanks = predictions[groupId] || [];
      const teamId = groupRanks[rank];
      if (!teamId) return null;
      
      const group = tournamentData.find(g => g.id === groupId);
      return group?.teams.find(t => t.id === teamId) || null;
    }

    // Losers of matches (for 3rd place): L101, L102
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

    // Third place teams: T1, T2, etc.
    if (/^T[1-8]$/.test(slot)) {
      const index = parseInt(slot[1]) - 1;
      const teamId = thirdPlaceSelected[index];
      if (!teamId) return null;

      for (const group of tournamentData) {
        const team = group.teams.find(t => t.id === teamId);
        if (team) return team;
      }
    }

    // Winners of matches: W74, W101, etc.
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

  const handleKnockoutWinner = (matchId: string, teamId: string) => {
    setKnockoutPredictions(prev => {
      const currentWinner = prev[matchId];
      const newPredictions = { ...prev };
      
      if (currentWinner === teamId) {
        // Unmark if already winner
        delete newPredictions[matchId];
      } else {
        newPredictions[matchId] = teamId;
      }
      
      const updatedPredictions = clearDependentMatches(matchId, newPredictions);

      // Auto-advance logic
      const currentRoundMatches = knockoutStructure.filter(m => m.round === knockoutRound);
      const isComplete = currentRoundMatches.every(m => updatedPredictions[m.id]);
      
      if (isComplete && currentWinner !== teamId) {
        const currentIndex = knockoutRounds.findIndex(r => r.key === knockoutRound);
        if (currentIndex < knockoutRounds.length - 1) {
          setTimeout(() => {
            setKnockoutRound(knockoutRounds[currentIndex + 1].key);
          }, 600); // 600ms delay for smooth transition
        }
      }

      return updatedPredictions;
    });
  };

  const clearDependentMatches = (matchId: string, predictions: Record<string, string>): Record<string, string> => {
    const currentMatch = knockoutStructure.find(m => m.id === matchId);
    if (!currentMatch?.nextMatchId) return predictions;

    const nextMatchId = currentMatch.nextMatchId;
    
    // If we changed Match X, we MUST clear the winner of any match that depends on Match X
    if (predictions[nextMatchId]) {
      delete predictions[nextMatchId];
      // Recurse to clear further downstream
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
    return knockoutStructure
      .filter(m => m.round === roundKey)
      .filter(m => knockoutPredictions[m.id])
      .length;
  };

  const getTotalMatchesForRound = (roundKey: string) => {
    return knockoutStructure.filter(m => m.round === roundKey).length;
  };

  const isRoundComplete = (roundKey: string) => {
    return getCompletedMatchesForRound(roundKey) === getTotalMatchesForRound(roundKey);
  };

  const renderKnockouts = () => {
    const currentMatches = knockoutStructure.filter(m => m.round === knockoutRound);
    const totalCompleted = knockoutRounds.reduce((acc, r) => acc + getCompletedMatchesForRound(r.key), 0);
    const totalMatches = 32;

    return (
      <div className="knockout-view">
        <div className="premium-info-card">
          <Trophy size={20} className="info-icon-blue" />
          <div className="info-text-content">
            <span className="info-title">Knockout Stage</span>
            <p className="info-desc">Select match winners to advance. Complete all rounds to crown the champion.</p>
          </div>
          <div className="ko-progress-badge">
            <span className="ko-progress-text">Progress: {totalCompleted} / {totalMatches}</span>
            <div className="ko-progress-bar-wrap">
              <div className="ko-progress-bar-fill" style={{ width: `${(totalCompleted / totalMatches) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="knockout-progress">
          <div className="knockout-progress-label">
            <span>Bracket Progress</span>
            <span className={totalCompleted === totalMatches ? 'complete' : ''}>
              {totalCompleted} / {totalMatches} matches decided
            </span>
          </div>
          <div className="knockout-progress-bar">
            <div 
              className="knockout-progress-fill" 
              style={{ width: `${(totalCompleted / totalMatches) * 100}%` }}
            />
          </div>
        </div>

        <div className="round-tabs">
          {knockoutRounds.map((round, index) => {
            const completed = getCompletedMatchesForRound(round.key);
            const total = getTotalMatchesForRound(round.key);
            const isComplete = completed === total;
            const isActive = knockoutRound === round.key;
            const prevRound = index > 0 ? knockoutRounds[index - 1] : null;
            const isLocked = prevRound ? !isRoundComplete(prevRound.key) : false;

            return (
              <button
                key={round.key}
                className={`round-tab ${isActive ? 'active' : ''} ${isComplete ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
                onClick={() => !isLocked && setKnockoutRound(round.key)}
                disabled={isLocked}
              >
                <span className="round-tab-label">{round.label}</span>
                <span className="round-tab-count">
                  {isComplete ? <ArrowRight size={14} style={{ color: 'var(--success)' }} /> : `${completed}/${total}`}
                </span>
              </button>
            );
          })}
        </div>

        <div className="knockout-matches-grid-container">
          <div className={`knockout-matches-grid grid-${knockoutRound}`}>
            {currentMatches.map(match => renderMatch(match))}
          </div>
        </div>

        {isRoundComplete('F') && (
          <div className="champion-podium">
            <div className="podium-content">
              <div className="podium-trophy">
                <Trophy size={100} className="trophy-gold-glow" />
                <div className="trophy-light-ray" />
              </div>
              <div className="podium-titles">
                <span className="celebration-subtitle">WORLD CHAMPION 2026</span>
                <h2 className="celebration-champion-name">{getTeamBySlot('W104')?.name}</h2>
              </div>
              
              <div className="podium-runners-up">
                <div className="runner-up-card silver">
                  <span className="pos-label">2nd Place</span>
                  <span className="team-label">{getTeamBySlot('L104')?.name}</span>
                </div>
                <div className="runner-up-card bronze">
                  <span className="pos-label">3rd Place</span>
                  <span className="team-label">{getTeamBySlot('W103')?.name}</span>
                </div>
              </div>

              <button className="share-bracket-final" onClick={handleShare}>
                Share Your Prediction <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMatch = (match: BracketMatch) => {
    const team1 = getTeamBySlot(match.team1Slot);
    const team2 = getTeamBySlot(match.team2Slot);
    const winnerId = knockoutPredictions[match.id];

    return (
      <div key={match.id} className={`ko-match-card ${winnerId ? 'decided' : ''}`}>
        <div className="ko-match-header">
          <span className="ko-match-id">MATCH {match.id}</span>
          {match.side !== 'center' && (
            <span className="ko-bracket-side">{match.side.toUpperCase()} BRACKET</span>
          )}
        </div>
        <div className="ko-match-body">
          <div 
            className={`ko-team-box ${team1?.id === winnerId ? 'winner' : ''} ${!team1 ? 'tbd' : ''}`}
            onClick={() => team1 && handleKnockoutWinner(match.id, team1.id)}
          >
            <div className="ko-team-info">
              {team1 && (
                <img 
                  src={`https://flagcdn.com/w80/${team1.flag.toLowerCase()}.png`} 
                  alt="" 
                  className="ko-flag-icon"
                />
              )}
              <span className="ko-team-name">{team1?.name || 'TBD'}</span>
            </div>
            {team1 && <span className="ko-rank-text">#{team1.rank}</span>}
            {team1?.id === winnerId && <div className="ko-winner-check"><Check size={14} /></div>}
          </div>

          <div className="ko-vs-divider">
            <div className="vs-line" />
            <span className="vs-text">VS</span>
            <div className="vs-line" />
          </div>

          <div 
            className={`ko-team-box ${team2?.id === winnerId ? 'winner' : ''} ${!team2 ? 'tbd' : ''}`}
            onClick={() => team2 && handleKnockoutWinner(match.id, team2.id)}
          >
            <div className="ko-team-info">
              {team2 && (
                <img 
                  src={`https://flagcdn.com/w80/${team2.flag.toLowerCase()}.png`} 
                  alt="" 
                  className="ko-flag-icon"
                />
              )}
              <span className="ko-team-name">{team2?.name || 'TBD'}</span>
            </div>
            {team2 && <span className="ko-rank-text">#{team2.rank}</span>}
            {team2?.id === winnerId && <div className="ko-winner-check"><Check size={14} /></div>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="predictor-page-wrapper">
      {renderHeader()}
      
      <div className="predictor-container">
        <div className="predictor-top-bar">
          <div className="nav-tabs">
            <button 
              className={`tab-button ${activeTab === 'groups' ? 'active' : ''}`}
              onClick={() => setActiveTab('groups')}
            >
              Group Stage
            </button>
            <button 
              className={`tab-button ${activeTab === 'third-place' ? 'active' : ''}`}
              onClick={() => setActiveTab('third-place')}
              disabled={Object.values(predictions).filter(ranks => ranks.length === 4).length < tournamentData.length}
            >
              Third Place
            </button>
            <button 
              className={`tab-button ${activeTab === 'knockouts' ? 'active' : ''}`}
              onClick={() => setActiveTab('knockouts')}
              disabled={thirdPlaceSelected.length !== 8}
            >
              Knockout Rounds
            </button>
            {/* <button className="tab-button">Share</button> */}
          </div>
          <button className="start-over-top" onClick={handleStartOver}>
            <RotateCcw size={16} /> Start Over
          </button>
        </div>

        {activeTab === 'groups' && renderGroupStage()}
        {activeTab === 'third-place' && renderThirdPlace()}
        {activeTab === 'knockouts' && renderKnockouts()}

        {activeTab === 'groups' && (
          <footer className="predictor-footer">
            <button className="continue-button" onClick={handleContinue}>
              Continue to Third Place <ArrowRight size={20} />
            </button>
          </footer>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmAction}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.type === 'alert' ? 'OK' : 'Confirm'}
        hideCancel={modalConfig.type === 'alert'}
      />
    </div>
  );
};

export default Predictor;
