import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RefreshCw, Loader2, Award, Check } from 'lucide-react';
import { usePredictor } from '../../context/PredictorContext';
import { tournamentData } from '../../data/tournament';
import type { Team } from '../../data/tournament';
import { knockoutStructure } from '../../data/bracket';
import {
  actualGroupStandings,
  actualThirdPlaceSelected,
  actualMatchResults
} from '../../data/actualResults';
import type { ActualMatch } from '../../data/actualResults';
import './LiveCompare.css';

const LiveCompare: React.FC = () => {
  const { predictions, thirdPlaceSelected, knockoutPredictions, getTeamBySlot } = usePredictor();
  const [loading, setLoading] = useState(true);
  const [liveDataActive, setLiveDataActive] = useState(false);
  
  const groupStandings = actualGroupStandings;
  const thirdPlaceSelectedActual = actualThirdPlaceSelected;
  const [matchResults, setMatchResults] = useState<Record<string, ActualMatch>>(actualMatchResults);
  const [activeTab, setActiveTab] = useState<'groups' | 'knockouts'>('groups');

  const fetchLiveResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'
      );
      if (!response.ok) throw new Error('Network response not ok');
      const data = await response.json();

      if (data && data.matches && data.matches.length > 0) {
        // We successfully fetched live data!
        // In a real tournament, we would parse matches and dynamically compute standings.
        // For the sake of this client-side app, we use a hybrid approach:
        // We parse the live matches array to update any live matches, and fallback to our offline structure.
        const updatedMatches = { ...actualMatchResults };
        
        // Map team name to teamId
        const teamNameToId = (name: string): string => {
          const normalized = name.toLowerCase().trim();
          for (const group of tournamentData) {
            const team = group.teams.find(
              (t) =>
                t.name.toLowerCase() === normalized ||
                t.name.toLowerCase().replace('&', 'and') === normalized.replace('&', 'and')
            );
            if (team) return team.id;
          }
          return '';
        };

        // Parse matches
        data.matches.forEach((m: any, idx: number) => {
          if (m.score && m.score.ft) {
            const t1Id = teamNameToId(m.team1);
            const t2Id = teamNameToId(m.team2);
            if (t1Id && t2Id) {
              const matchId = String(idx + 73); // Matchday index maps to matchId in knockout or group
              // Check if knockout match
              if (idx >= 72) {
                updatedMatches[matchId] = {
                  matchId,
                  team1Id: t1Id,
                  team2Id: t2Id,
                  goals1: m.score.ft[0],
                  goals2: m.score.ft[1],
                  winnerId: m.score.ft[0] > m.score.ft[1] ? t1Id : t2Id,
                  advanceMethod: 'regular',
                  events: [],
                  yellowCards: 0,
                  redCards: false,
                  penalties: false,
                  status: 'completed'
                };
              }
            }
          }
        });

        setMatchResults(updatedMatches);
        setLiveDataActive(true);
      }
    } catch (err) {
      console.warn('Failed to load live API data. Falling back to offline standings.', err);
      setLiveDataActive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 1. Calculations: Group stage rankings accuracy
  let correctGroupTeamsCount = 0;
  let totalGroupTeamsCount = 0;
  Object.keys(groupStandings).forEach((groupId) => {
    const actual = groupStandings[groupId] || [];
    const predicted = predictions[groupId] || [];
    actual.forEach((teamId, idx) => {
      totalGroupTeamsCount++;
      if (predicted[idx] === teamId) {
        correctGroupTeamsCount++;
      }
    });
  });

  const groupAccuracyPercent = totalGroupTeamsCount > 0 
    ? Math.round((correctGroupTeamsCount / totalGroupTeamsCount) * 100) 
    : 0;

  // 2. Calculations: Third-place advancement accuracy
  let correctThirdPlaceCount = 0;
  thirdPlaceSelected.forEach((teamId) => {
    if (thirdPlaceSelectedActual.includes(teamId)) {
      correctThirdPlaceCount++;
    }
  });
  const thirdPlaceAccuracyPercent = Math.round((correctThirdPlaceCount / 8) * 100);

  // 3. Calculations: Knockout winners accuracy
  let correctKnockoutCount = 0;
  let playedKnockoutCount = 0;
  Object.keys(matchResults).forEach((matchId) => {
    const actual = matchResults[matchId];
    if (actual.status === 'completed') {
      playedKnockoutCount++;
      const userWinner = knockoutPredictions[matchId];
      if (userWinner === actual.winnerId) {
        correctKnockoutCount++;
      }
    }
  });
  const knockoutAccuracyPercent = playedKnockoutCount > 0 
    ? Math.round((correctKnockoutCount / playedKnockoutCount) * 100) 
    : 0;

  // 4. Score Calculation
  const groupPoints = correctGroupTeamsCount * 10;
  const thirdPoints = correctThirdPlaceCount * 20;
  const knockoutPoints = correctKnockoutCount * 40;
  const totalScoreEstimate = groupPoints + thirdPoints + knockoutPoints;

  const totalPossiblePoints = (totalGroupTeamsCount * 10) + (8 * 20) + (playedKnockoutCount * 40);
  const overallAccuracyPercent = totalPossiblePoints > 0 
    ? Math.round((totalScoreEstimate / totalPossiblePoints) * 100) 
    : 0;

  const getTeamById = (id: string): Team | null => {
    for (const group of tournamentData) {
      const team = group.teams.find((t) => t.id === id);
      if (team) return team;
    }
    return null;
  };

  return (
    <div className="live-compare-view animate-fade-in">
      {/* Accuracy Header */}
      <div className="live-compare-header">
        <div className="accuracy-main-card">
          <div className="accuracy-ring-container">
            <div className="accuracy-percentage">{overallAccuracyPercent}%</div>
            <span className="accuracy-label">OVERALL ACCURACY</span>
          </div>
          <div className="points-showcase">
            <div className="points-val">
              <Award className="points-award-icon" size={24} /> {totalScoreEstimate} pts
            </div>
            <span className="points-sub">ESTIMATED FANTASY SCORE</span>
          </div>
        </div>

        {/* Sync Info */}
        <div className="live-sync-indicator-card">
          <div className="live-sync-header-row">
            <h4>Live Feed Status</h4>
            <button className="sync-refresh-btn" onClick={fetchLiveResults} disabled={loading}>
              {loading ? <Loader2 className="spinning-loader" size={14} /> : <RefreshCw size={14} />}
              <span>Sync Results</span>
            </button>
          </div>
          <div className="sync-status-details">
            <span className={`status-badge ${liveDataActive ? 'live' : 'local'}`}>
              {liveDataActive ? '● LIVE API ACTIVE' : '● OFFLINE ARCHIVE'}
            </span>
            <p className="sync-desc">
              {liveDataActive
                ? 'Syncing scores directly from World Cup match event feeds.'
                : 'Displaying offline tournament database. Standings correct as of June 28, 2026.'}
            </p>
          </div>
        </div>
      </div>

      {/* Accuracy Stats Row */}
      <div className="accuracy-metrics-grid">
        <div className="metric-box">
          <div className="metric-header">
            <span className="title">Group Standings</span>
            <span className="accuracy">{groupAccuracyPercent}%</span>
          </div>
          <div className="metric-progress-wrapper">
            <div className="fill" style={{ width: `${groupAccuracyPercent}%`, backgroundColor: '#3b82f6' }} />
          </div>
          <span className="details">{correctGroupTeamsCount} / {totalGroupTeamsCount} ranks correct (+{groupPoints} pts)</span>
        </div>

        <div className="metric-box">
          <div className="metric-header">
            <span className="title">Third-Place Advanced</span>
            <span className="accuracy">{thirdPlaceAccuracyPercent}%</span>
          </div>
          <div className="metric-progress-wrapper">
            <div className="fill" style={{ width: `${thirdPlaceAccuracyPercent}%`, backgroundColor: '#10b981' }} />
          </div>
          <span className="details">{correctThirdPlaceCount} / 8 teams correct (+{thirdPoints} pts)</span>
        </div>

        <div className="metric-box">
          <div className="metric-header">
            <span className="title">Knockout Match Winners</span>
            <span className="accuracy">{knockoutAccuracyPercent}%</span>
          </div>
          <div className="metric-progress-wrapper">
            <div className="fill" style={{ width: `${knockoutAccuracyPercent}%`, backgroundColor: '#eab308' }} />
          </div>
          <span className="details">{correctKnockoutCount} / {playedKnockoutCount} winners correct (+{knockoutPoints} pts)</span>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="compare-tabs-bar">
        <button
          className={`compare-tab ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          Groups Rankings Compare
        </button>
        <button
          className={`compare-tab ${activeTab === 'knockouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('knockouts')}
        >
          Knockout Matches Results
        </button>
      </div>

      {/* Comparison grids */}
      {activeTab === 'groups' ? (
        <div className="compare-grid-standings">
          {tournamentData.map((group) => {
            const actualRankings = groupStandings[group.id] || [];
            const userRankings = predictions[group.id] || [];
            return (
              <div key={group.id} className="compare-group-card">
                <h5>{group.name}</h5>
                <div className="standings-table-header">
                  <span>Pos</span>
                  <span>Your Pick</span>
                  <span>Actual Standings</span>
                </div>
                <div className="standings-compare-list">
                  {Array.from({ length: 4 }).map((_, idx) => {
                    const actualTeam = getTeamById(actualRankings[idx]);
                    const userTeam = getTeamById(userRankings[idx]);
                    const isMatch = actualRankings[idx] === userRankings[idx];

                    return (
                      <div key={idx} className={`standings-compare-row ${isMatch ? 'match' : 'mismatch'}`}>
                        <span className="position-idx">{idx + 1}</span>
                        <div className="team-col">
                          {userTeam ? (
                            <>
                              <img
                                src={`https://flagcdn.com/w40/${userTeam.flag.toLowerCase()}.png`}
                                alt=""
                                className="tiny-flag"
                              />
                              <span className="team-name">{userTeam.name}</span>
                            </>
                          ) : (
                            <span className="team-name text-slate-500">Empty</span>
                          )}
                        </div>
                        <div className="team-col">
                          {actualTeam ? (
                            <>
                              <img
                                src={`https://flagcdn.com/w40/${actualTeam.flag.toLowerCase()}.png`}
                                alt=""
                                className="tiny-flag"
                              />
                              <span className="team-name">{actualTeam.name}</span>
                              {isMatch ? (
                                <CheckCircle2 className="match-icon correct" size={14} />
                              ) : (
                                <XCircle className="match-icon wrong" size={14} />
                              )}
                            </>
                          ) : (
                            <span className="team-name text-slate-500">TBD</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="compare-grid-knockouts">
          {knockoutStructure.map((match) => {
            const actual = matchResults[match.id];
            const predictedWinnerId = knockoutPredictions[match.id];
            
            const team1 = getTeamBySlot(match.team1Slot);
            const team2 = getTeamBySlot(match.team2Slot);
            
            const predWinner = getTeamById(predictedWinnerId);
            const actualWinner = actual ? getTeamById(actual.winnerId) : null;
            
            if (!team1 || !team2) return null;

            return (
              <div key={match.id} className="compare-match-row-card">
                <div className="match-row-header">
                  <span>MATCH {match.id} • {match.round.toUpperCase()}</span>
                  {actual && (
                    <span className={`status-pill ${actual.status}`}>
                      {actual.status.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="match-compare-grid-cols">
                  {/* Match Matchup */}
                  <div className="col-matchup">
                    <div className="team-panel">
                      <img src={`https://flagcdn.com/w40/${team1.flag.toLowerCase()}.png`} alt="" className="flag" />
                      <span>{team1.name}</span>
                    </div>
                    <span className="vs">vs</span>
                    <div className="team-panel">
                      <img src={`https://flagcdn.com/w40/${team2.flag.toLowerCase()}.png`} alt="" className="flag" />
                      <span>{team2.name}</span>
                    </div>
                  </div>

                  {/* Your Prediction */}
                  <div className="col-prediction">
                    <span className="lbl">Your Winner Pick</span>
                    {predWinner ? (
                      <div className="winner-display">
                        <img src={`https://flagcdn.com/w40/${predWinner.flag.toLowerCase()}.png`} alt="" className="tiny-flag" />
                        <strong>{predWinner.name}</strong>
                      </div>
                    ) : (
                      <span className="text-slate-500">Undecided</span>
                    )}
                  </div>

                  {/* Actual Result */}
                  <div className="col-actual">
                    <span className="lbl">Actual Result</span>
                    {actual && actual.status === 'completed' ? (
                      <div className="actual-result-wrapper">
                        <div className="winner-display">
                          <img src={`https://flagcdn.com/w40/${actualWinner?.flag.toLowerCase()}.png`} alt="" className="tiny-flag" />
                          <strong>{actualWinner?.name} ({actual.goals1} - {actual.goals2})</strong>
                        </div>
                        {predictedWinnerId === actual.winnerId ? (
                          <span className="match-badge correct">
                            <Check size={10} /> +40 pts
                          </span>
                        ) : (
                          <span className="match-badge wrong">Mismatch</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500">Scheduled</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LiveCompare;
