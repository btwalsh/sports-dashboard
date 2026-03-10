import { useTeamSchedule } from '../../hooks/useTeamData';
import { TeamLogo } from '../shared/TeamLogo';
import { AddToCalendarIcon } from '../shared/AddToCalendarIcon';
import { buildCalendarEvent } from '../../utils/calendar';
import { formatGameProgress } from '../../utils/gameStatus';
import { SkeletonCard } from '../shared/SkeletonCard';
import { Clock, MapPin, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  sport: string;
  league: string;
  teamId: string;
}

interface NormalizedGame {
  id: string;
  date: string;
  state: 'pre' | 'in' | 'post';
  homeTeam: { abbreviation: string; displayName: string; logo: string };
  awayTeam: { abbreviation: string; displayName: string; logo: string };
  homeScore: string | null;
  awayScore: string | null;
  homeWinner: boolean;
  awayWinner: boolean;
  venue: string;
  clock?: string;
  period?: number;
  shortDetail?: string;
  competition: ReturnType<typeof extractCompetition>;
}

function extractCompetition(event: Record<string, unknown>) {
  const comps = event.competitions as Record<string, unknown>[];
  return comps?.[0] ?? null;
}

function extractLogo(teamData: Record<string, unknown>): string {
  if (typeof teamData.logo === 'string') return teamData.logo;
  const logos = teamData.logos as { href: string }[] | undefined;
  return logos?.[0]?.href ?? '';
}

function normalizeScheduleEvent(event: Record<string, unknown>): NormalizedGame | null {
  const comp = (event.competitions as Record<string, unknown>[])?.[0];
  if (!comp) return null;

  const status = comp.status as Record<string, unknown> | undefined;
  const statusType = status?.type as Record<string, unknown> | undefined;
  const state = (statusType?.state as string) ?? 'pre';

  const competitors = comp.competitors as Record<string, unknown>[];
  const home = competitors?.find((c) => c.homeAway === 'home');
  const away = competitors?.find((c) => c.homeAway === 'away');

  const homeTeamData = (home?.team as Record<string, unknown>) ?? {};
  const awayTeamData = (away?.team as Record<string, unknown>) ?? {};

  const homeScore = home?.score;
  const awayScore = away?.score;

  const venue = comp.venue as Record<string, unknown> | undefined;

  return {
    id: event.id as string,
    date: (event.date ?? comp.date) as string,
    state: state as 'pre' | 'in' | 'post',
    homeTeam: {
      abbreviation: (homeTeamData.abbreviation as string) ?? 'TBD',
      displayName: (homeTeamData.displayName as string) ?? '',
      logo: extractLogo(homeTeamData),
    },
    awayTeam: {
      abbreviation: (awayTeamData.abbreviation as string) ?? 'TBD',
      displayName: (awayTeamData.displayName as string) ?? '',
      logo: extractLogo(awayTeamData),
    },
    homeScore: homeScore != null
      ? (typeof homeScore === 'object' ? (homeScore as Record<string, string>).displayValue : String(homeScore))
      : null,
    awayScore: awayScore != null
      ? (typeof awayScore === 'object' ? (awayScore as Record<string, string>).displayValue : String(awayScore))
      : null,
    homeWinner: (home?.winner as boolean) ?? false,
    awayWinner: (away?.winner as boolean) ?? false,
    venue: venue ? (venue.fullName as string) ?? '' : '',
    clock: status?.displayClock as string | undefined,
    period: status?.period as number | undefined,
    shortDetail: (statusType?.shortDetail ?? statusType?.detail) as string | undefined,
    competition: comp as ReturnType<typeof extractCompetition>,
  };
}

