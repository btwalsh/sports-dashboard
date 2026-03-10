export interface LeagueConfig {
  key: string;
  name: string;
  sport: string;
  espnSlug: string;
  icon: string;
  path: string;
}

export const LEAGUES: Record<string, LeagueConfig> = {
  nhl: {
    key: 'nhl',
    name: 'NHL',
    sport: 'hockey',
    espnSlug: 'hockey/nhl',
    icon: '🏒',
    path: '/nhl',
  },
  nfl: {
    key: 'nfl',
    name: 'NFL',
    sport: 'football',
    espnSlug: 'football/nfl',
    icon: '🏈',
    path: '/nfl',
  },
  mlb: {
    key: 'mlb',
    name: 'MLB',
    sport: 'baseball',
    espnSlug: 'baseball/mlb',
    icon: '⚾',
    path: '/mlb',
  },
  f1: {
    key: 'f1',
    name: 'Formula 1',
    sport: 'racing',
    espnSlug: 'racing/f1',
    icon: '🏎️',
    path: '/f1',
  },
  college: {
    key: 'college',
    name: 'College Football',
    sport: 'football',
    espnSlug: 'football/college-football',
    icon: '🏟️',
    path: '/college',
  },
};

export const GAME_DURATION_HOURS: Record<string, number> = {
  nfl: 3.5,
  nhl: 2.5,
  mlb: 3,
  f1: 2,
  'college-football': 3.5,
};
