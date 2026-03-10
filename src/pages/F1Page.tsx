import { PageShell } from '../components/layout/PageShell';
import { F1DriverStandings } from '../components/league/F1DriverStandings';
import { F1RaceCalendar } from '../components/league/F1RaceCalendar';

export default function F1Page() {
  return (
    <PageShell title="Formula 1" subtitle="FIA Formula One World Championship">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <F1DriverStandings />
        </div>
        <div>
          <F1RaceCalendar />
        </div>
      </div>
    </PageShell>
  );
}
