import { useQuery } from '@tanstack/react-query';
import { getTeam, getTeamSchedule } from '../api/espn';
import type { TeamConfig } from '../config/teams';

export function useTeamData(team: TeamConfig) {
  return useQuery({
    queryKey: ['team', team.league, team.espnId],
    queryFn: () => getTeam(team.sport, team.league, team.espnId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useTeamSchedule(
  sport: string,
  league: string,
  teamId: string
) {
  return useQuery({
    queryKey: ['schedule', league, teamId],
    queryFn: () => getTeamSchedule(sport, league, teamId),
    staleTime: 60 * 60 * 1000,
  });
}
