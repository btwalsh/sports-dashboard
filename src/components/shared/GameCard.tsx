import type { ESPNEvent } from '../../api/types';
import { TeamLogo } from './TeamLogo';
import { AddToCalendarIcon } from './AddToCalendarIcon';
import { buildCalendarEvent } from '../../utils/calendar';
import { Clock, MapPin } from 'lucide-react';
import { formatGameProgress } from '../../utils/gameStatus';

interface GameCardProps {
  event: ESPNEvent;
  leagueKey: string;
  compact?: boolean;
}

export function GameCard({ event, leagueKey, compact = false }: GameCardProps) {
  const comp = event.competitions[0];
  if (!comp) return null;

  const home = comp.competitors.find((c) => c.homeAway === 'home');
  const away = comp.competitors.find((c) => c.homeAway === 'away');
  const state = event.status.type.state;
  const isLive = state === 'in';
  const isFinal = state === 'post';
  const isPre = state === 'pre';

  const gameDate = new Date(event.date);
  const timeStr = gameDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  const dateStr = gameDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`glass rounded-xl transition-all duration-200 hover:border-border-subtle/80 ${
        isLive ? 'ring-1 ring-live/40' : ''
      } ${compact ? 'p-3' : 'p-4'}`}
    >
      <div className="flex items-center justify-between mb-2">
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
        </div>
        {isPre && (
          <AddToCalendarIcon event={buildCalendarEvent(comp, leagueKey)} />
        )}
      </div>

      <div className="space-y-2">
        <TeamRow
          logo={away?.team.logo ?? ''}
          name={away?.team.abbreviation ?? 'TBD'}
          score={away?.score}
          isWinner={away?.winner ?? false}
          state={state}
          compact={compact}
        />
        <TeamRow
          logo={home?.team.logo ?? ''}
          name={home?.team.abbreviation ?? 'TBD'}
          score={home?.score}
          isWinner={home?.winner ?? false}
          state={state}
          compact={compact}
        />
      </div>

      {isLive && (
        <div className="flex items-center gap-1 mt-2 text-xs text-live">
          <Clock size={12} />
          {formatGameProgress(event.status, leagueKey)}
        </div>
      )}

      {!compact && comp.venue && isPre && (
        <div className="flex items-center gap-1 mt-2 text-xs text-text-muted">
          <MapPin size={12} />
          {comp.venue.fullName}
        </div>
      )}
    </div>
  );
}

function TeamRow({
  logo,
  name,
  score,
  isWinner,
  state,
  compact,
}: {
  logo: string;
  name: string;
  score?: string;
  isWinner: boolean;
  state: string;
  compact: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <TeamLogo src={logo} alt={name} size={compact ? 20 : 24} />
        <span
          className={`text-sm font-semibold ${
            state === 'post' && isWinner
              ? 'text-text-primary'
              : state === 'post'
                ? 'text-text-muted'
                : 'text-text-primary'
          }`}
        >
          {name}
        </span>
      </div>
      {score != null && (
        <span
          className={`font-mono-nums text-sm font-bold ${
            state === 'post' && isWinner
              ? 'text-text-primary'
              : state === 'post'
                ? 'text-text-muted'
                : 'text-text-primary'
          }`}
        >
          {score}
        </span>
      )}
    </div>
  );
}
