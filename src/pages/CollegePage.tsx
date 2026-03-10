import { PageShell } from '../components/layout/PageShell';
import { COLLEGE_TEAMS } from '../config/teams';
import { CollegeTeamCard } from '../components/league/CollegeTeamCard';

export default function CollegePage() {
  return (
    <PageShell title="College Football" subtitle="Harvard &amp; UW Huskies">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {COLLEGE_TEAMS.map((team) => (
          <CollegeTeamCard key={team.espnId} team={team} />
        ))}
      </div>
    </PageShell>
  );
}
