export interface ESPNTeamResponse {
  team: {
    id: string;
    displayName: string;
    abbreviation: string;
    shortDisplayName: string;
    color: string;
    alternateColor: string;
    logos: { href: string }[];
    record?: {
      items: {
        summary: string;
        stats: { name: string; value: number }[];
      }[];
    };
    nextEvent?: ESPNEvent[];
    standingSummary?: string;
  };
}

export interface ESPNEvent {
  id: string;
  date: string;
  name: string;
  shortName: string;
  status: {
    type: {
      id: string;
      name: string;
      state: 'pre' | 'in' | 'post';
      completed: boolean;
      description: string;
      detail?: string;
      shortDetail?: string;
    };
    displayClock?: string;
    period?: number;
  };
  competitions: ESPNCompetition[];
}

export interface ESPNCompetition {
  id: string;
  date: string;
  venue?: {
    fullName: string;
    address?: { city: string; state: string };
  };
  competitors: ESPNCompetitor[];
  broadcasts?: { names: string[] }[];
  status: ESPNEvent['status'];
}

export interface ESPNCompetitor {
  id: string;
  homeAway: 'home' | 'away';
  team: {
    id: string;
    displayName: string;
    abbreviation: string;
    shortDisplayName: string;
    logo: string;
    color?: string;
  };
  score?: string;
  winner?: boolean;
  records?: { summary: string }[];
}

export interface ESPNScoreboardResponse {
  events: ESPNEvent[];
  leagues: {
    abbreviation: string;
    name: string;
  }[];
}

export interface ESPNStandingsResponse {
  children: {
    name: string;
    abbreviation: string;
    standings: {
      entries: {
        team: {
          id: string;
          displayName: string;
          abbreviation: string;
          logos: { href: string }[];
        };
        stats: { name: string; displayValue: string; value: number }[];
      }[];
    };
  }[];
}

export interface ESPNScheduleResponse {
  team: {
    id: string;
    displayName: string;
  };
  events: ESPNEvent[];
}

export interface ESPNNewsResponse {
  articles: {
    headline: string;
    description: string;
    published: string;
    links: { web: { href: string } };
    images?: { url: string }[];
  }[];
}

export interface F1Race {
  season: string;
  raceName: string;
  date: string;
  time?: string;
  round: string;
  Circuit: {
    circuitId: string;
    circuitName: string;
    Location: {
      locality: string;
      country: string;
    };
  };
  FirstPractice?: { date: string; time: string };
  Qualifying?: { date: string; time: string };
  Sprint?: { date: string; time: string };
}

export interface F1DriverStanding {
  position: number;
  points: number;
  wins: number;
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    nationality: string;
    code?: string;
  };
  Constructors: {
    constructorId: string;
    name: string;
  }[];
}

export interface F1ConstructorStanding {
  position: number;
  points: number;
  wins: number;
  Constructor: {
    constructorId: string;
    name: string;
    nationality: string;
  };
}

export interface F1RaceResult {
  raceName: string;
  round: number;
  date: string;
  Results: {
    position: string;
    Driver: {
      givenName: string;
      familyName: string;
      code: string;
    };
    Constructor: { name: string };
    Time?: { time: string };
    status: string;
    grid: string;
    laps: string;
    points: string;
  }[];
}

export interface CalendarEventProps {
  name: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timeZone: string;
  location: string;
  description: string;
}
