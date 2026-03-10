import { PageShell } from '../components/layout/PageShell';
import { Scoreboard } from '../components/league/Scoreboard';
import { StandingsTable } from '../components/league/StandingsTable';

export default function MLBPage() {
  return (
    <PageShell title="MLB" subtitle="Major League Baseball">
      <div className="space-y-8">
        <Scoreboard sport="baseball" league="mlb" title="Today's Games" />
        <StandingsTable sport="baseball" league="mlb" />
      </div>
    </PageShell>
  );
}
