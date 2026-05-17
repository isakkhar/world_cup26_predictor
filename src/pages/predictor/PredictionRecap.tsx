import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { usePredictor } from '../../context/PredictorContext';
import { tournamentData } from '../../data/tournament';
import './Predictor.css';

const PredictionRecap: React.FC = () => {
  const navigate = useNavigate();
  const { knockoutPredictions, getTeamBySlot, thirdPlaceSelected } = usePredictor();

  const championId = knockoutPredictions['104'];

  const getTeamById = (teamId: string) => {
    for (const group of tournamentData) {
      const team = group.teams.find(t => t.id === teamId);
      if (team) return team;
    }
    return null;
  };

  const getRunnerUp = () => {
    if (!championId) return null;
    const w101 = knockoutPredictions['101'];
    const w102 = knockoutPredictions['102'];
    const runnerId = championId === w101 ? w102 : w101;
    if (!runnerId) return null;
    return getTeamById(runnerId);
  };

  const getThirdPlace = () => {
    const thirdId = knockoutPredictions['103'];
    if (!thirdId) return null;
    return getTeamById(thirdId);
  };

  const getFourthPlace = () => {
    const thirdId = knockoutPredictions['103'];
    if (!thirdId) return null;
    const w97 = knockoutPredictions['97'];
    const w98 = knockoutPredictions['98'];
    const w99 = knockoutPredictions['99'];
    const w100 = knockoutPredictions['100'];
    const w101 = knockoutPredictions['101'];
    const w102 = knockoutPredictions['102'];
    const loser101 = w101 === w97 ? w98 : w97;
    const loser102 = w102 === w99 ? w100 : w99;
    const fourthId = thirdId === loser101 ? loser102 : loser101;
    if (!fourthId) return null;
    return getTeamById(fourthId);
  };

  const getQFLosers = () => {
    const losers: string[] = [];
    const pairs = [
      { m: '97', t1: knockoutPredictions['89'], t2: knockoutPredictions['90'] },
      { m: '98', t1: knockoutPredictions['93'], t2: knockoutPredictions['94'] },
      { m: '99', t1: knockoutPredictions['91'], t2: knockoutPredictions['92'] },
      { m: '100', t1: knockoutPredictions['95'], t2: knockoutPredictions['96'] },
    ];
    pairs.forEach(p => {
      const winner = knockoutPredictions[p.m];
      if (p.t1 && p.t2 && winner) {
        const loserId = winner === p.t1 ? p.t2 : p.t1;
        const team = getTeamById(loserId);
        if (team) losers.push(team.code);
      }
    });
    return losers;
  };

  const getR16Losers = () => {
    const losers: string[] = [];
    const pairs = [
      { m: '89', t1: knockoutPredictions['74'], t2: knockoutPredictions['77'] },
      { m: '90', t1: knockoutPredictions['73'], t2: knockoutPredictions['75'] },
      { m: '91', t1: knockoutPredictions['76'], t2: knockoutPredictions['78'] },
      { m: '92', t1: knockoutPredictions['79'], t2: knockoutPredictions['80'] },
      { m: '93', t1: knockoutPredictions['83'], t2: knockoutPredictions['84'] },
      { m: '94', t1: knockoutPredictions['81'], t2: knockoutPredictions['82'] },
      { m: '95', t1: knockoutPredictions['86'], t2: knockoutPredictions['88'] },
      { m: '96', t1: knockoutPredictions['85'], t2: knockoutPredictions['87'] },
    ];
    pairs.forEach(p => {
      const winner = knockoutPredictions[p.m];
      if (p.t1 && p.t2 && winner) {
        const loserId = winner === p.t1 ? p.t2 : p.t1;
        const team = getTeamById(loserId);
        if (team) losers.push(team.code);
      }
    });
    return losers;
  };

  const getThirdPlaceGroupsList = () => {
    const letters: string[] = [];
    thirdPlaceSelected.forEach(teamId => {
      for (const group of tournamentData) {
        if (group.teams.some(t => t.id === teamId)) {
          letters.push(group.id.toUpperCase());
          break;
        }
      }
    });
    return letters.sort().join(' • ');
  };

  // If no champion has been decided yet, show the empty/incomplete state
  if (!championId) {
    return (
      <div className="recap-empty-state">
        <div className="recap-empty-icon">🏆</div>
        <h3>Prediction Incomplete</h3>
        <p>
          You haven't crowned your World Cup Champion yet! Finish predicting all knockout stages to unlock your complete tournament recap.
        </p>
        <button 
          className="recap-empty-btn" 
          onClick={() => navigate('/predict/knockouts')}
        >
          🏆 Go to Knockouts
        </button>
      </div>
    );
  }

  const champion = getTeamBySlot('W104');
  const runnerUp = getRunnerUp();
  const thirdPlace = getThirdPlace();
  const fourthPlace = getFourthPlace();

  return (
    <div className="recap-view-container">
      {/* Title */}
      <h3 className="recap-title">
        My 2026 WC Prediction
      </h3>

      {/* Champion Card */}
      <div className="recap-card champ">
        <div className="recap-card-info">
          <div className="recap-card-icon">
            <Trophy size={24} className="animate-pulse" />
          </div>
          <div className="recap-card-details">
            <span className="recap-card-label">CHAMPION</span>
            <span className="recap-card-value">
              {champion && (
                <img 
                  src={`https://flagcdn.com/w80/${champion.flag.toLowerCase()}.png`} 
                  alt="" 
                  className="recap-flag" 
                />
              )}
              {champion?.name || 'Undecided'}
            </span>
          </div>
        </div>
      </div>

      {/* Runner-up Card */}
      <div className="recap-card runner">
        <div className="recap-card-info">
          <div className="recap-card-icon">
            2
          </div>
          <div className="recap-card-details">
            <span className="recap-card-label">RUNNER-UP</span>
            <span className="recap-card-value">
              {runnerUp && (
                <img 
                  src={`https://flagcdn.com/w80/${runnerUp.flag.toLowerCase()}.png`} 
                  alt="" 
                  className="recap-flag" 
                />
              )}
              {runnerUp?.name || 'Undecided'}
            </span>
          </div>
        </div>
      </div>

      {/* 3rd Place Card */}
      <div className="recap-card third">
        <div className="recap-card-info">
          <div className="recap-card-icon">
            3
          </div>
          <div className="recap-card-details">
            <span className="recap-card-label">3RD PLACE</span>
            <span className="recap-card-value">
              {thirdPlace && (
                <img 
                  src={`https://flagcdn.com/w80/${thirdPlace.flag.toLowerCase()}.png`} 
                  alt="" 
                  className="recap-flag" 
                />
              )}
              {thirdPlace?.name || 'Undecided'}
            </span>
          </div>
        </div>
      </div>

      {/* 4th Place Card */}
      <div className="recap-card fourth">
        <div className="recap-card-info">
          <div className="recap-card-icon">
            4
          </div>
          <div className="recap-card-details">
            <span className="recap-card-label">4TH PLACE</span>
            <span className="recap-card-value">
              {fourthPlace && (
                <img 
                  src={`https://flagcdn.com/w80/${fourthPlace.flag.toLowerCase()}.png`} 
                  alt="" 
                  className="recap-flag" 
                />
              )}
              {fourthPlace?.name || 'Undecided'}
            </span>
          </div>
        </div>
      </div>

      {/* Lists Section */}
      <div className="recap-lists-section">
        <div className="recap-list-item">
          <span className="recap-list-title">ELIMINATED IN QUARTERFINALS</span>
          <span className="recap-list-values">
            {getQFLosers().join('   ') || 'None'}
          </span>
        </div>
        <div className="recap-list-item">
          <span className="recap-list-title">ELIMINATED IN ROUND OF 16</span>
          <span className="recap-list-values">
            {getR16Losers().join('   ') || 'None'}
          </span>
        </div>
        <div className="recap-list-item">
          <span className="recap-list-title">3RD PLACE TEAMS FROM GROUPS</span>
          <span className="recap-list-values">
            {getThirdPlaceGroupsList() || 'None'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PredictionRecap;
