export interface BracketMatch {
  id: string;
  round: 'R32' | 'R16' | 'QF' | 'SF' | 'F' | '3RD';
  team1Slot: string;
  team2Slot: string;
  nextMatchId?: string;
  side: 'left' | 'right' | 'center';
}

export const knockoutStructure: BracketMatch[] = [
  // ROUND OF 32 - LEFT
  { id: '74', round: 'R32', team1Slot: 'E1', team2Slot: 'T1', nextMatchId: '89', side: 'left' },
  { id: '77', round: 'R32', team1Slot: 'I1', team2Slot: 'T2', nextMatchId: '89', side: 'left' },
  { id: '73', round: 'R32', team1Slot: 'A2', team2Slot: 'B2', nextMatchId: '90', side: 'left' },
  { id: '75', round: 'R32', team1Slot: 'F1', team2Slot: 'C2', nextMatchId: '90', side: 'left' },
  { id: '83', round: 'R32', team1Slot: 'K2', team2Slot: 'L2', nextMatchId: '93', side: 'left' },
  { id: '84', round: 'R32', team1Slot: 'H1', team2Slot: 'J2', nextMatchId: '93', side: 'left' },
  { id: '81', round: 'R32', team1Slot: 'D1', team2Slot: 'T5', nextMatchId: '94', side: 'left' },
  { id: '82', round: 'R32', team1Slot: 'G1', team2Slot: 'T6', nextMatchId: '94', side: 'left' },

  // ROUND OF 32 - RIGHT
  { id: '76', round: 'R32', team1Slot: 'C1', team2Slot: 'F2', nextMatchId: '91', side: 'right' },
  { id: '78', round: 'R32', team1Slot: 'E2', team2Slot: 'I2', nextMatchId: '91', side: 'right' },
  { id: '79', round: 'R32', team1Slot: 'A1', team2Slot: 'T3', nextMatchId: '92', side: 'right' },
  { id: '80', round: 'R32', team1Slot: 'L1', team2Slot: 'T4', nextMatchId: '92', side: 'right' },
  { id: '86', round: 'R32', team1Slot: 'J1', team2Slot: 'H2', nextMatchId: '95', side: 'right' },
  { id: '88', round: 'R32', team1Slot: 'D2', team2Slot: 'G2', nextMatchId: '95', side: 'right' },
  { id: '85', round: 'R32', team1Slot: 'B1', team2Slot: 'T7', nextMatchId: '96', side: 'right' },
  { id: '87', round: 'R32', team1Slot: 'K1', team2Slot: 'T8', nextMatchId: '96', side: 'right' },

  // ROUND OF 16 - LEFT
  { id: '89', round: 'R16', team1Slot: 'W74', team2Slot: 'W77', nextMatchId: '97', side: 'left' },
  { id: '90', round: 'R16', team1Slot: 'W73', team2Slot: 'W75', nextMatchId: '97', side: 'left' },
  { id: '93', round: 'R16', team1Slot: 'W83', team2Slot: 'W84', nextMatchId: '98', side: 'left' },
  { id: '94', round: 'R16', team1Slot: 'W81', team2Slot: 'W82', nextMatchId: '98', side: 'left' },

  // ROUND OF 16 - RIGHT
  { id: '91', round: 'R16', team1Slot: 'W76', team2Slot: 'W78', nextMatchId: '99', side: 'right' },
  { id: '92', round: 'R16', team1Slot: 'W79', team2Slot: 'W80', nextMatchId: '99', side: 'right' },
  { id: '95', round: 'R16', team1Slot: 'W86', team2Slot: 'W88', nextMatchId: '100', side: 'right' },
  { id: '96', round: 'R16', team1Slot: 'W85', team2Slot: 'W87', nextMatchId: '100', side: 'right' },

  // QUARTER-FINALS - LEFT
  { id: '97', round: 'QF', team1Slot: 'W89', team2Slot: 'W90', nextMatchId: '101', side: 'left' },
  { id: '98', round: 'QF', team1Slot: 'W93', team2Slot: 'W94', nextMatchId: '101', side: 'left' },

  // QUARTER-FINALS - RIGHT
  { id: '99', round: 'QF', team1Slot: 'W91', team2Slot: 'W92', nextMatchId: '102', side: 'right' },
  { id: '100', round: 'QF', team1Slot: 'W95', team2Slot: 'W96', nextMatchId: '102', side: 'right' },

  // SEMI-FINALS
  { id: '101', round: 'SF', team1Slot: 'W97', team2Slot: 'W98', nextMatchId: '104', side: 'left' },
  { id: '102', round: 'SF', team1Slot: 'W99', team2Slot: 'W100', nextMatchId: '104', side: 'right' },

  // Final & 3rd Place
  { id: '103', round: '3RD', team1Slot: 'L101', team2Slot: 'L102', side: 'center' },
  { id: '104', round: 'F', team1Slot: 'W101', team2Slot: 'W102', side: 'center' },
];
