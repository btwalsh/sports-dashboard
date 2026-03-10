import { PageShell } from '../components/layout/PageShell';
import { Scoreboard } from '../components/league/Scoreboard';
import { StandingsTable } from '../components/league/StandingsTable';

export default function NFLPage() {
  return (
    <PageShell title="NFL" subtitle="National Football League">
      <div className="space-y-8">
        <Scoreboard sport="football" league="nfl" title="This Week's Games" />
        <StandingsTable sport="football" league="nfl" />
      </div>
    </PageShell>
  );
}
