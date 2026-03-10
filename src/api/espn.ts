import type {
  ESPNTeamResponse,
  ESPNScoreboardResponse,
  ESPNStandingsResponse,
  ESPNScheduleResponse,
  ESPNNewsResponse,
} from './types';

const BASE = 'https://site.api.espn.com/apis/site/v2/sports';

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ESPN API ${res.status}: ${url}`);
  return res.json();
}

export function getTeam(sport: string, league: string, teamId: string) {
  return fetchJSON<ESPNTeamResponse>(
    `${BASE}/${sport}/${league}/teams/${teamId}`
  );
}

export function getScoreboard(sport: string, league: string, date?: string) {
  const params = date ? `?dates=${date}` : '';
  return fetchJSON<ESPNScoreboardResponse>(
    `${BASE}/${sport}/${league}/scoreboard${params}`
  );
}

export function getStandings(sport: string, league: string) {
  return fetchJSON<ESPNStandingsResponse>(
    `https://site.api.espn.com/apis/v2/sports/${sport}/${league}/standings`
  );
}

export function getTeamSchedule(
  sport: string,
  league: string,
  teamId: string
) {
  return fetchJSON<ESPNScheduleResponse>(
    `${BASE}/${sport}/${league}/teams/${teamId}/schedule`
  );
}

export function getNews(sport: string, league: string, teamId?: string) {
  const teamParam = teamId ? `?team=${teamId}` : '';
  return fetchJSON<ESPNNewsResponse>(
    `${BASE}/${sport}/${league}/news${teamParam}`
  );
}

export function getTeamLogoUrl(league: string, teamId: string): string {
  return `https://a.espncdn.com/i/teamlogos/${league}/500/${teamId}.png`;
}

export function getCollegeTeamLogoUrl(teamId: string): string {
  return `https://a.espncdn.com/i/teamlogos/ncaa/500/${teamId}.png`;
}
