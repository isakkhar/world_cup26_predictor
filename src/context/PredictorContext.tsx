/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { tournamentData, getTeamColors } from '../data/tournament';
import type { Team } from '../data/tournament';
import { knockoutStructure } from '../data/bracket';

interface PredictorContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  predictions: Record<string, string[]>;
  handleRankTeam: (groupId: string, teamId: string) => void;
  thirdPlaceSelected: string[];
  toggleThirdPlaceTeam: (teamId: string) => void;
  knockoutPredictions: Record<string, string>;
  handleKnockoutWinner: (matchId: string, teamId: string) => void;
  getTeamBySlot: (slot: string) => Team | null;
  getQualifiedTeamsList: () => (Team | null)[];
  resetAll: () => void;
  simulateTournament: (style: 'safe' | 'chaos') => void;
  isSharedMode: boolean;
  sharedUsername: string | null;
  sharedScore: number;
  enterSharedMode: (username: string, selections: {
    predictions: Record<string, string[]>;
    thirdPlaceSelected: string[];
    knockoutPredictions: Record<string, string>;
  }, score: number) => void;
  exitSharedMode: () => void;
}

const PredictorContext = createContext<PredictorContextType | undefined>(undefined);

export const PredictorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return (localStorage.getItem('wc2026_theme') as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [predictions, setPredictions] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem('wc2026_predictions');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Error parsing predictions local storage:', e);
      return {};
    }
  });

  const [thirdPlaceSelected, setThirdPlaceSelected] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wc2026_third_place');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error parsing third place local storage:', e);
      return [];
    }
  });

  const [knockoutPredictions, setKnockoutPredictions] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('wc2026_knockouts');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Error parsing knockouts local storage:', e);
      return {};
    }
  });

  const [isSharedMode, setIsSharedMode] = useState(false);
  const [sharedUsername, setSharedUsername] = useState<string | null>(null);
  const [sharedScore, setSharedScore] = useState(0);
  const [localBackup, setLocalBackup] = useState<{
    predictions: Record<string, string[]>;
    thirdPlace: string[];
    knockouts: Record<string, string>;
  } | null>(null);

  useEffect(() => {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('wc2026_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isSharedMode) return;
    localStorage.setItem('wc2026_predictions', JSON.stringify(predictions));
  }, [predictions, isSharedMode]);

  useEffect(() => {
    if (isSharedMode) return;
    localStorage.setItem('wc2026_third_place', JSON.stringify(thirdPlaceSelected));
  }, [thirdPlaceSelected, isSharedMode]);

  useEffect(() => {
    if (isSharedMode) return;
    localStorage.setItem('wc2026_knockouts', JSON.stringify(knockoutPredictions));
  }, [knockoutPredictions, isSharedMode]);

  const enterSharedMode = (
    username: string,
    selections: {
      predictions: Record<string, string[]>;
      thirdPlaceSelected: string[];
      knockoutPredictions: Record<string, string>;
    },
    score: number
  ) => {
    if (!isSharedMode) {
      setLocalBackup({
        predictions,
        thirdPlace: thirdPlaceSelected,
        knockouts: knockoutPredictions
      });
    }
    setIsSharedMode(true);
    setSharedUsername(username);
    setSharedScore(score);
    setPredictions(selections.predictions || {});
    setThirdPlaceSelected(selections.thirdPlaceSelected || []);
    setKnockoutPredictions(selections.knockoutPredictions || {});
  };

  const exitSharedMode = () => {
    if (localBackup) {
      setPredictions(localBackup.predictions);
      setThirdPlaceSelected(localBackup.thirdPlace);
      setKnockoutPredictions(localBackup.knockouts);
      setLocalBackup(null);
    }
    setIsSharedMode(false);
    setSharedUsername(null);
    setSharedScore(0);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleRankTeam = (groupId: string, teamId: string) => {
    if (isSharedMode) return;
    setPredictions(prev => {
      const currentRanks = prev[groupId] || [];
      if (currentRanks.includes(teamId)) {
        const index = currentRanks.indexOf(teamId);
        return { ...prev, [groupId]: currentRanks.slice(0, index) };
      }
      if (currentRanks.length >= 4) return prev;
      const newRanks = [...currentRanks, teamId];
      const group = tournamentData.find(g => g.id === groupId);
      if (group && newRanks.length === 3) {
        const remainingTeam = group.teams.find(t => !newRanks.includes(t.id));
        if (remainingTeam) newRanks.push(remainingTeam.id);
      }
      return { ...prev, [groupId]: newRanks };
    });
  };

  const toggleThirdPlaceTeam = (teamId: string) => {
    if (isSharedMode) return;
    setThirdPlaceSelected(prev => {
      if (prev.includes(teamId)) return prev.filter(id => id !== teamId);
      if (prev.length < 8) return [...prev, teamId];
      return prev;
    });
    setKnockoutPredictions({});
  };

  const handleKnockoutWinner = (matchId: string, teamId: string) => {
    if (isSharedMode) return;
    setKnockoutPredictions(prev => {
      const currentWinner = prev[matchId];
      const newPredictions = { ...prev };
      if (currentWinner === teamId) delete newPredictions[matchId];
      else newPredictions[matchId] = teamId;
      return clearDependentMatches(matchId, newPredictions);
    });
  };

  const clearDependentMatches = (matchId: string, predictions: Record<string, string>): Record<string, string> => {
    const currentMatch = knockoutStructure.find(m => m.id === matchId);
    if (!currentMatch?.nextMatchId) return predictions;
    const nextMatchId = currentMatch.nextMatchId;
    if (predictions[nextMatchId]) {
      delete predictions[nextMatchId];
      return clearDependentMatches(nextMatchId, predictions);
    }
    return predictions;
  };

  const getTeamBySlot = (slot: string): Team | null => {
    if (/^[A-L][1-3]$/.test(slot)) {
      const groupId = slot[0];
      const rank = parseInt(slot[1]) - 1;
      const teamId = (predictions[groupId] || [])[rank];
      if (!teamId) return null;
      for (const group of tournamentData) {
        const team = group.teams.find(t => t.id === teamId);
        if (team) return team;
      }
    }
    if (/^L\d+$/.test(slot)) {
      const matchId = slot.substring(1);
      const match = knockoutStructure.find(m => m.id === matchId);
      if (!match) return null;
      const winnerId = knockoutPredictions[matchId];
      if (!winnerId) return null;
      const t1 = getTeamBySlot(match.team1Slot);
      const t2 = getTeamBySlot(match.team2Slot);
      if (!t1 || !t2) return null;
      return winnerId === t1.id ? t2 : t1;
    }
    if (/^T[1-8]$/.test(slot)) {
      const index = parseInt(slot.substring(1)) - 1;
      const teamId = thirdPlaceSelected[index];
      if (!teamId) return null;
      for (const group of tournamentData) {
        const team = group.teams.find(t => t.id === teamId);
        if (team) return team;
      }
    }
    if (/^W\d+$/.test(slot)) {
      const matchId = slot.substring(1);
      const winnerId = knockoutPredictions[matchId];
      if (!winnerId) return null;
      for (const group of tournamentData) {
        const team = group.teams.find(t => t.id === winnerId);
        if (team) return team;
      }
    }
    return null;
  };

  useEffect(() => {
    const champion = getTeamBySlot('W104');
    if (champion) {
      const colors = getTeamColors(champion.id);
      document.documentElement.style.setProperty('--primary', colors.primary);
      document.documentElement.style.setProperty('--primary-glow', colors.primaryGlow);
      document.documentElement.style.setProperty('--accent', colors.accent);
    } else {
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--primary-glow');
      document.documentElement.style.removeProperty('--accent');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knockoutPredictions, predictions, thirdPlaceSelected]);

  const getQualifiedTeamsList = () => {
    return thirdPlaceSelected.map(id => {
      for (const group of tournamentData) {
        const team = group.teams.find(t => t.id === id);
        if (team) return team;
      }
      return null;
    }).filter(Boolean);
  };

  const simulateTournament = (style: 'safe' | 'chaos') => {
    const newPredictions: Record<string, string[]> = {};
    const thirdPlaceTeams: Team[] = [];

    tournamentData.forEach(group => {
      let sortedTeams = [...group.teams];
      if (style === 'safe') {
        sortedTeams.sort((a, b) => a.rank - b.rank);
      } else {
        const scoredTeams = sortedTeams.map(t => ({
          team: t,
          score: t.rank * (0.6 + Math.random() * 0.8)
        }));
        scoredTeams.sort((a, b) => a.score - b.score);
        sortedTeams = scoredTeams.map(st => st.team);
      }
      newPredictions[group.id] = sortedTeams.map(t => t.id);
      thirdPlaceTeams.push(sortedTeams[2]);
    });

    const selectedThirdPlace = style === 'safe'
      ? [...thirdPlaceTeams].sort((a, b) => a.rank - b.rank).slice(0, 8)
      : (() => {
          const scoredThird = thirdPlaceTeams.map(t => ({
            team: t,
            score: t.rank * (0.6 + Math.random() * 0.8)
          }));
          scoredThird.sort((a, b) => a.score - b.score);
          return scoredThird.slice(0, 8).map(st => st.team);
        })();

    const newThirdPlaceSelected = selectedThirdPlace.map(t => t.id);
    const newKnockoutPredictions: Record<string, string> = {};

    const getLocalTeamBySlot = (slot: string, localKnockout: Record<string, string>): Team | null => {
      if (/^[A-L][1-3]$/.test(slot)) {
        const groupId = slot[0];
        const rank = parseInt(slot[1]) - 1;
        const teamId = (newPredictions[groupId] || [])[rank];
        if (!teamId) return null;
        for (const g of tournamentData) {
          const team = g.teams.find(t => t.id === teamId);
          if (team) return team;
        }
      }
      if (/^L\d+$/.test(slot)) {
        const matchId = slot.substring(1);
        const match = knockoutStructure.find(m => m.id === matchId);
        if (!match) return null;
        const winnerId = localKnockout[matchId];
        if (!winnerId) return null;
        const t1 = getLocalTeamBySlot(match.team1Slot, localKnockout);
        const t2 = getLocalTeamBySlot(match.team2Slot, localKnockout);
        if (!t1 || !t2) return null;
        return winnerId === t1.id ? t2 : t1;
      }
      if (/^T[1-8]$/.test(slot)) {
        const index = parseInt(slot.substring(1)) - 1;
        const teamId = newThirdPlaceSelected[index];
        if (!teamId) return null;
        for (const g of tournamentData) {
          const team = g.teams.find(t => t.id === teamId);
          if (team) return team;
        }
      }
      if (/^W\d+$/.test(slot)) {
        const matchId = slot.substring(1);
        const winnerId = localKnockout[matchId];
        if (!winnerId) return null;
        for (const g of tournamentData) {
          const team = g.teams.find(t => t.id === winnerId);
          if (team) return team;
        }
      }
      return null;
    };

    knockoutStructure.forEach(match => {
      const t1 = getLocalTeamBySlot(match.team1Slot, newKnockoutPredictions);
      const t2 = getLocalTeamBySlot(match.team2Slot, newKnockoutPredictions);
      if (t1 && t2) {
        let winner: Team;
        if (style === 'safe') {
          winner = t1.rank < t2.rank ? t1 : t2;
        } else {
          const probT1 = t2.rank / (t1.rank + t2.rank);
          winner = Math.random() < probT1 ? t1 : t2;
        }
        newKnockoutPredictions[match.id] = winner.id;
      }
    });

    setPredictions(newPredictions);
    setThirdPlaceSelected(newThirdPlaceSelected);
    setKnockoutPredictions(newKnockoutPredictions);
  };

  const resetAll = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <PredictorContext.Provider value={{
      theme, toggleTheme, predictions, handleRankTeam,
      thirdPlaceSelected, toggleThirdPlaceTeam,
      knockoutPredictions, handleKnockoutWinner,
      getTeamBySlot, getQualifiedTeamsList, resetAll,
      simulateTournament,
      isSharedMode, sharedUsername, sharedScore,
      enterSharedMode, exitSharedMode
    }}>
      {children}
    </PredictorContext.Provider>
  );
};

export const usePredictor = () => {
  const context = useContext(PredictorContext);
  if (!context) throw new Error('usePredictor must be used within a PredictorProvider');
  return context;
};
