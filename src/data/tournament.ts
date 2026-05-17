export interface Team {
  id: string;
  name: string;
  code: string;
  rank: number;
  flag: string;
  starPlayer?: string;
  lastWC?: string;
  keyStat?: string;
}

export interface Stadium {
  id: string;
  name: string;
  city: string;
  capacity: string;
}

export interface Group {
  id: string;
  name: string;
  teams: Team[];
}

export const stadiums: Stadium[] = [
  { id: '1', name: 'MetLife Stadium', city: 'New York/New Jersey', capacity: '82,500' },
  { id: '2', name: 'Estadio Azteca', city: 'Mexico City', capacity: '87,523' },
  { id: '3', name: 'BC Place', city: 'Vancouver', capacity: '54,500' },
  { id: '4', name: 'AT&T Stadium', city: 'Dallas', capacity: '80,000' },
  { id: '5', name: 'SoFi Stadium', city: 'Los Angeles', capacity: '70,240' },
  { id: '6', name: 'Hard Rock Stadium', city: 'Miami', capacity: '64,767' },
];

export const tournamentData: Group[] = [
  {
    id: 'A',
    name: 'Group A',
    teams: [
      { id: 'mex', name: 'Mexico', code: 'MX', rank: 15, flag: 'mx', starPlayer: 'Santiago Giménez', lastWC: 'Group Stage', keyStat: 'Co-Host advantage' },
      { id: 'rsa', name: 'South Africa', code: 'ZA', rank: 60, flag: 'za', starPlayer: 'Percy Tau', lastWC: 'DNP', keyStat: 'Strong defense' },
      { id: 'kor', name: 'South Korea', code: 'KR', rank: 25, flag: 'kr', starPlayer: 'Son Heung-min', lastWC: 'Round of 16', keyStat: 'High stamina' },
      { id: 'cze', name: 'Czech Republic', code: 'CZ', rank: 41, flag: 'cz', starPlayer: 'Patrik Schick', lastWC: 'DNP', keyStat: 'Tactical discipline' },
    ],
  },
  {
    id: 'B',
    name: 'Group B',
    teams: [
      { id: 'can', name: 'Canada', code: 'CA', rank: 30, flag: 'ca', starPlayer: 'Alphonso Davies', lastWC: 'Group Stage', keyStat: 'Fast transitions' },
      { id: 'sui', name: 'Switzerland', code: 'CH', rank: 19, flag: 'ch', starPlayer: 'Granit Xhaka', lastWC: 'Round of 16', keyStat: 'Experienced core' },
      { id: 'qat', name: 'Qatar', code: 'QA', rank: 55, flag: 'qa', starPlayer: 'Akram Afif', lastWC: 'Group Stage', keyStat: 'Technical passing' },
      { id: 'bih', name: 'Bosnia & Herz.', code: 'BA', rank: 65, flag: 'ba', starPlayer: 'Edin Džeko', lastWC: 'DNP', keyStat: 'Physical presence' },
    ],
  },
  {
    id: 'C',
    name: 'Group C',
    teams: [
      { id: 'bra', name: 'Brazil', code: 'BR', rank: 6, flag: 'br', starPlayer: 'Vinícius Júnior', lastWC: 'Quarter-Finals', keyStat: 'Unmatched flair' },
      { id: 'mar', name: 'Morocco', code: 'MA', rank: 8, flag: 'ma', starPlayer: 'Achraf Hakimi', lastWC: 'Semi-Finals', keyStat: 'Defensive wall' },
      { id: 'hai', name: 'Haiti', code: 'HT', rank: 83, flag: 'ht', starPlayer: 'Duckens Nazon', lastWC: 'DNP', keyStat: 'Underdog spirit' },
      { id: 'sco', name: 'Scotland', code: 'GB-SCT', rank: 43, flag: 'gb-sct', starPlayer: 'Andrew Robertson', lastWC: 'DNP', keyStat: 'Strong set pieces' },
    ],
  },
  {
    id: 'D',
    name: 'Group D',
    teams: [
      { id: 'usa', name: 'United States', code: 'US', rank: 16, flag: 'us', starPlayer: 'Christian Pulisic', lastWC: 'Round of 16', keyStat: 'Youthful energy' },
      { id: 'par', name: 'Paraguay', code: 'PY', rank: 40, flag: 'py', starPlayer: 'Miguel Almirón', lastWC: 'DNP', keyStat: 'Counter-attack' },
      { id: 'aus', name: 'Australia', code: 'AU', rank: 27, flag: 'au', starPlayer: 'Mathew Ryan', lastWC: 'Round of 16', keyStat: 'Physical game' },
      { id: 'tur', name: 'Turkey', code: 'TR', rank: 22, flag: 'tr', starPlayer: 'Hakan Çalhanoğlu', lastWC: 'DNP', keyStat: 'Midfield control' },
    ],
  },
  {
    id: 'E',
    name: 'Group E',
    teams: [
      { id: 'ger', name: 'Germany', code: 'DE', rank: 10, flag: 'de', starPlayer: 'Jamal Musiala', lastWC: 'Group Stage', keyStat: 'Precise build-up' },
      { id: 'cuw', name: 'Curaçao', code: 'CW', rank: 82, flag: 'cw', starPlayer: 'Juninho Bacuna', lastWC: 'DNP', keyStat: 'Rapid wingers' },
      { id: 'civ', name: 'Ivory Coast', code: 'CI', rank: 34, flag: 'ci', starPlayer: 'Sébastien Haller', lastWC: 'DNP', keyStat: 'Strong finishers' },
      { id: 'ecu', name: 'Ecuador', code: 'EC', rank: 23, flag: 'ec', starPlayer: 'Enner Valencia', lastWC: 'Group Stage', keyStat: 'High altitude training' },
    ],
  },
  {
    id: 'F',
    name: 'Group F',
    teams: [
      { id: 'ned', name: 'Netherlands', code: 'NL', rank: 7, flag: 'nl', starPlayer: 'Cody Gakpo', lastWC: 'Quarter-Finals', keyStat: 'Tactical flexibility' },
      { id: 'jpn', name: 'Japan', code: 'JP', rank: 18, flag: 'jp', starPlayer: 'Kaoru Mitoma', lastWC: 'Round of 16', keyStat: 'Disciplined press' },
      { id: 'tun', name: 'Tunisia', code: 'TN', rank: 44, flag: 'tn', starPlayer: 'Ellyes Skhiri', lastWC: 'Group Stage', keyStat: 'Resilient defense' },
      { id: 'swe', name: 'Sweden', code: 'SE', rank: 38, flag: 'se', starPlayer: 'Alexander Isak', lastWC: 'DNP', keyStat: 'Efficient scoring' },
    ],
  },
  {
    id: 'G',
    name: 'Group G',
    teams: [
      { id: 'bel', name: 'Belgium', code: 'BE', rank: 9, flag: 'be', starPlayer: 'Kevin De Bruyne', lastWC: 'Group Stage', keyStat: 'Creative vision' },
      { id: 'egy', name: 'Egypt', code: 'EG', rank: 29, flag: 'eg', starPlayer: 'Mohamed Salah', lastWC: 'DNP', keyStat: 'Legendary captain' },
      { id: 'irn', name: 'Iran', code: 'IR', rank: 21, flag: 'ir', starPlayer: 'Mehdi Taremi', lastWC: 'Group Stage', keyStat: 'Aerial dominance' },
      { id: 'nzl', name: 'New Zealand', code: 'NZ', rank: 85, flag: 'nz', starPlayer: 'Chris Wood', lastWC: 'DNP', keyStat: 'Height advantage' },
    ],
  },
  {
    id: 'H',
    name: 'Group H',
    teams: [
      { id: 'esp', name: 'Spain', code: 'ES', rank: 2, flag: 'es', starPlayer: 'Lamine Yamal', lastWC: 'Round of 16', keyStat: 'Tiki-taka' },
      { id: 'cpv', name: 'Cape Verde', code: 'CV', rank: 69, flag: 'cv', starPlayer: 'Bebé', lastWC: 'DNP', keyStat: 'Sudden long shots' },
      { id: 'ksa', name: 'Saudi Arabia', code: 'SA', rank: 61, flag: 'sa', starPlayer: 'Salem Al-Dawsari', lastWC: 'Group Stage', keyStat: 'High intensity' },
      { id: 'uru', name: 'Uruguay', code: 'UY', rank: 17, flag: 'uy', starPlayer: 'Darwin Núñez', lastWC: 'Group Stage', keyStat: 'Garra Charrúa' },
    ],
  },
  {
    id: 'I',
    name: 'Group I',
    teams: [
      { id: 'fra', name: 'France', code: 'FR', rank: 1, flag: 'fr', starPlayer: 'Kylian Mbappé', lastWC: 'Runners-up', keyStat: 'Lightning pace' },
      { id: 'sen', name: 'Senegal', code: 'SN', rank: 14, flag: 'sn', starPlayer: 'Nicolas Jackson', lastWC: 'Round of 16', keyStat: 'Physical strength' },
      { id: 'nor', name: 'Norway', code: 'NO', rank: 31, flag: 'no', starPlayer: 'Erling Haaland', lastWC: 'DNP', keyStat: 'Goal machine' },
      { id: 'irq', name: 'Iraq', code: 'IQ', rank: 57, flag: 'iq', starPlayer: 'Aymen Hussein', lastWC: 'DNP', keyStat: 'Mental toughness' },
    ],
  },
  {
    id: 'J',
    name: 'Group J',
    teams: [
      { id: 'arg', name: 'Argentina', code: 'AR', rank: 3, flag: 'ar', starPlayer: 'Lionel Messi', lastWC: 'Winners', keyStat: 'Champions DNA' },
      { id: 'alg', name: 'Algeria', code: 'DZ', rank: 28, flag: 'dz', starPlayer: 'Riyad Mahrez', lastWC: 'DNP', keyStat: 'Slick dribbling' },
      { id: 'aut', name: 'Austria', code: 'AT', rank: 24, flag: 'at', starPlayer: 'David Alaba', lastWC: 'DNP', keyStat: 'Solid organization' },
      { id: 'jor', name: 'Jordan', code: 'JO', rank: 63, flag: 'jo', starPlayer: 'Musa Al-Taamari', lastWC: 'DNP', keyStat: 'Fighter spirit' },
    ],
  },
  {
    id: 'K',
    name: 'Group K',
    teams: [
      { id: 'por', name: 'Portugal', code: 'PT', rank: 5, flag: 'pt', starPlayer: 'Rafael Leão', lastWC: 'Quarter-Finals', keyStat: 'Deep squad depth' },
      { id: 'uzb', name: 'Uzbekistan', code: 'UZ', rank: 50, flag: 'uz', starPlayer: 'Eldor Shomurodov', lastWC: 'DNP', keyStat: 'Strong discipline' },
      { id: 'col', name: 'Colombia', code: 'CO', rank: 13, flag: 'co', starPlayer: 'Luis Díaz', lastWC: 'DNP', keyStat: 'Flair & Pace' },
      { id: 'cod', name: 'DR Congo', code: 'CD', rank: 46, flag: 'cd', starPlayer: 'Yoane Wissa', lastWC: 'DNP', keyStat: 'Raw power' },
    ],
  },
  {
    id: 'L',
    name: 'Group L',
    teams: [
      { id: 'eng', name: 'England', code: 'GB-ENG', rank: 4, flag: 'gb-eng', starPlayer: 'Jude Bellingham', lastWC: 'Quarter-Finals', keyStat: 'Technical quality' },
      { id: 'cro', name: 'Croatia', code: 'HR', rank: 11, flag: 'hr', starPlayer: 'Luka Modrić', lastWC: 'Third Place', keyStat: 'Midfield maestros' },
      { id: 'gha', name: 'Ghana', code: 'GH', rank: 74, flag: 'gh', starPlayer: 'Mohammed Kudus', lastWC: 'Group Stage', keyStat: 'Athleticism' },
      { id: 'pan', name: 'Panama', code: 'PA', rank: 33, flag: 'pa', starPlayer: 'Adalberto Carrasquilla', lastWC: 'DNP', keyStat: 'Team unity' },
    ],
  },
];

