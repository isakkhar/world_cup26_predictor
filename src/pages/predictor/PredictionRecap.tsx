import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Share2, ClipboardCheck, ArrowLeftRight } from 'lucide-react';
import { usePredictor } from '../../context/PredictorContext';
import { tournamentData } from '../../data/tournament';
import './Predictor.css';

const PredictionRecap: React.FC = () => {
  const navigate = useNavigate();
  const { 
    knockoutPredictions, getTeamBySlot, thirdPlaceSelected,
    isSharedMode, sharedUsername, sharedScore, exitSharedMode,
    user, savePredictionsToSupabase
  } = usePredictor();

  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(() => localStorage.getItem('wc2026_submitted_id'));

  useEffect(() => {
    if (!user) {
      navigate('/predict/groups');
    }
  }, [user, navigate]);

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

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/predict/share?id=${submittedId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate('/predict/auth');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);

    try {
      const displayName = user.user_metadata?.username || user.email?.split('@')[0] || 'Predictor';
      const newSubmittedId = await savePredictionsToSupabase(displayName);
      setSubmittedId(newSubmittedId);
    } catch (err: unknown) {
      console.error('Error submitting predictions:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to write data. Please check connection and try again.');
    } finally {
      setSubmitting(false);
    }
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
        {isSharedMode ? `${sharedUsername}'s 2026 WC Prediction` : 'My 2026 WC Prediction'}
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

      {/* ==========================================================
         🏆 SUBMIT TO LEADERBOARD & SHARE WIDGETS
         ========================================================== */}
      {isSharedMode ? (
        <div className="share-section card-glowing-border shared-view-badge">
          <div className="share-section-glow"></div>
          <h3>👀 Viewing Shared Bracket</h3>
          <p>You are interactively browsing <strong>{sharedUsername}</strong>'s World Cup selections (Score: <strong>{sharedScore} pts</strong>). Ready to challenge them?</p>
          <button 
            className="share-submit-btn" 
            onClick={() => {
              exitSharedMode();
              navigate('/predict/groups');
            }}
          >
            <ArrowLeftRight size={18} />
            Predict Your Own World Cup
          </button>
        </div>
      ) : user ? (
        <div className="share-section card-glowing-border">
          <div className="share-section-glow"></div>
          <h3>🎉 Your Bracket is Linked & Live!</h3>
          <p>Your picks are securely saved to your account and synced with the global leaderboard. Share this interactive link to show off your exact selections!</p>
          
          <div className="share-input-group">
            <input 
              type="text" 
              readOnly 
              value={submittedId ? `${window.location.origin}/predict/share?id=${submittedId}` : 'Generating cloud link...'} 
              className="share-url-input"
            />
            <button className="share-copy-btn" onClick={handleCopyLink} disabled={!submittedId}>
              {copied ? <ClipboardCheck size={18} /> : <Share2 size={18} />}
              {copied ? 'Copied! ✓' : 'Copy Share Link'}
            </button>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              className="share-submit-btn" 
              onClick={handleSubmit} 
              disabled={submitting}
              style={{ width: 'auto', padding: '0.8rem 1.5rem' }}
            >
              {submitting ? 'Syncing...' : '⚡ Force Cloud Sync'}
            </button>
          </div>
          {submitError && <span className="submit-error" style={{ display: 'block', textAlign: 'center', marginTop: '0.5rem' }}>{submitError}</span>}
        </div>
      ) : (
        <div className="share-section card-glowing-border">
          <div className="share-section-glow"></div>
          <h3>🌍 Save & Sync Your Predictions</h3>
          <p>Sign in or create a free account to back up your selections securely, join the Global Leaderboard, and generate a unique interactive sharing link!</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button 
              className="share-submit-btn" 
              onClick={() => navigate('/predict/auth')}
              style={{ width: 'auto', padding: '1rem 2.5rem', fontSize: '1.05rem' }}
            >
              Sign In to Save Bracket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionRecap;
