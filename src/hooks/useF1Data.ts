import { useQuery } from '@tanstack/react-query';
import {
  getRaceSchedule,
  getDriverStandings,
  getConstructorStandings,
  getLastRaceResults,
} from '../api/f1';

export function useF1Schedule() {
  return useQuery({
    queryKey: ['f1', 'schedule'],
    queryFn: getRaceSchedule,
    staleTime: 60 * 60 * 1000,
  });
}

export function useF1DriverStandings() {
  return useQuery({
    queryKey: ['f1', 'drivers'],
    queryFn: getDriverStandings,
    staleTime: 5 * 60 * 1000,
  });
}

export function useF1ConstructorStandings() {
  return useQuery({
    queryKey: ['f1', 'constructors'],
    queryFn: getConstructorStandings,
    staleTime: 5 * 60 * 1000,
  });
}

export function useF1LastRace() {
  return useQuery({
    queryKey: ['f1', 'lastRace'],
    queryFn: getLastRaceResults,
    staleTime: 60 * 60 * 1000,
  });
}
