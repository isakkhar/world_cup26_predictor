import React, { useState } from 'react';
import { Trophy, Check } from 'lucide-react';
import { knockoutStructure } from '../../data/bracket';
import { usePredictor } from '../../context/PredictorContext';

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
