import { useQueries } from '@tanstack/react-query';
import { getScoreboard } from '../../api/espn';
import { FAVORITE_TEAMS } from '../../config/teams';
import type { ESPNEvent } from '../../api/types';
import { TeamLogo } from '../shared/TeamLogo';
import { Radio } from 'lucide-react';
import { formatGameProgress } from '../../utils/gameStatus';

type TaggedGame = ESPNEvent & { _league: string };

const favoriteIds = new Set(FAVORITE_TEAMS.map((t) => t.espnId));

const leaguesToCheck = [
  { sport: 'football', league: 'nfl' },
  { sport: 'hockey', league: 'nhl' },
  { sport: 'baseball', league: 'mlb' },
] as const;

const MAX_FEATURED = 2;
const MAX_COMPACT = 4;

export function LiveGameBanner() {
  const results = useQueries({
    queries: leaguesToCheck.map((l) => ({
      queryKey: ['scoreboard', l.league, 'live-check'],
      queryFn: () => getScoreboard(l.sport, l.league),
      staleTime: 30 * 1000,
      refetchInterval: 30 * 1000,
    })),
  });

  const favoriteGames: TaggedGame[] = [];
  const otherGames: TaggedGame[] = [];

  results.forEach((r, idx) => {
    if (!r.data) return;
    const league = leaguesToCheck[idx].league;
    r.data.events.forEach((ev) => {
      if (ev.status.type.state !== 'in') return;
      const tagged = { ...ev, _league: league };
      const hasTeam = ev.competitions[0]?.competitors.some((c) =>
        favoriteIds.has(c.team.id)
      );
      if (hasTeam) {
        favoriteGames.push(tagged);
      } else {
        otherGames.push(tagged);
      }
    });
  });

  const totalLive = favoriteGames.length + otherGames.length;
  if (totalLive === 0) return null;

  const featured = favoriteGames.slice(0, MAX_FEATURED);
  const compact = [
    ...favoriteGames.slice(MAX_FEATURED),
    ...otherGames,
  ].slice(0, MAX_COMPACT);
  const remaining = totalLive - featured.length - compact.length;

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Radio size={16} className="text-live animate-pulse" />
        <span className="text-xs font-bold text-live uppercase tracking-wider">
          {totalLive} Game{totalLive !== 1 ? 's' : ''} Live
        </span>
      </div>

      {featured.map((game) => (
        <FeaturedLiveGame key={game.id} game={game} />
      ))}

      {compact.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {compact.map((game) => (
            <CompactLiveGame key={game.id} game={game} />
          ))}
        </div>
      )}

      {remaining > 0 && (
        <p className="text-xs text-text-muted text-center">
          + {remaining} more live game{remaining !== 1 ? 's' : ''} across leagues
        </p>
      )}
    </div>
  );
}

function FeaturedLiveGame({ game }: { game: TaggedGame }) {
  const comp = game.competitions[0];
  const home = comp.competitors.find((c) => c.homeAway === 'home');
  const away = comp.competitors.find((c) => c.homeAway === 'away');
  const isFav = (id: string) => favoriteIds.has(id);

  return (
    <div className="glass rounded-2xl p-4 ring-1 ring-live/30 bg-gradient-to-r from-live/5 to-transparent">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-live">
          {game.shortName}
        </span>
        <span className="text-xs text-text-muted">
          {formatGameProgress(game.status, game._league)}
        </span>
      </div>
      <div className="flex items-center justify-center gap-6">
        <div className="flex items-center gap-3 flex-1 justify-end">
          <span
            className={`font-display font-bold text-sm sm:text-base ${
              isFav(away?.team.id ?? '') ? 'text-accent' : ''
            }`}
          >
            {away?.team.abbreviation}
          </span>
          <TeamLogo
            src={away?.team.logo ?? ''}
            alt={away?.team.displayName ?? ''}
            size={36}
          />
          <span className="font-mono-nums text-2xl font-extrabold">
            {away?.score ?? '0'}
          </span>
        </div>
        <span className="text-text-muted font-display font-bold text-sm">
          vs
        </span>
        <div className="flex items-center gap-3 flex-1">
          <span className="font-mono-nums text-2xl font-extrabold">
            {home?.score ?? '0'}
          </span>
          <TeamLogo
            src={home?.team.logo ?? ''}
            alt={home?.team.displayName ?? ''}
            size={36}
          />
          <span
            className={`font-display font-bold text-sm sm:text-base ${
              isFav(home?.team.id ?? '') ? 'text-accent' : ''
            }`}
          >
            {home?.team.abbreviation}
          </span>
        </div>
      </div>
    </div>
  );
}

function CompactLiveGame({ game }: { game: TaggedGame }) {
  const comp = game.competitions[0];
  const home = comp.competitors.find((c) => c.homeAway === 'home');
  const away = comp.competitors.find((c) => c.homeAway === 'away');

  return (
    <div className="glass rounded-xl px-3 py-2.5 ring-1 ring-live/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <TeamLogo
            src={away?.team.logo ?? ''}
            alt={away?.team.abbreviation ?? ''}
            size={18}
          />
          <span className="text-xs font-semibold">{away?.team.abbreviation}</span>
          <span className="font-mono-nums text-xs font-bold">{away?.score ?? '0'}</span>
          <span className="text-text-muted text-xs">-</span>
          <span className="font-mono-nums text-xs font-bold">{home?.score ?? '0'}</span>
          <span className="text-xs font-semibold">{home?.team.abbreviation}</span>
          <TeamLogo
            src={home?.team.logo ?? ''}
            alt={home?.team.abbreviation ?? ''}
            size={18}
          />
        </div>
        <span className="text-[10px] text-live font-medium shrink-0 ml-2">
          {formatGameProgress(game.status, game._league)}
        </span>
      </div>
    </div>
  );
}
