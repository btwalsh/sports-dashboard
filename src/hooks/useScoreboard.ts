import { useQuery } from '@tanstack/react-query';
import { getScoreboard } from '../api/espn';

export function useScoreboard(sport: string, league: string, date?: string) {
  return useQuery({
    queryKey: ['scoreboard', league, date],
    queryFn: () => getScoreboard(sport, league, date),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
