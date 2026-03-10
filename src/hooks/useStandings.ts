import { useQuery } from '@tanstack/react-query';
import { getStandings } from '../api/espn';

export function useStandings(sport: string, league: string) {
  return useQuery({
    queryKey: ['standings', league],
    queryFn: () => getStandings(sport, league),
    staleTime: 5 * 60 * 1000,
  });
}
