import { useStandings } from '../../hooks/useStandings';
import { FAVORITE_TEAMS } from '../../config/teams';
import { TeamLogo } from '../shared/TeamLogo';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const leagueConfigs = [
  { key: 'nhl', sport: 'hockey', league: 'nhl', label: 'NHL' },
  { key: 'nfl', sport: 'football', league: 'nfl', label: 'NFL' },
  { key: 'mlb', sport: 'baseball', league: 'mlb', label: 'MLB' },
] as const;

export function QuickStandings() {
  return (
    <div className="mt-8">
      <h2 className="font-display font-bold text-lg mb-4">Standings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leagueConfigs.map((cfg) => (
          <LeagueStandingsWidget
            key={cfg.key}
            sport={cfg.sport}
            league={cfg.league}
            label={cfg.label}
          />
        ))}
      </div>
    </div>
  );
}

function LeagueStandingsWidget({
  sport,
  league,
  label,
}: {
  sport: string;
  league: string;
  label: string;
}) {
  const { data, isLoading } = useStandings(sport, league);
  const favoriteIds = new Set(
    FAVORITE_TEAMS.filter((t) => t.league === league).map((t) => t.espnId)
  );

  if (isLoading) {
    return (
      <div className="glass rounded-2xl p-4 animate-pulse">
        <div className="h-4 w-16 bg-surface-overlay rounded mb-3" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-3 bg-surface-overlay rounded" />
          ))}
        </div>
      </div>
    );
  }

  const divisions = data?.children ?? [];

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-sm">{label}</h3>
        <Link
          to={`/${league}`}
          className="text-xs text-accent flex items-center gap-0.5 hover:underline"
        >
          Full <ChevronRight size={12} />
        </Link>
      </div>
      <div className="space-y-3">
        {divisions.slice(0, 2).map((div) => (
          <div key={div.name}>
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              {div.name}
            </p>
            <div className="space-y-1">
              {div.standings.entries.slice(0, 5).map((entry) => {
                const isFav = favoriteIds.has(entry.team.id);
                const wins =
                  entry.stats.find((s) => s.name === 'wins')?.displayValue ??
                  entry.stats.find((s) => s.name === 'overall')
                    ?.displayValue ??
                  '';
                const losses =
                  entry.stats.find((s) => s.name === 'losses')?.displayValue ??
                  '';
                const pts =
                  entry.stats.find((s) => s.name === 'points')?.displayValue;
                const record = pts ? `${pts} pts` : `${wins}-${losses}`;

                return (
                  <div
                    key={entry.team.id}
                    className={`flex items-center justify-between py-1 px-2 rounded-md text-xs ${
                      isFav
                        ? 'bg-accent/10 text-accent font-semibold'
                        : 'text-text-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TeamLogo
                        src={entry.team.logos?.[0]?.href ?? ''}
                        alt={entry.team.abbreviation}
                        size={16}
                      />
                      <span>{entry.team.abbreviation}</span>
                    </div>
                    <span className="font-mono-nums">{record}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
