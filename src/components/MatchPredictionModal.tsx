import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { usePredictor } from '../context/PredictorContext';
import type { Team } from '../data/tournament';
import './MatchPredictionModal.css';

interface MatchPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  team1: Team | null;
  team2: Team | null;
}

const MatchPredictionModal: React.FC<MatchPredictionModalProps> = ({
  isOpen,
  onClose,
  matchId,
  team1,
  team2
}) => {
  const { matchPredictions, updateMatchPrediction, handleKnockoutWinner, knockoutPredictions } = usePredictor();
  const [customScorerName, setCustomScorerName] = useState('');
  const [selectedScorerTeam, setSelectedScorerTeam] = useState<string>('');

  if (!team1 || !team2) return null;

  const prediction = matchPredictions[matchId] || {
    goals1: null,
    goals2: null,
    advanceMethod: 'regular',
    scorers: [],
    yellowCards: 0,
    redCards: false,
    penalties: false
  };

  const goals1 = prediction.goals1 !== null && prediction.goals1 !== undefined ? prediction.goals1 : 0;
  const goals2 = prediction.goals2 !== null && prediction.goals2 !== undefined ? prediction.goals2 : 0;

  const currentWinnerId = knockoutPredictions[matchId];

  // Helper to update prediction and auto-resolve knockout winner if score changes
  const setScore = (newGoals1: number, newGoals2: number) => {
    let method = prediction.advanceMethod || 'regular';
    let winnerId = currentWinnerId;

    if (newGoals1 > newGoals2) {
      winnerId = team1.id;
      if (method === 'pk') method = 'regular';
    } else if (newGoals2 > newGoals1) {
      winnerId = team2.id;
      if (method === 'pk') method = 'regular';
    } else {
      // If equal, default to team1 or current winner as advancement fallback, and force ET or PK
      if (method === 'regular') method = 'et';
      if (!winnerId) winnerId = team1.id;
    }

    updateMatchPrediction(matchId, {
      goals1: newGoals1,
      goals2: newGoals2,
      advanceMethod: method
    });

    if (winnerId && winnerId !== currentWinnerId) {
      handleKnockoutWinner(matchId, winnerId);
    }
  };

  const handleAddScorer = (playerName: string, teamId: string) => {
    if (!playerName.trim()) return;
    const newScorers = [...(prediction.scorers || []), { teamId, playerName: playerName.trim() }];
    updateMatchPrediction(matchId, { scorers: newScorers });
    setCustomScorerName('');
  };

  const handleRemoveScorer = (index: number) => {
    const newScorers = [...(prediction.scorers || [])];
    newScorers.splice(index, 1);
    updateMatchPrediction(matchId, { scorers: newScorers });
  };

  const handleWinnerSelect = (winnerId: string) => {
    handleKnockoutWinner(matchId, winnerId);
  };

  const handleAdvanceMethodChange = (method: 'regular' | 'et' | 'pk') => {
    updateMatchPrediction(matchId, { advanceMethod: method });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="mp-modal-overlay" onClick={onClose}>
          <motion.div
            className="mp-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mp-modal-header">
              <h3>Match Prediction & Details</h3>
              <button className="mp-close-btn" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {/* Teams and Score Predictor */}
            <div className="mp-score-section">
              <div className="mp-team-panel">
                <img
                  src={`https://flagcdn.com/w160/${team1.flag.toLowerCase()}.png`}
                  alt=""
                  className="mp-flag"
                />
                <span className="mp-team-name">{team1.name}</span>
                <div className="mp-score-stepper">
                  <button
                    onClick={() => setScore(Math.max(0, goals1 - 1), goals2)}
                    className="mp-stepper-btn"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="mp-score-val">{goals1}</span>
                  <button onClick={() => setScore(goals1 + 1, goals2)} className="mp-stepper-btn">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="mp-vs-badge">VS</div>

              <div className="mp-team-panel">
                <img
                  src={`https://flagcdn.com/w160/${team2.flag.toLowerCase()}.png`}
                  alt=""
                  className="mp-flag"
                />
                <span className="mp-team-name">{team2.name}</span>
                <div className="mp-score-stepper">
                  <button
                    onClick={() => setScore(goals1, Math.max(0, goals2 - 1))}
                    className="mp-stepper-btn"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="mp-score-val">{goals2}</span>
                  <button onClick={() => setScore(goals1, goals2 + 1)} className="mp-stepper-btn">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Decided In (Draw / Knockout resolution) */}
            <div className="mp-settings-card">
              <div className="mp-setting-row">
                <span className="mp-setting-label">Match Resolution</span>
                <div className="mp-options-group">
                  <button
                    className={`mp-option-btn ${prediction.advanceMethod === 'regular' ? 'active' : ''} ${goals1 === goals2 ? 'disabled' : ''}`}
                    onClick={() => goals1 !== goals2 && handleAdvanceMethodChange('regular')}
                    disabled={goals1 === goals2}
                  >
                    90 Mins
                  </button>
                  <button
                    className={`mp-option-btn ${prediction.advanceMethod === 'et' ? 'active' : ''}`}
                    onClick={() => handleAdvanceMethodChange('et')}
                  >
                    Extra Time
                  </button>
                  <button
                    className={`mp-option-btn ${prediction.advanceMethod === 'pk' ? 'active' : ''}`}
                    onClick={() => handleAdvanceMethodChange('pk')}
                  >
                    Penalties
                  </button>
                </div>
              </div>

              {/* Force winner selection if tie */}
              {goals1 === goals2 && (
                <div className="mp-setting-row alert-row">
                  <span className="mp-setting-label warning-text">Who Advances?</span>
                  <div className="mp-options-group">
                    <button
                      className={`mp-option-btn ${currentWinnerId === team1.id ? 'active-green' : ''}`}
                      onClick={() => handleWinnerSelect(team1.id)}
                    >
                      {team1.name}
                    </button>
                    <button
                      className={`mp-option-btn ${currentWinnerId === team2.id ? 'active-green' : ''}`}
                      onClick={() => handleWinnerSelect(team2.id)}
                    >
                      {team2.name}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Goalscorers Selection */}
            <div className="mp-scorers-section">
              <h4>⚽ Predicted Goalscorers</h4>
              
              <div className="mp-scorer-input-group">
                <select
                  value={selectedScorerTeam}
                  onChange={(e) => setSelectedScorerTeam(e.target.value)}
                  className="mp-scorer-select"
                >
                  <option value="">Select Team</option>
                  <option value={team1.id}>{team1.name}</option>
                  <option value={team2.id}>{team2.name}</option>
                </select>

                <input
                  type="text"
                  placeholder="Player Name (e.g. Messi)"
                  value={customScorerName}
                  onChange={(e) => setCustomScorerName(e.target.value)}
                  className="mp-scorer-text-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && selectedScorerTeam) {
                      handleAddScorer(customScorerName, selectedScorerTeam);
                    }
                  }}
                />

                <button
                  onClick={() => selectedScorerTeam && handleAddScorer(customScorerName, selectedScorerTeam)}
                  className="mp-add-scorer-btn"
                  disabled={!selectedScorerTeam || !customScorerName.trim()}
                >
                  Add
                </button>
              </div>

              {/* Star Player Quick Buttons */}
              <div className="mp-quick-scorers">
                {team1.starPlayer && (
                  <button
                    onClick={() => handleAddScorer(team1.starPlayer!, team1.id)}
                    className="mp-quick-btn"
                  >
                    + {team1.starPlayer} (Star)
                  </button>
                )}
                {team2.starPlayer && (
                  <button
                    onClick={() => handleAddScorer(team2.starPlayer!, team2.id)}
                    className="mp-quick-btn"
                  >
                    + {team2.starPlayer} (Star)
                  </button>
                )}
              </div>

              {/* Scorers List */}
              <div className="mp-scorers-list">
                {prediction.scorers && prediction.scorers.length > 0 ? (
                  prediction.scorers.map((scorer, idx) => {
                    const scorerTeam = scorer.teamId === team1.id ? team1 : team2;
                    return (
                      <div key={idx} className="mp-scorer-badge">
                        <img
                          src={`https://flagcdn.com/w40/${scorerTeam.flag.toLowerCase()}.png`}
                          alt=""
                          className="mp-badge-flag"
                        />
                        <span>{scorer.playerName}</span>
                        <button onClick={() => handleRemoveScorer(idx)} className="mp-remove-scorer-btn">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="mp-no-scorers-text">No goalscorers predicted yet.</p>
                )}
              </div>
            </div>

            {/* Match Event Props */}
            <div className="mp-props-section">
              <h4>🎯 Match Props & Events</h4>
              <div className="mp-props-grid">
                <label className="mp-prop-card">
                  <input
                    type="checkbox"
                    checked={!!prediction.redCards}
                    onChange={(e) => updateMatchPrediction(matchId, { redCards: e.target.checked })}
                  />
                  <div className="mp-prop-card-content">
                    <span className="mp-prop-icon">🟥</span>
                    <span className="mp-prop-title">Red Card</span>
                    <span className="mp-prop-desc">At least one player sent off</span>
                  </div>
                </label>

                <label className="mp-prop-card">
                  <input
                    type="checkbox"
                    checked={!!prediction.penalties}
                    onChange={(e) => updateMatchPrediction(matchId, { penalties: e.target.checked })}
                  />
                  <div className="mp-prop-card-content">
                    <span className="mp-prop-icon">🎯</span>
                    <span className="mp-prop-title">Penalty Kick</span>
                    <span className="mp-prop-desc">Penalty awarded during game</span>
                  </div>
                </label>

                <div className="mp-prop-stepper-card">
                  <span className="mp-prop-icon">🟨</span>
                  <div className="mp-prop-details">
                    <span className="mp-prop-title">Yellow Cards</span>
                    <span className="mp-prop-desc">Total cards shown</span>
                  </div>
                  <div className="mp-prop-stepper">
                    <button
                      onClick={() => updateMatchPrediction(matchId, { yellowCards: Math.max(0, (prediction.yellowCards || 0) - 1) })}
                      className="mp-prop-btn"
                    >
                      -
                    </button>
                    <span className="mp-prop-val">{prediction.yellowCards || 0}</span>
                    <button
                      onClick={() => updateMatchPrediction(matchId, { yellowCards: (prediction.yellowCards || 0) + 1 })}
                      className="mp-prop-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto Save Alert */}
            <div className="mp-footer-alert">
              <span className="mp-alert-icon">⚡</span>
              <span>Changes auto-save instantly to browser and cloud backups.</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MatchPredictionModal;
