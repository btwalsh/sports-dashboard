export interface TeamConfig {
  name: string;
  abbreviation: string;
  league: 'nfl' | 'nhl' | 'mlb';
  sport: 'football' | 'hockey' | 'baseball';
  espnId: string;
  colors: { primary: string; accent: string };
}

export interface CollegeTeamConfig {
  name: string;
  abbreviation: string;
  espnId: string;
  colors: { primary: string; accent: string };
}

export const FAVORITE_TEAMS: TeamConfig[] = [
  {
    name: 'Seattle Seahawks',
    abbreviation: 'SEA',
    league: 'nfl',
    sport: 'football',
    espnId: '26',
    colors: { primary: '#002244', accent: '#69BE28' },
  },
  {
    name: 'Seattle Kraken',
    abbreviation: 'SEA',
    league: 'nhl',
    sport: 'hockey',
    espnId: '124292',
    colors: { primary: '#001628', accent: '#99D9D9' },
  },
  {
    name: 'Seattle Mariners',
    abbreviation: 'SEA',
    league: 'mlb',
    sport: 'baseball',
    espnId: '12',
    colors: { primary: '#0C2C56', accent: '#005C5C' },
  },
  {
    name: 'Boston Bruins',
    abbreviation: 'BOS',
    league: 'nhl',
    sport: 'hockey',
    espnId: '1',
    colors: { primary: '#FFB81C', accent: '#000000' },
  },
  {
    name: 'Colorado Avalanche',
    abbreviation: 'COL',
    league: 'nhl',
    sport: 'hockey',
    espnId: '17',
    colors: { primary: '#6F263D', accent: '#236192' },
  },
];

export const COLLEGE_TEAMS: CollegeTeamConfig[] = [
  {
    name: 'Harvard Crimson',
    abbreviation: 'HARV',
    espnId: '108',
    colors: { primary: '#A51C30', accent: '#1E1E1E' },
  },
  {
    name: 'UW Huskies',
    abbreviation: 'UW',
    espnId: '264',
    colors: { primary: '#4B2E83', accent: '#E8D3A2' },
  },
];
