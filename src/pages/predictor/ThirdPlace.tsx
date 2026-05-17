import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Info } from 'lucide-react';
import { tournamentData } from '../../data/tournament';
import type { Team } from '../../data/tournament';
import { usePredictor } from '../../context/PredictorContext';
import Modal from '../../components/ui/Modal';

const ThirdPlace: React.FC = () => {
  const { predictions, thirdPlaceSelected, toggleThirdPlaceTeam, getQualifiedTeamsList, user } = usePredictor();
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/predict/groups');
    }
  }, [user, navigate]);

  const showTeamStats = (team: Team) => {
    setSelectedTeam(team);
    setIsStatsModalOpen(true);
  };

  const qualifiedTeams = getQualifiedTeamsList();

  return (
    <div className="third-place-view">
      <div className="premium-info-card rank-guide-card">
        <div className="guide-icon-3d">
          <Info size={24} color="#ffffff" strokeWidth={2.5} />
        </div>
        <div className="info-text-content">
          <span className="info-title-blue">BEST THIRD-PLACE TEAMS</span>
          <p className="info-desc-blue">
            <strong>Select 8 teams:</strong> Tap teams below to advance them to the knockout bracket.
          </p>
        </div>
        <div className="qualification-tracker">
          <span className="qualified-count" style={{ color: '#0369a1', fontWeight: 800 }}>{thirdPlaceSelected.length} / 8</span>
          <div className="mini-progress-dots">
            {[...Array(8)].map((_, i) => <div key={i} className={`dot ${i < thirdPlaceSelected.length ? 'active' : ''}`} style={{ backgroundColor: i < thirdPlaceSelected.length ? '#0284c7' : 'rgba(2,132,199,0.2)' }} />)}
          </div>
        </div>
      </div>

      <div className="qualified-teams-strip">
        <div className="strip-label">QUALIFIED TEAMS {thirdPlaceSelected.length}/8</div>
        <div className="strip-flags">
          {qualifiedTeams.map(team => (
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
                <div className="tp-flag-hover"><Info size={14} /></div>
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
        <button className="continue-button" disabled={thirdPlaceSelected.length !== 8} onClick={() => navigate('/predict/knockouts')}>CONFIRM & ADVANCE <ArrowRight size={20} /></button>
      </footer>

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

export default ThirdPlace;