export interface TeamColors {
  primary: string;
  primaryGlow: string;
  accent: string;
}

export const getTeamColors = (teamId: string): TeamColors => {
  const colorMap: Record<string, TeamColors> = {
    // Group A
    mex: { primary: '#006847', primaryGlow: 'rgba(0, 104, 71, 0.4)', accent: '#c8102e' },
    rsa: { primary: '#007a3d', primaryGlow: 'rgba(0, 122, 61, 0.4)', accent: '#f4b400' },
    kor: { primary: '#cd2e3a', primaryGlow: 'rgba(205, 46, 58, 0.4)', accent: '#0047a0' },
    cze: { primary: '#11457e', primaryGlow: 'rgba(17, 69, 126, 0.4)', accent: '#d7141a' },
    // Group B
    can: { primary: '#ff0000', primaryGlow: 'rgba(255, 0, 0, 0.4)', accent: '#ffffff' },
    sui: { primary: '#d52b1e', primaryGlow: 'rgba(213, 43, 30, 0.4)', accent: '#ffffff' },
    qat: { primary: '#8a1538', primaryGlow: 'rgba(138, 21, 56, 0.4)', accent: '#ffffff' },
    bih: { primary: '#002f6c', primaryGlow: 'rgba(0, 47, 108, 0.4)', accent: '#ffd700' },
    // Group C
    bra: { primary: '#15803d', primaryGlow: 'rgba(21, 128, 61, 0.4)', accent: '#eab308' },
    mar: { primary: '#c1272d', primaryGlow: 'rgba(193, 39, 45, 0.4)', accent: '#006233' },
    hai: { primary: '#00209f', primaryGlow: 'rgba(0, 32, 159, 0.4)', accent: '#d21034' },
    'gb-sct': { primary: '#0065bf', primaryGlow: 'rgba(0, 101, 191, 0.4)', accent: '#ffffff' },
    // Group D
    usa: { primary: '#002868', primaryGlow: 'rgba(0, 40, 104, 0.4)', accent: '#bf0a30' },
    par: { primary: '#d52b1e', primaryGlow: 'rgba(213, 43, 30, 0.4)', accent: '#0038a8' },
    aus: { primary: '#002f6c', primaryGlow: 'rgba(0, 47, 108, 0.4)', accent: '#ffd700' },
    tur: { primary: '#e30a17', primaryGlow: 'rgba(227, 10, 23, 0.4)', accent: '#ffffff' },
    // Group E
    ger: { primary: '#000000', primaryGlow: 'rgba(0, 0, 0, 0.5)', accent: '#ffd700' },
    cw: { primary: '#002b7f', primaryGlow: 'rgba(0, 43, 127, 0.4)', accent: '#f9e814' },
    ci: { primary: '#ff8200', primaryGlow: 'rgba(255, 130, 0, 0.4)', accent: '#009a44' },
    ec: { primary: '#ffd700', primaryGlow: 'rgba(255, 215, 0, 0.4)', accent: '#001489' },
    // Group F
    ned: { primary: '#ff4f00', primaryGlow: 'rgba(255, 79, 0, 0.4)', accent: '#21468b' },
    jpn: { primary: '#bc002d', primaryGlow: 'rgba(188, 0, 45, 0.4)', accent: '#002f6c' },
    tn: { primary: '#e20f18', primaryGlow: 'rgba(226, 15, 24, 0.4)', accent: '#ffffff' },
    se: { primary: '#006aa7', primaryGlow: 'rgba(0, 106, 167, 0.4)', accent: '#fecc00' },
    // Group G
    bel: { primary: '#e30613', primaryGlow: 'rgba(227, 6, 19, 0.4)', accent: '#ffd700' },
    eg: { primary: '#c09300', primaryGlow: 'rgba(192, 147, 0, 0.4)', accent: '#c1272d' },
    // Custom common giants/favorites fallback list
    arg: { primary: '#75aadb', primaryGlow: 'rgba(117, 170, 219, 0.4)', accent: '#fcbf49' },
    fra: { primary: '#002395', primaryGlow: 'rgba(0, 35, 149, 0.4)', accent: '#ed2939' },
    eng: { primary: '#ce1124', primaryGlow: 'rgba(206, 17, 36, 0.4)', accent: '#0b2c56' },
    esp: { primary: '#c60b1e', primaryGlow: 'rgba(198, 11, 30, 0.4)', accent: '#ffc400' },
    por: { primary: '#006600', primaryGlow: 'rgba(0, 102, 0, 0.4)', accent: '#ff0000' },
    ita: { primary: '#008c45', primaryGlow: 'rgba(0, 140, 69, 0.4)', accent: '#cd212a' },
    uru: { primary: '#56b4e8', primaryGlow: 'rgba(86, 180, 232, 0.4)', accent: '#f9d01b' },
    cro: { primary: '#ff0000', primaryGlow: 'rgba(255, 0, 0, 0.4)', accent: '#002f6c' },
    sen: { primary: '#00853f', primaryGlow: 'rgba(0, 133, 63, 0.4)', accent: '#fdef42' },
  };

  return colorMap[teamId] || {
    primary: '#004585',
    primaryGlow: 'rgba(0, 69, 133, 0.4)',
    accent: '#FFD700',
  };
};

