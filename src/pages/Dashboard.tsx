import { FAVORITE_TEAMS } from '../config/teams';
import { FavoriteTeamCard } from '../components/dashboard/FavoriteTeamCard';
import { LiveGameBanner } from '../components/dashboard/LiveGameBanner';
import { NextGameCountdown } from '../components/dashboard/NextGameCountdown';
import { QuickStandings } from '../components/dashboard/QuickStandings';
import { PageShell } from '../components/layout/PageShell';

export default function Dashboard() {
  const now = new Date();
  const greeting = getGreeting(now.getHours());
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <PageShell title={greeting} subtitle={dateStr}>
      <LiveGameBanner />
      <NextGameCountdown />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FAVORITE_TEAMS.map((team) => (
          <FavoriteTeamCard key={`${team.league}-${team.espnId}`} team={team} />
        ))}
      </div>

      <QuickStandings />
    </PageShell>
  );
}

function getGreeting(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