export function TeamSchedule({ sport, league, teamId }: Props) {
  const { data, isLoading, isError } = useTeamSchedule(sport, league, teamId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-text-muted text-sm">Unable to load schedule</p>;
  }

  const rawEvents = (data.events ?? []) as unknown as Record<string, unknown>[];
  const games = rawEvents
    .map(normalizeScheduleEvent)
    .filter((g): g is NormalizedGame => g !== null);

  const completed = games.filter((g) => g.state === 'post');
  const upcoming = games.filter((g) => g.state === 'pre');
  const live = games.filter((g) => g.state === 'in');

  const lastGame = completed.length > 0 ? completed[completed.length - 1] : null;
  const next3 = upcoming.slice(0, 3);

  return (
    <div className="space-y-6">
      {live.length > 0 && (
        <div>
          <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-live animate-pulse" />
            <span className="text-live">Live</span>
          </h3>
          <div className="space-y-3">
            {live.map((g) => (
              <ScheduleRow key={g.id} game={g} league={league} />
            ))}
          </div>
        </div>
      )}

      {lastGame && (
        <div>
          <h3 className="font-display font-bold text-base mb-3 text-text-muted">
            Last Game
          </h3>
          <ScheduleRow game={lastGame} league={league} />
        </div>
      )}

      {next3.length > 0 && (
        <div>
          <h3 className="font-display font-bold text-base mb-3">
            Next {next3.length === 1 ? 'Game' : `${next3.length} Games`}
          </h3>
          <div className="space-y-3">
            {next3.map((g) => (
              <ScheduleRow key={g.id} game={g} league={league} />
            ))}
          </div>
        </div>
      )}

      {completed.length > 1 && (
        <details className="group">
          <summary className="text-sm text-text-muted cursor-pointer hover:text-text-secondary font-medium">
            View all {completed.length} completed games
          </summary>
          <div className="space-y-3 mt-3">
            {[...completed].reverse().slice(1).map((g) => (
              <ScheduleRow key={g.id} game={g} league={league} />
            ))}
          </div>
        </details>
      )}

      {upcoming.length > 3 && (
        <details className="group">
          <summary className="text-sm text-text-muted cursor-pointer hover:text-text-secondary font-medium">
            View all {upcoming.length} upcoming games
          </summary>
          <div className="space-y-3 mt-3">
            {upcoming.slice(3).map((g) => (
              <ScheduleRow key={g.id} game={g} league={league} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function ScheduleRow({ game, league }: { game: NormalizedGame; league: string }) {
  const gameDate = new Date(game.date);
  const dateStr = gameDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = gameDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const isFinal = game.state === 'post';
  const isLive = game.state === 'in';
  const isPre = game.state === 'pre';

  return (
    <div
      className={`glass rounded-xl p-4 transition-all duration-200 ${
        isLive ? 'ring-1 ring-live/40' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-1 text-xs font-semibold text-live">
              <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse" />
              LIVE
            </span>
          )}
          {isFinal && (
            <span className="text-xs font-medium text-text-muted">FINAL</span>
          )}
          {isPre && (
            <span className="text-xs text-text-secondary">
              {dateStr} &middot; {timeStr}
            </span>
          )}
          {isFinal && (
            <span className="text-xs text-text-muted ml-1">&middot; {dateStr}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-1 text-xs text-live">
              <Clock size={12} />
              {formatGameProgress(
                { displayClock: game.clock, period: game.period, type: { shortDetail: game.shortDetail } },
                league
              )}
            </span>
          )}
          {isPre && game.competition && (
            <AddToCalendarIcon
              event={buildCalendarEvent(
                game.competition as unknown as Parameters<typeof buildCalendarEvent>[0],
                league
              )}
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TeamLogo src={game.awayTeam.logo} alt={game.awayTeam.abbreviation} size={24} />
              <span
                className={`text-sm font-semibold ${
                  isFinal && game.awayWinner ? 'text-text-primary' : isFinal ? 'text-text-muted' : 'text-text-primary'
                }`}
              >
                {game.awayTeam.abbreviation}
              </span>
            </div>
            {game.awayScore != null && (
              <span
                className={`font-mono-nums text-sm font-bold ${
                  isFinal && game.awayWinner ? 'text-text-primary' : isFinal ? 'text-text-muted' : 'text-text-primary'
                }`}
              >
                {game.awayScore}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TeamLogo src={game.homeTeam.logo} alt={game.homeTeam.abbreviation} size={24} />
              <span
                className={`text-sm font-semibold ${
                  isFinal && game.homeWinner ? 'text-text-primary' : isFinal ? 'text-text-muted' : 'text-text-primary'
                }`}
              >
                {game.homeTeam.abbreviation}
              </span>
            </div>
            {game.homeScore != null && (
              <span
                className={`font-mono-nums text-sm font-bold ${
                  isFinal && game.homeWinner ? 'text-text-primary' : isFinal ? 'text-text-muted' : 'text-text-primary'
                }`}
              >
                {game.homeScore}
              </span>
            )}
          </div>
        </div>

        {isFinal && (
          <div className="shrink-0">
            {game.homeWinner || game.awayWinner ? (
              game.homeWinner ? (
                <TrendingUp size={18} className="text-win" />
              ) : (
                <TrendingDown size={18} className="text-loss" />
              )
            ) : null}
          </div>
        )}
      </div>

      {isPre && game.venue && (
        <div className="flex items-center gap-1 mt-3 text-xs text-text-muted">
          <MapPin size={12} />
          {game.venue}
        </div>
      )}
    </div>
  );
}
