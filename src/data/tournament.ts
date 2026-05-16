export interface Team {
  id: string;
  name: string;
  code: string;
  rank: number;
  flag: string;
}

export interface Group {
  id: string;
  name: string;
  teams: Team[];
}

export const tournamentData: Group[] = [
  {
    id: 'A',
    name: 'Group A',
    teams: [
      { id: 'mex', name: 'Mexico', code: 'MX', rank: 15, flag: 'mx' },
      { id: 'rsa', name: 'South Africa', code: 'ZA', rank: 60, flag: 'za' },
      { id: 'kor', name: 'South Korea', code: 'KR', rank: 25, flag: 'kr' },
      { id: 'cze', name: 'Czech Republic', code: 'CZ', rank: 41, flag: 'cz' },
    ],
  },
  {
    id: 'B',
    name: 'Group B',
    teams: [
      { id: 'can', name: 'Canada', code: 'CA', rank: 30, flag: 'ca' },
      { id: 'sui', name: 'Switzerland', code: 'CH', rank: 19, flag: 'ch' },
      { id: 'qat', name: 'Qatar', code: 'QA', rank: 55, flag: 'qa' },
      { id: 'bih', name: 'Bosnia & Herz.', code: 'BA', rank: 65, flag: 'ba' },
    ],
  },
  {
    id: 'C',
    name: 'Group C',
    teams: [
      { id: 'bra', name: 'Brazil', code: 'BR', rank: 6, flag: 'br' },
      { id: 'mar', name: 'Morocco', code: 'MA', rank: 8, flag: 'ma' },
      { id: 'hai', name: 'Haiti', code: 'HT', rank: 83, flag: 'ht' },
      { id: 'sco', name: 'Scotland', code: 'GB-SCT', rank: 43, flag: 'gb-sct' },
    ],
  },
  {
    id: 'D',
    name: 'Group D',
    teams: [
      { id: 'usa', name: 'United States', code: 'US', rank: 16, flag: 'us' },
      { id: 'par', name: 'Paraguay', code: 'PY', rank: 40, flag: 'py' },
      { id: 'aus', name: 'Australia', code: 'AU', rank: 27, flag: 'au' },
      { id: 'tur', name: 'Turkey', code: 'TR', rank: 22, flag: 'tr' },
    ],
  },
  {
    id: 'E',
    name: 'Group E',
    teams: [
      { id: 'ger', name: 'Germany', code: 'DE', rank: 10, flag: 'de' },
      { id: 'cuw', name: 'Curaçao', code: 'CW', rank: 82, flag: 'cw' },
      { id: 'civ', name: 'Ivory Coast', code: 'CI', rank: 34, flag: 'ci' },
      { id: 'ecu', name: 'Ecuador', code: 'EC', rank: 23, flag: 'ec' },
    ],
  },
  {
    id: 'F',
    name: 'Group F',
    teams: [
      { id: 'ned', name: 'Netherlands', code: 'NL', rank: 7, flag: 'nl' },
      { id: 'jpn', name: 'Japan', code: 'JP', rank: 18, flag: 'jp' },
      { id: 'tun', name: 'Tunisia', code: 'TN', rank: 44, flag: 'tn' },
      { id: 'swe', name: 'Sweden', code: 'SE', rank: 38, flag: 'se' },
    ],
  },
  {
    id: 'G',
    name: 'Group G',
    teams: [
      { id: 'bel', name: 'Belgium', code: 'BE', rank: 9, flag: 'be' },
      { id: 'egy', name: 'Egypt', code: 'EG', rank: 29, flag: 'eg' },
      { id: 'irn', name: 'Iran', code: 'IR', rank: 21, flag: 'ir' },
      { id: 'nzl', name: 'New Zealand', code: 'NZ', rank: 85, flag: 'nz' },
    ],
  },
  {
    id: 'H',
    name: 'Group H',
    teams: [
      { id: 'esp', name: 'Spain', code: 'ES', rank: 2, flag: 'es' },
      { id: 'cpv', name: 'Cape Verde', code: 'CV', rank: 69, flag: 'cv' },
      { id: 'ksa', name: 'Saudi Arabia', code: 'SA', rank: 61, flag: 'sa' },
      { id: 'uru', name: 'Uruguay', code: 'UY', rank: 17, flag: 'uy' },
    ],
  },
  {
    id: 'I',
    name: 'Group I',
    teams: [
      { id: 'fra', name: 'France', code: 'FR', rank: 1, flag: 'fr' },
      { id: 'sen', name: 'Senegal', code: 'SN', rank: 14, flag: 'sn' },
      { id: 'nor', name: 'Norway', code: 'NO', rank: 31, flag: 'no' },
      { id: 'irq', name: 'Iraq', code: 'IQ', rank: 57, flag: 'iq' },
    ],
  },
  {
    id: 'J',
    name: 'Group J',
    teams: [
      { id: 'arg', name: 'Argentina', code: 'AR', rank: 3, flag: 'ar' },
      { id: 'alg', name: 'Algeria', code: 'DZ', rank: 28, flag: 'dz' },
      { id: 'aut', name: 'Austria', code: 'AT', rank: 24, flag: 'at' },
      { id: 'jor', name: 'Jordan', code: 'JO', rank: 63, flag: 'jo' },
    ],
  },
  {
    id: 'K',
    name: 'Group K',
    teams: [
      { id: 'por', name: 'Portugal', code: 'PT', rank: 5, flag: 'pt' },
      { id: 'uzb', name: 'Uzbekistan', code: 'UZ', rank: 50, flag: 'uz' },
      { id: 'col', name: 'Colombia', code: 'CO', rank: 13, flag: 'co' },
      { id: 'cod', name: 'DR Congo', code: 'CD', rank: 46, flag: 'cd' },
    ],
  },
  {
    id: 'L',
    name: 'Group L',
    teams: [
      { id: 'eng', name: 'England', code: 'GB-ENG', rank: 4, flag: 'gb-eng' },
      { id: 'cro', name: 'Croatia', code: 'HR', rank: 11, flag: 'hr' },
      { id: 'gha', name: 'Ghana', code: 'GH', rank: 74, flag: 'gh' },
      { id: 'pan', name: 'Panama', code: 'PA', rank: 33, flag: 'pa' },
    ],
  },
];
