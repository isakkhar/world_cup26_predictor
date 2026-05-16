import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, ArrowRight } from 'lucide-react';
import { tournamentData } from '../../data/tournament';
import type { Team } from '../../data/tournament';
import { usePredictor } from '../../context/PredictorContext';
import Modal from '../../components/ui/Modal';

const GroupStage: React.FC = () => {
  const { predictions, handleRankTeam } = usePredictor();
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  const showTeamStats = (team: Team) => {
    setSelectedTeam(team);
    setIsStatsModalOpen(true);
  };

  return (
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
                    <div className="flag-overlay"><Info size={14} /></div>
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
        <button className="continue-button" onClick={() => navigate('/predict/third-place')}>CONTINUE TO THIRD PLACE <ArrowRight size={20} /></button>
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
    </>
  );
};

export default GroupStage;
