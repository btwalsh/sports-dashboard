import type {
  F1Race,
  F1DriverStanding,
  F1ConstructorStanding,
  F1RaceResult,
} from './types';

const BASE = 'https://api.jolpi.ca/ergast/f1/current';

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`F1 API ${res.status}: ${url}`);
  return res.json();
}

interface ErgastRaceTable {
  MRData: {
    RaceTable: { Races: F1Race[] };
  };
}

interface ErgastDriverStandings {
  MRData: {
    StandingsTable: {
      StandingsLists: {
        DriverStandings: F1DriverStanding[];
      }[];
    };
  };
}

interface ErgastConstructorStandings {
  MRData: {
    StandingsTable: {
      StandingsLists: {
        ConstructorStandings: F1ConstructorStanding[];
      }[];
    };
  };
}

interface ErgastRaceResults {
  MRData: {
    RaceTable: { Races: F1RaceResult[] };
  };
}

export async function getRaceSchedule(): Promise<F1Race[]> {
  const data = await fetchJSON<ErgastRaceTable>(`${BASE}.json`);
  return data.MRData.RaceTable.Races;
}

export async function getDriverStandings(): Promise<F1DriverStanding[]> {
  const data = await fetchJSON<ErgastDriverStandings>(
    `${BASE}/driverStandings.json`
  );
  return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
}

export async function getConstructorStandings(): Promise<
  F1ConstructorStanding[]
> {
  const data = await fetchJSON<ErgastConstructorStandings>(
    `${BASE}/constructorStandings.json`
  );
  return (
    data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? []
  );
}

export async function getLastRaceResults(): Promise<F1RaceResult | null> {
  const data = await fetchJSON<ErgastRaceResults>(`${BASE}/last/results.json`);
  return data.MRData.RaceTable.Races[0] ?? null;
}
