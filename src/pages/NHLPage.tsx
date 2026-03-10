import { PageShell } from '../components/layout/PageShell';
import { Scoreboard } from '../components/league/Scoreboard';
import { StandingsTable } from '../components/league/StandingsTable';

export default function NHLPage() {
  return (
    <PageShell title="NHL" subtitle="National Hockey League">
      <div className="space-y-8">
        <Scoreboard sport="hockey" league="nhl" title="Today's Games" />
        <StandingsTable sport="hockey" league="nhl" />
      </div>
    </PageShell>
  );
}
