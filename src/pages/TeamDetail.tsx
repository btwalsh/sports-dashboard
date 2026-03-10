import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTeam } from '../api/espn';
import { PageShell } from '../components/layout/PageShell';
import { TeamSchedule } from '../components/team/TeamSchedule';
import { TeamNewsFeed } from '../components/team/TeamNewsFeed';
import { TeamLogo } from '../components/shared/TeamLogo';
import { FAVORITE_TEAMS } from '../config/teams';
import { ArrowLeft } from 'lucide-react';

export default function TeamDetail() {
  const { sport, league, teamId } = useParams<{
    sport: string;
    league: string;
    teamId: string;
  }>();

  const { data, isLoading } = useQuery({
    queryKey: ['team', league, teamId],
    queryFn: () => getTeam(sport!, league!, teamId!),
    enabled: !!sport && !!league && !!teamId,
    staleTime: 5 * 60 * 1000,
  });

  const teamConfig = FAVORITE_TEAMS.find(
    (t) => t.espnId === teamId && t.league === league
  );

  if (isLoading || !sport || !league || !teamId) {
    return (
      <PageShell title="Loading...">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-surface-overlay rounded-2xl" />
          <div className="h-64 bg-surface-overlay rounded-2xl" />
        </div>
      </PageShell>
    );
  }

  const t = data?.team;
  const name = t?.displayName ?? 'Team';
  const record = t?.record?.items?.[0]?.summary ?? '';
  const logo = t?.logos?.[0]?.href ?? '';

  return (
    <PageShell title={name} subtitle={record}>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div
          className="rounded-full p-2"
          style={{
            background: teamConfig
              ? `${teamConfig.colors.primary}30`
              : 'rgba(51,65,85,0.3)',
          }}
        >
          <TeamLogo src={logo} alt={name} size={56} />
        </div>
        <div>
          <h2 className="font-display font-extrabold text-2xl">{name}</h2>
          {record && (
            <p className="font-mono-nums text-text-secondary">{record}</p>
          )}
          {t?.standingSummary && (
            <p className="text-sm text-text-muted mt-1">
              {t.standingSummary}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="font-display font-bold text-lg mb-4">Schedule</h3>
          <TeamSchedule sport={sport} league={league} teamId={teamId} />
        </div>
        <div>
          <TeamNewsFeed sport={sport} league={league} teamId={teamId} />
        </div>
      </div>
    </PageShell>
  );
}
