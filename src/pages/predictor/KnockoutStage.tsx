import React, { useState } from 'react';
import { Trophy, Check } from 'lucide-react';
import { knockoutStructure } from '../../data/bracket';
import { usePredictor } from '../../context/PredictorContext';

const KnockoutStage: React.FC = () => {
  const { knockoutPredictions, handleKnockoutWinner, getTeamBySlot } = usePredictor();
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

  return (
    <div className="knockout-view">
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
  );
};

export default KnockoutStage;
