// 🏆 2026 FIFA World Cup Actual Results (Fallback/Offline Dataset)
// This data represents the official standings and scores for comparison.

export interface ActualMatchEvent {
  teamId: string;
  playerName: string;
  minute: number;
  type: 'goal' | 'penalty' | 'owngoal';
}

export interface ActualMatch {
  matchId: string;
  team1Id: string;
  team2Id: string;
  goals1: number;
  goals2: number;
  winnerId: string;
  advanceMethod: 'regular' | 'et' | 'pk';
  events: ActualMatchEvent[];
  yellowCards: number;
  redCards: boolean;
  penalties: boolean;
  status: 'scheduled' | 'live' | 'completed';
}

export const actualGroupStandings: Record<string, string[]> = {
  A: ['mex', 'rsa', 'cze', 'kor'],
  B: ['sui', 'can', 'bih', 'qat'],
  C: ['bra', 'mar', 'hai', 'sco'],
  D: ['usa', 'tur', 'par', 'aus'],
  E: ['ger', 'cuw', 'ecu', 'civ'],
  F: ['ned', 'jpn', 'swe', 'tun'],
  G: ['bel', 'egy', 'irn', 'nzl'],
  H: ['esp', 'cpv', 'uru', 'ksa'],
  I: ['fra', 'nor', 'sen', 'irq'],
  J: ['arg', 'jor', 'alg', 'zzz'], // fallback team
  K: ['por', 'col', 'cod', 'uzb'],
  L: ['eng', 'cro', 'gha', 'pan']
};

export const actualThirdPlaceSelected = [
  'bih', // Group B
  'par', // Group D
  'ecu', // Group E
  'swe', // Group F
  'sen', // Group I
  'alg', // Group J
  'cod', // Group K
  'gha'  // Group L
];

export const actualMatchResults: Record<string, ActualMatch> = {
  // Round of 32 (Matches 73 - 88)
  '73': {
    matchId: '73',
    team1Id: 'can', // B2
    team2Id: 'rsa', // A2
    goals1: 2,
    goals2: 1,
    winnerId: 'can',
    advanceMethod: 'regular',
    status: 'completed',
    yellowCards: 3,
    redCards: false,
    penalties: false,
    events: [
      { teamId: 'can', playerName: 'Jonathan David', minute: 14, type: 'goal' },
      { teamId: 'rsa', playerName: 'Percy Tau', minute: 48, type: 'goal' },
      { teamId: 'can', playerName: 'Cyle Larin', minute: 82, type: 'goal' }
    ]
  },
  '74': {
    matchId: '74',
    team1Id: 'ger', // E1
    team2Id: 'par', // T1 (Group D third place)
    goals1: 3,
    goals2: 1,
    winnerId: 'ger',
    advanceMethod: 'regular',
    status: 'completed',
    yellowCards: 2,
    redCards: false,
    penalties: false,
    events: [
      { teamId: 'ger', playerName: 'Jamal Musiala', minute: 23, type: 'goal' },
      { teamId: 'ger', playerName: 'Kai Havertz', minute: 56, type: 'goal' },
      { teamId: 'par', playerName: 'Julio Enciso', minute: 71, type: 'goal' },
      { teamId: 'ger', playerName: 'Florian Wirtz', minute: 89, type: 'goal' }
    ]
  },
  '75': {
    matchId: '75',
    team1Id: 'fra', // I1
    team2Id: 'swe', // T2 (Group F third place)
    goals1: 2,
    goals2: 0,
    winnerId: 'fra',
    advanceMethod: 'regular',
    status: 'completed',
    yellowCards: 1,
    redCards: false,
    penalties: false,
    events: [
      { teamId: 'fra', playerName: 'Kylian Mbappé', minute: 34, type: 'goal' },
      { teamId: 'fra', playerName: 'Antoine Griezmann', minute: 78, type: 'goal' }
    ]
  },
  '76': {
    matchId: '76',
    team1Id: 'bra', // C1
    team2Id: 'jpn', // F2
    goals1: 2,
    goals2: 2,
    winnerId: 'bra',
    advanceMethod: 'pk',
    status: 'completed',
    yellowCards: 5,
    redCards: true,
    penalties: true,
    events: [
      { teamId: 'bra', playerName: 'Vinícius Júnior', minute: 12, type: 'goal' },
      { teamId: 'jpn', playerName: 'Kaoru Mitoma', minute: 45, type: 'goal' },
      { teamId: 'bra', playerName: 'Rodrygo', minute: 61, type: 'penalty' },
      { teamId: 'jpn', playerName: 'Takefusa Kubo', minute: 88, type: 'goal' }
    ]
  }
};
