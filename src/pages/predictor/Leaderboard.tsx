import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Trophy, Medal, HelpCircle, Star, Loader2, RefreshCw, Crown, Flame, TrendingUp, Users, Zap, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { usePredictor } from '../../context/PredictorContext';
import { useNavigate } from 'react-router-dom';
import './Predictor.css';

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  created_at?: string;
  isCurrentUser?: boolean;
  champion?: string;
  timeSince?: string;
}

// Pure helper function declared outside component to prevent render impurity flags
const getTimeSince = (dateStr?: string): string => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showPointsGuide, setShowPointsGuide] = useState(false);
  const [totalPredictors, setTotalPredictors] = useState(0);
  const [animatedCount, setAnimatedCount] = useState(0);
  const navigate = useNavigate();
  const { enterSharedMode } = usePredictor();

  const submittedId = localStorage.getItem('wc2026_submitted_id');

  const fetchLeaderboard = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('id, username, score, created_at, selections')
        .order('score', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Seed data for a populated feel
      const mockLegends: LeaderboardEntry[] = [
        { id: 'legend-1', username: 'MbappeSpeedster', score: 440, champion: '🇫🇷 France', timeSince: '2h ago' },
        { id: 'legend-2', username: 'SambaKing99', score: 415, champion: '🇧🇷 Brazil', timeSince: '4h ago' },
        { id: 'legend-3', username: 'AlbicelesteFan', score: 390, champion: '🇦🇷 Argentina', timeSince: '6h ago' },
        { id: 'legend-4', username: 'EuroTactician', score: 365, champion: '🇩🇪 Germany', timeSince: '8h ago' },
        { id: 'legend-5', username: 'ThreeLionsBeliever', score: 320, champion: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England', timeSince: '12h ago' },
        { id: 'legend-6', username: 'RonaldoLegacy', score: 295, champion: '🇵🇹 Portugal', timeSince: '1d ago' },
        { id: 'legend-7', username: 'FuriaRoja', score: 270, champion: '🇪🇸 Spain', timeSince: '1d ago' },
        { id: 'legend-8', username: 'AzzurriHope', score: 245, champion: '🇮🇹 Italy', timeSince: '2d ago' },
        { id: 'legend-9', username: 'OrangeArmy', score: 230, champion: '🇳🇱 Netherlands', timeSince: '2d ago' },
        { id: 'legend-10', username: 'SocceroosFan', score: 210, champion: '🇦🇺 Australia', timeSince: '3d ago' },
      ];

      const fetchedEntries: LeaderboardEntry[] = (data || []).map(item => ({
        id: item.id,
        username: item.username,
        score: item.score,
        created_at: item.created_at,
        timeSince: getTimeSince(item.created_at),
        isCurrentUser: item.id === submittedId
      }));

      if (submittedId && !fetchedEntries.some(e => e.id === submittedId)) {
        const { data: userEntry } = await supabase
          .from('predictions')
          .select('id, username, score, created_at')
          .eq('id', submittedId)
          .single();

        if (userEntry) {
          fetchedEntries.push({
            id: userEntry.id,
            username: userEntry.username,
            score: userEntry.score,
            created_at: userEntry.created_at,
            timeSince: getTimeSince(userEntry.created_at),
            isCurrentUser: true
          });
        }
      }

      const merged = [...fetchedEntries, ...mockLegends];
      const uniqueEntries = Array.from(new Map(merged.map(item => [item.username.toLowerCase(), item])).values());
      uniqueEntries.sort((a, b) => b.score - a.score);

      setEntries(uniqueEntries);
      setTotalPredictors(1247 + fetchedEntries.length);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [submittedId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Animate the total count on load
  useEffect(() => {
    if (totalPredictors === 0) return;
    let current = 0;
    const target = totalPredictors;
    const step = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setAnimatedCount(current);
    }, 30);
    return () => clearInterval(timer);
  }, [totalPredictors]);

  const podium = entries.slice(0, 3);
  const listEntries = entries.slice(3);

  const userRankIndex = entries.findIndex(e => e.id === submittedId || e.isCurrentUser);
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : null;
  const userScore = userRankIndex !== -1 ? entries[userRankIndex].score : null;

  const avgScore = useMemo(() => {
    if (entries.length === 0) return 0;
    return Math.round(entries.reduce((s, e) => s + e.score, 0) / entries.length);
  }, [entries]);

  const handleViewBracket = async (entry: LeaderboardEntry) => {
    if (entry.id.startsWith('legend-')) return; // Mock entries

    try {
      const { data } = await supabase
        .from('predictions')
        .select('*')
        .eq('id', entry.id)
        .single();

      if (data) {
        enterSharedMode(data.username, data.selections, data.score);
        navigate('/predict/recap');
      }
    } catch (err) {
      console.error('Error viewing bracket:', err);
    }
  };

  return (
    <div className="leaderboard-view-container">

      {/* Hero Section */}
      <div className="lb-hero">
        <div className="lb-hero-bg-effects">
          <div className="lb-hero-orb lb-hero-orb-1"></div>
          <div className="lb-hero-orb lb-hero-orb-2"></div>
          <div className="lb-hero-orb lb-hero-orb-3"></div>
        </div>
        <div className="lb-hero-content">
          <div className="lb-hero-icon-wrap">
            <Trophy size={48} className="lb-hero-trophy" />
          </div>
          <h2 className="lb-hero-title">Global Leaderboard</h2>
          <p className="lb-hero-subtitle">Compete with predictors worldwide. Who will be crowned the ultimate forecaster?</p>
        </div>
      </div>

      {/* Live Stats Bar */}
      <div className="lb-stats-bar">
        <div className="lb-stat-chip">
          <Users size={16} />
          <span className="lb-stat-number">{animatedCount.toLocaleString()}</span>
          <span className="lb-stat-label">Predictors</span>
        </div>
        <div className="lb-stat-chip">
          <TrendingUp size={16} />
          <span className="lb-stat-number">{avgScore}</span>
          <span className="lb-stat-label">Avg Score</span>
        </div>
        <div className="lb-stat-chip">
          <Flame size={16} />
          <span className="lb-stat-number">{entries.length > 0 ? entries[0].score : 0}</span>
          <span className="lb-stat-label">Top Score</span>
        </div>
        <div className="lb-stat-chip accent">
          <Zap size={16} />
          <span className="lb-stat-number">LIVE</span>
          <span className="lb-stat-label">Updates</span>
        </div>
      </div>

      {/* User Personal Stats (if submitted) */}
      {submittedId && userRank && (
        <div className="lb-user-card">
          <div className="lb-user-card-glow"></div>
          <div className="lb-user-card-content">
            <div className="lb-user-stat">
              <Crown size={20} className="lb-user-stat-icon gold" />
              <div>
                <span className="lb-user-stat-label">Your Global Rank</span>
                <span className="lb-user-stat-value lb-gold">#{userRank}</span>
              </div>
            </div>
            <div className="lb-user-divider"></div>
            <div className="lb-user-stat">
              <Star size={20} className="lb-user-stat-icon blue" />
              <div>
                <span className="lb-user-stat-label">Your Score</span>
                <span className="lb-user-stat-value lb-blue">{userScore} pts</span>
              </div>
            </div>
            <div className="lb-user-divider"></div>
            <div className="lb-user-stat">
              <TrendingUp size={20} className="lb-user-stat-icon green" />
              <div>
                <span className="lb-user-stat-label">Percentile</span>
                <span className="lb-user-stat-value lb-green">
                  Top {Math.max(1, Math.round(((entries.length - userRank) / entries.length) * 100))}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="lb-actions-row">
        <button className="lb-guide-btn" onClick={() => setShowPointsGuide(!showPointsGuide)}>
          <HelpCircle size={16} />
          {showPointsGuide ? 'Hide Guide' : 'Scoring Guide'}
          {showPointsGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <button className="lb-refresh-btn" onClick={() => fetchLeaderboard(true)} disabled={refreshing || loading}>
          <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
          {refreshing ? 'Syncing...' : 'Refresh'}
        </button>
      </div>

      {/* Points Guide Accordion */}
      {showPointsGuide && (
        <div className="lb-scoring-guide">
          <h3 className="lb-scoring-title">🏆 Prediction Scoring System</h3>
          <p className="lb-scoring-desc">Points are rewarded based on prediction accuracy at each tournament stage:</p>
          <div className="lb-scoring-grid">
            {[
              { pts: '+10', stage: 'Group Stage', desc: 'Correct team in qualifying position', color: 'var(--primary)' },
              { pts: '+20', stage: 'Round of 32/16', desc: 'Correct knockout advancement', color: '#3b82f6' },
              { pts: '+40', stage: 'Quarter Finals', desc: 'Correct quarter-finalist', color: '#8b5cf6' },
              { pts: '+80', stage: 'Semi & Final', desc: 'Correct semi/grand finalist', color: '#f59e0b' },
              { pts: '+150', stage: 'Champion', desc: 'Predict the World Cup winner', color: '#ef4444' },
            ].map((rule) => (
              <div className="lb-scoring-item" key={rule.stage}>
                <span className="lb-scoring-pts" style={{ color: rule.color }}>{rule.pts}</span>
                <div className="lb-scoring-info">
                  <strong>{rule.stage}</strong>
                  <span>{rule.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="lb-loading">
          <Loader2 className="spinning-loader" size={44} />
          <p>Compiling global rankings...</p>
        </div>
      ) : (
        <>
          {/* === PODIUM === */}
          {podium.length > 0 && (
            <div className="lb-podium">
              {/* 2nd place */}
              {podium[1] && (
                <div className="lb-podium-item lb-podium-2">
                  <div className="lb-podium-badge silver">
                    <Medal size={28} />
                    <span className="lb-podium-rank">2</span>
                  </div>
                  <h4 className="lb-podium-name">{podium[1].username}</h4>
                  <span className="lb-podium-pts">{podium[1].score} pts</span>
                  {podium[1].champion && <span className="lb-podium-pick">{podium[1].champion}</span>}
                  <div className="lb-podium-bar silver-bar">
                    <span>🥈</span>
                  </div>
                </div>
              )}
              {/* 1st place */}
              {podium[0] && (
                <div className="lb-podium-item lb-podium-1">
                  <div className="lb-crown-wrap">
                    <Crown size={28} className="lb-crown-icon" />
                  </div>
                  <div className="lb-podium-badge gold">
                    <Trophy size={32} />
                    <span className="lb-podium-rank">1</span>
                  </div>
                  <h4 className="lb-podium-name">{podium[0].username}</h4>
                  <span className="lb-podium-pts">{podium[0].score} pts</span>
                  {podium[0].champion && <span className="lb-podium-pick">{podium[0].champion}</span>}
                  <div className="lb-podium-bar gold-bar">
                    <span>👑</span>
                  </div>
                </div>
              )}
              {/* 3rd place */}
              {podium[2] && (
                <div className="lb-podium-item lb-podium-3">
                  <div className="lb-podium-badge bronze">
                    <Medal size={22} />
                    <span className="lb-podium-rank">3</span>
                  </div>
                  <h4 className="lb-podium-name">{podium[2].username}</h4>
                  <span className="lb-podium-pts">{podium[2].score} pts</span>
                  {podium[2].champion && <span className="lb-podium-pick">{podium[2].champion}</span>}
                  <div className="lb-podium-bar bronze-bar">
                    <span>🥉</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === TABLE === */}
          <div className="lb-table-wrap">
            <div className="lb-table-header">
              <span className="lb-col-rank">#</span>
              <span className="lb-col-name">Predictor</span>
              <span className="lb-col-pts">Score</span>
              <span className="lb-col-time">Submitted</span>
              <span className="lb-col-action"></span>
            </div>
            <div className="lb-table-body">
              {listEntries.map((entry, index) => {
                const rank = index + 4;
                const isUser = entry.id === submittedId || entry.isCurrentUser;
                const isLegend = entry.id.startsWith('legend-');

                return (
                  <div key={entry.id} className={`lb-table-row ${isUser ? 'lb-row-me' : ''}`}>
                    <span className="lb-col-rank">
                      {rank === 4 ? <Star size={14} className="lb-star-icon" /> : rank}
                    </span>
                    <span className="lb-col-name">
                      <span className="lb-name-text">{entry.username}</span>
                      {isUser && <span className="lb-me-tag">YOU</span>}
                      {entry.champion && <span className="lb-champ-tag">{entry.champion}</span>}
                    </span>
                    <span className="lb-col-pts">
                      <span className="lb-pts-value">{entry.score}</span>
                      <span className="lb-pts-unit">pts</span>
                    </span>
                    <span className="lb-col-time">{entry.timeSince || ''}</span>
                    <span className="lb-col-action">
                      {!isLegend && (
                        <button className="lb-view-btn" onClick={() => handleViewBracket(entry)} title="View this bracket">
                          <Eye size={14} />
                        </button>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
