import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { tournamentData } from '../data/tournament';
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
}

const PredictorContext = createContext<PredictorContextType | undefined>(undefined);

export const PredictorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('wc2026_theme') as 'dark' | 'light') || 'dark';
  });

  const [predictions, setPredictions] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('wc2026_predictions');
    return saved ? JSON.parse(saved) : {};
  });

  const [thirdPlaceSelected, setThirdPlaceSelected] = useState<string[]>(() => {
    const saved = localStorage.getItem('wc2026_third_place');
    return saved ? JSON.parse(saved) : [];
  });

  const [knockoutPredictions, setKnockoutPredictions] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('wc2026_knockouts');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('wc2026_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('wc2026_predictions', JSON.stringify(predictions));
  }, [predictions]);

  useEffect(() => {
    localStorage.setItem('wc2026_third_place', JSON.stringify(thirdPlaceSelected));
  }, [thirdPlaceSelected]);

  useEffect(() => {
    localStorage.setItem('wc2026_knockouts', JSON.stringify(knockoutPredictions));
  }, [knockoutPredictions]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleRankTeam = (groupId: string, teamId: string) => {
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
    setThirdPlaceSelected(prev => {
      if (prev.includes(teamId)) return prev.filter(id => id !== teamId);
      if (prev.length < 8) return [...prev, teamId];
      return prev;
    });
    setKnockoutPredictions({});
  };

  const handleKnockoutWinner = (matchId: string, teamId: string) => {
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

  const getQualifiedTeamsList = () => {
    return thirdPlaceSelected.map(id => {
      for (const group of tournamentData) {
        const team = group.teams.find(t => t.id === id);
        if (team) return team;
      }
      return null;
    }).filter(Boolean);
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
      getTeamBySlot, getQualifiedTeamsList, resetAll
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
