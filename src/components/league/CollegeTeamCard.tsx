import { useQuery } from '@tanstack/react-query';
import { getTeam, getCollegeTeamLogoUrl } from '../../api/espn';
import type { CollegeTeamConfig } from '../../config/teams';
import type { ESPNEvent } from '../../api/types';
import { TeamLogo } from '../shared/TeamLogo';
import { SkeletonCard } from '../shared/SkeletonCard';
import { AddToCalendarIcon } from '../shared/AddToCalendarIcon';
import { buildCalendarEvent } from '../../utils/calendar';
import { Calendar } from 'lucide-react';

interface Props {
  team: CollegeTeamConfig;
}

export function CollegeTeamCard({ team }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['college-team', team.espnId],
    queryFn: () =>
      getTeam('football', 'college-football', team.espnId),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <SkeletonCard />;
  if (isError || !data) {
    return (
      <div className="glass rounded-2xl p-5">
        <p className="text-text-muted text-sm">
          Unable to load {team.name}
        </p>
      </div>
    );
  }

  const t = data.team;
  const record = t.record?.items?.[0]?.summary ?? '';
  const logo = t.logos?.[0]?.href ?? getCollegeTeamLogoUrl(team.espnId);
  const events = t.nextEvent ?? [];

  return (
    <div
      className="glass rounded-2xl p-5"
      style={
        {
          borderImage: `linear-gradient(135deg, ${team.colors.primary}40, transparent 60%) 1`,
        } as React.CSSProperties
      }
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="rounded-full p-1.5"
          style={{ background: `${team.colors.primary}30` }}
        >
          <TeamLogo src={logo} alt={team.name} size={36} />
        </div>
        <div>
          <h3 className="font-display font-bold text-base">{team.name}</h3>
          <span className="font-mono-nums text-xs text-text-secondary">
            {record}
          </span>
        </div>
      </div>

      {events.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
            <Calendar size={12} /> Schedule
          </h4>
          {events.slice(0, 5).map((event) => (
            <CollegeGameRow key={event.id} event={event} />
          ))}
        </div>
      )}

      {events.length === 0 && (
        <p className="text-text-muted text-xs">No upcoming games scheduled</p>
      )}
    </div>
  );
}

function CollegeGameRow({ event }: { event: ESPNEvent }) {
  const comp = event.competitions?.[0];
  if (!comp) return null;

  const state = event.status?.type?.state;
  const isFinal = state === 'post';
  const home = comp.competitors?.find((c) => c.homeAway === 'home');
  const away = comp.competitors?.find((c) => c.homeAway === 'away');
  const gameDate = new Date(event.date);

  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-surface/40">
      <div className="flex items-center gap-2 text-xs">
        {isFinal ? (
          <span className="text-text-secondary">
            {away?.team.abbreviation} {away?.score} - {home?.score}{' '}
            {home?.team.abbreviation}
          </span>
        ) : (
          <span className="text-text-secondary">
            vs {away?.team.abbreviation ?? home?.team.abbreviation ?? 'TBD'}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 text-xs">
        {isFinal ? (
          <span className="text-text-muted">Final</span>
        ) : (
          <>
            <span className="text-text-muted">
              {gameDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <AddToCalendarIcon
              event={buildCalendarEvent(comp, 'college-football')}
            />
          </>
        )}
      </div>
    </div>
  );
}
