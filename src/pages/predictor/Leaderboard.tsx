import React, { useEffect, useState } from 'react';
import { Trophy, Medal, HelpCircle, Star, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './Predictor.css';

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  created_at?: string;
  isCurrentUser?: boolean;
}

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showPointsGuide, setShowPointsGuide] = useState(false);

  // Get current user's submitted bracket ID if they have one
  const submittedId = localStorage.getItem('wc2026_submitted_id');

  const fetchLeaderboard = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // 1. Fetch real submissions from Supabase
      const { data, error } = await supabase
        .from('predictions')
        .select('id, username, score, created_at')
        .order('score', { ascending: false })
        .limit(20);

      if (error) throw error;

      // 2. High-fidelity global legends to seed the leaderboard initially
      const mockLegends: LeaderboardEntry[] = [
        { id: 'legend-1', username: 'MbappeSpeedster 🇫🇷', score: 440 },
        { id: 'legend-2', username: 'SambaKing99 🇧🇷', score: 415 },
        { id: 'legend-3', username: 'AlbicelesteFan 🇦🇷', score: 390 },
        { id: 'legend-4', username: 'EuroTactician 🇩🇪', score: 365 },
        { id: 'legend-5', username: 'ThreeLionsBeliever 🇬🇧', score: 320 },
        { id: 'legend-6', username: 'RonaldoLegacy 🇵🇹', score: 295 },
        { id: 'legend-7', username: 'FuriaRoja 🇪🇸', score: 270 },
        { id: 'legend-8', username: 'AzzurriHope 🇮🇹', score: 245 },
      ];

      // 3. Map fetched entries and mark current user's entry
      const fetchedEntries: LeaderboardEntry[] = (data || []).map(item => ({
        id: item.id,
        username: `${item.username} 🏆`,
        score: item.score,
        created_at: item.created_at,
        isCurrentUser: item.id === submittedId
      }));

      // If user's submission is not in the top 20, we will fetch it separately and append it
      if (submittedId && !fetchedEntries.some(e => e.id === submittedId)) {
        const { data: userEntry } = await supabase
          .from('predictions')
          .select('id, username, score, created_at')
          .eq('id', submittedId)
          .single();
        
        if (userEntry) {
          fetchedEntries.push({
            id: userEntry.id,
            username: `${userEntry.username} (You) ⭐`,
            score: userEntry.score,
            created_at: userEntry.created_at,
            isCurrentUser: true
          });
        }
      }

      // 4. Merge real database entries with mock global legends
      const merged = [...fetchedEntries, ...mockLegends];

      // Remove potential duplicates by ID and sort by score descending
      const uniqueEntries = Array.from(new Map(merged.map(item => [item.username.toLowerCase(), item])).values());
      uniqueEntries.sort((a, b) => b.score - a.score);

      setEntries(uniqueEntries);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Split out podium members (top 3) and remaining rows
  const podium = entries.slice(0, 3);
  const listEntries = entries.slice(3);

  // Find user's rank
  const userRankIndex = entries.findIndex(e => e.id === submittedId || e.isCurrentUser);
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : null;
  const userScore = userRankIndex !== -1 ? entries[userRankIndex].score : null;

  return (
    <div className="leaderboard-view-container">
      {/* Header Title */}
      <div className="trends-header">
        <Trophy size={40} className="trends-globe-icon text-amber-500 animate-pulse" />
        <h2>Global Leaderboard</h2>
        <p className="trends-subtitle">See who holds the most accurate prediction bracket worldwide</p>
      </div>

      {/* User Stats Overview Row */}
      {submittedId && userRank && (
        <div className="user-stats-banner">
          <div className="banner-glow-effects"></div>
          <div className="user-stats-content">
            <div className="stat-box">
              <span className="stat-label">Your Rank</span>
              <span className="stat-value text-amber-400">#{userRank}</span>
            </div>
            <div className="divider"></div>
            <div className="stat-box">
              <span className="stat-label">Prediction Score</span>
              <span className="stat-value text-blue-400">{userScore} pts</span>
            </div>
            <div className="divider"></div>
            <div className="stat-box">
              <span className="stat-label">Accuracy Rank</span>
              <span className="stat-value text-emerald-400">
                {Math.max(1, Math.round(((entries.length - userRank) / entries.length) * 100))}% Top
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Sub-Actions */}
      <div className="leaderboard-actions-row">
        <button 
          className="points-guide-toggle-btn"
          onClick={() => setShowPointsGuide(!showPointsGuide)}
        >
          <HelpCircle size={18} />
          {showPointsGuide ? 'Hide Scoring Guide' : 'How Points Work?'}
        </button>

        <button 
          className="leaderboard-refresh-btn"
          onClick={() => fetchLeaderboard(true)}
          disabled={refreshing || loading}
        >
          <RefreshCw size={18} className={refreshing ? 'spinning' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Ranks'}
        </button>
      </div>

      {/* Accordion Scoring Explanation */}
      {showPointsGuide && (
        <div className="points-guide-accordion card-glowing-border">
          <h3>🏆 Predictor Point Scoring System</h3>
          <p className="intro-para">Points are rewarded automatically based on the accuracy of your predictions:</p>
          <div className="rules-grid">
            <div className="rule-card">
              <span className="rule-score">+10 pts</span>
              <h4>Group Predictions</h4>
              <p>For each team placed in their correct qualifying slot in the group stage</p>
            </div>
            <div className="rule-card">
              <span className="rule-score">+20 pts</span>
              <h4>Round of 32 & 16</h4>
              <p>For each correct knockout team predicted to advance into the next round</p>
            </div>
            <div className="rule-card">
              <span className="rule-score">+40 pts</span>
              <h4>Quarter Finals</h4>
              <p>For each correct quarter-finalist successfully predicted to advance</p>
            </div>
            <div className="rule-card">
              <span className="rule-score">+80 pts</span>
              <h4>Semi Finals & Final</h4>
              <p>For each correct semi-finalist and grand finalist predicted</p>
            </div>
            <div className="rule-card gold">
              <span className="rule-score">+150 pts</span>
              <h4>Crowned Champion</h4>
              <p>Ultimate bonus for successfully predicting the 2026 World Cup Champion!</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="leaderboard-loading-view">
          <Loader2 className="spinning-loader" size={40} />
          <p>Compiling global scores and rankings...</p>
        </div>
      ) : (
        <div className="leaderboard-content-wrapper">
          {/* 🥈 Podium Layout 🥇 */}
          {podium.length > 0 && (
            <div className="podium-section">
              {/* Second Place (Podium Left) */}
              {podium[1] && (
                <div className="podium-step step-2">
                  <div className="podium-avatar silver">
                    <Medal size={24} className="silver-medal" />
                    <span className="rank-badge silver">2</span>
                  </div>
                  <h4 className="podium-name">{podium[1].username}</h4>
                  <span className="podium-score">{podium[1].score} pts</span>
                  <div className="step-block silver-block">🥈 Silver</div>
                </div>
              )}

              {/* First Place (Podium Center) */}
              {podium[0] && (
                <div className="podium-step step-1">
                  <div className="podium-avatar gold animate-bounce">
                    <Trophy size={32} className="gold-medal" />
                    <span className="rank-badge gold">1</span>
                  </div>
                  <h4 className="podium-name">{podium[0].username}</h4>
                  <span className="podium-score">{podium[0].score} pts</span>
                  <div className="step-block gold-block">👑 Champion</div>
                </div>
              )}

              {/* Third Place (Podium Right) */}
              {podium[2] && (
                <div className="podium-step step-3">
                  <div className="podium-avatar bronze">
                    <Medal size={20} className="bronze-medal" />
                    <span className="rank-badge bronze">3</span>
                  </div>
                  <h4 className="podium-name">{podium[2].username}</h4>
                  <span className="podium-score">{podium[2].score} pts</span>
                  <div className="step-block bronze-block">🥉 Bronze</div>
                </div>
              )}
            </div>
          )}

          {/* Ranks Table List */}
          <div className="leaderboard-table-card card-glowing-border">
            <div className="leaderboard-table-header">
              <span className="col-rank">Rank</span>
              <span className="col-user">Contestant</span>
              <span className="col-score">Points</span>
            </div>
            
            <div className="leaderboard-table-rows">
              {listEntries.map((entry, index) => {
                const rank = index + 4;
                const isUser = entry.id === submittedId || entry.isCurrentUser;
                
                return (
                  <div 
                    key={entry.id} 
                    className={`leaderboard-row ${isUser ? 'highlight-user-row' : ''}`}
                  >
                    <span className="col-rank">
                      {rank === 4 ? <Star size={14} className="star-four-icon" /> : `#${rank}`}
                    </span>
                    <span className="col-user">
                      {entry.username}
                      {isUser && <span className="current-user-tag">You</span>}
                    </span>
                    <span className="col-score font-semibold">{entry.score} pts</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
