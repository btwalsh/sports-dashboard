import { Link } from 'react-router-dom';
import { useTeamData } from '../../hooks/useTeamData';
import type { TeamConfig } from '../../config/teams';
import type { ESPNEvent } from '../../api/types';
import { TeamLogo } from '../shared/TeamLogo';
import { SkeletonCard } from '../shared/SkeletonCard';
import { AddToCalendarIcon } from '../shared/AddToCalendarIcon';
import { buildCalendarEvent } from '../../utils/calendar';
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Calendar,
} from 'lucide-react';
import { formatGameProgress } from '../../utils/gameStatus';

interface Props {
  team: TeamConfig;
  style?: React.CSSProperties;
}

export function FavoriteTeamCard({ team, style }: Props) {
  const { data, isLoading, isError } = useTeamData(team);

  if (isLoading) return <SkeletonCard />;

  if (isError || !data) {
    return (
      <div className="glass rounded-2xl p-5">
        <p className="text-text-muted text-sm">
          Unable to load {team.name} data
        </p>
      </div>
    );
  }

  const t = data.team;
  const record = t.record?.items?.[0]?.summary ?? '';
  const logoUrl = t.logos?.[0]?.href ?? '';
  const nextEvents = t.nextEvent ?? [];
  const standingSummary = t.standingSummary ?? '';

  return (
    <div
      className="glass rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group"
      style={
        {
          ...style,
          '--team-color': team.colors.accent,
          borderImage: `linear-gradient(135deg, ${team.colors.accent}40, transparent 60%) 1`,
        } as React.CSSProperties
      }
    >
      <Link
        to={`/team/${team.sport}/${team.league}/${team.espnId}`}
        className="block"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="rounded-full p-1.5"
              style={{ background: `${team.colors.primary}30` }}
            >
              <TeamLogo src={logoUrl} alt={team.name} size={36} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base leading-tight">
                {t.shortDisplayName}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono-nums text-xs text-text-secondary">
                  {record}
                </span>
                {standingSummary && (
                  <span className="text-xs text-text-muted">
                    &middot; {standingSummary}
                  </span>
                )}
              </div>
            </div>
          </div>
          <ChevronRight
            size={16}
            className="text-text-muted group-hover:text-text-secondary transition-colors"
          />
        </div>
      </Link>

      {nextEvents.length > 0 && (
        <div className="space-y-2 mt-3">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
            <Calendar size={12} /> Upcoming
          </h4>
          {nextEvents.slice(0, 3).map((event) => (
            <UpcomingGameRow
              key={event.id}
              event={event}
              leagueKey={team.league}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function UpcomingGameRow({
  event,
  leagueKey,
}: {
  event: ESPNEvent;
  leagueKey: string;
}) {
  const comp = event.competitions?.[0];
  if (!comp) return null;

  const state = event.status?.type?.state;
  const isLive = state === 'in';
  const isFinal = state === 'post';

  const home = comp.competitors?.find((c) => c.homeAway === 'home');
  const away = comp.competitors?.find((c) => c.homeAway === 'away');

  const gameDate = new Date(event.date);
  const dateStr = gameDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const timeStr = gameDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-surface/40 hover:bg-surface-overlay/30 transition-colors">
      <div className="flex items-center gap-2 min-w-0">
        {isLive && (
          <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse shrink-0" />
        )}
        {isFinal && (
          home?.winner ? (
            <TrendingUp size={14} className="text-win shrink-0" />
          ) : (
            <TrendingDown size={14} className="text-loss shrink-0" />
          )
        )}
        <span className="text-xs text-text-secondary truncate">
          {isFinal
            ? `${away?.team.abbreviation} ${away?.score} - ${home?.score} ${home?.team.abbreviation}`
            : `vs ${away?.team.abbreviation ?? home?.team.abbreviation ?? 'TBD'}`}
        </span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {isLive ? (
          <span className="text-xs font-semibold text-live">
            {formatGameProgress(event.status, leagueKey)}
          </span>
        ) : isFinal ? (
          <span className="text-xs text-text-muted">Final</span>
        ) : (
          <>
            <span className="text-xs text-text-muted">{dateStr} {timeStr}</span>
            <AddToCalendarIcon
              event={buildCalendarEvent(comp, leagueKey)}
            />
          </>
        )}
      </div>
    </div>
  );
}
