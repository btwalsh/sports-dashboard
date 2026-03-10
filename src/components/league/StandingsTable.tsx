import { useStandings } from '../../hooks/useStandings';
import { TeamLogo } from '../shared/TeamLogo';
import { FAVORITE_TEAMS } from '../../config/teams';

interface Props {
  sport: string;
  league: string;
}

export function StandingsTable({ sport, league }: Props) {
  const { data, isLoading, isError } = useStandings(sport, league);
  const favoriteIds = new Set(
    FAVORITE_TEAMS.filter((t) => t.league === league).map((t) => t.espnId)
  );

  if (isLoading) {
    return (
      <div className="glass rounded-2xl p-6 animate-pulse">
        <div className="h-5 w-32 bg-surface-overlay rounded mb-4" />
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-4 bg-surface-overlay rounded mb-2"
            style={{ width: `${80 - i * 5}%` }}
          />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-text-muted text-sm">Unable to load standings</p>
    );
  }

  return (
    <div className="space-y-6">
      {data.children.map((division) => (
        <div key={division.name} className="glass rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border-subtle/30">
            <h3 className="font-display font-bold text-sm">
              {division.name}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-2 font-semibold">#</th>
                  <th className="text-left px-4 py-2 font-semibold">Team</th>
                  {getStatHeaders(league).map((h) => (
                    <th
                      key={h}
                      className="text-center px-3 py-2 font-semibold"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {division.standings.entries.map((entry, idx) => {
                  const isFav = favoriteIds.has(entry.team.id);
                  return (
                    <tr
                      key={entry.team.id}
                      className={`border-t border-border-subtle/20 transition-colors ${
                        isFav
                          ? 'bg-accent/8 text-accent'
                          : 'hover:bg-surface-overlay/30'
                      }`}
                    >
                      <td className="px-4 py-2.5 font-mono-nums text-text-muted text-xs">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <TeamLogo
                            src={entry.team.logos?.[0]?.href ?? ''}
                            alt={entry.team.abbreviation}
                            size={20}
                          />
                          <span
                            className={`font-medium ${
                              isFav ? 'text-accent' : 'text-text-primary'
                            }`}
                          >
                            {entry.team.displayName}
                          </span>
                        </div>
                      </td>
                      {getStatKeys(league).map((key) => {
                        const stat = entry.stats.find((s) => s.name === key);
                        return (
                          <td
                            key={key}
                            className="text-center px-3 py-2.5 font-mono-nums text-xs"
                          >
                            {stat?.displayValue ?? '-'}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

function getStatHeaders(league: string): string[] {
  switch (league) {
    case 'nhl':
      return ['GP', 'W', 'L', 'OTL', 'PTS'];
    case 'nfl':
      return ['W', 'L', 'T', 'PCT'];
    case 'mlb':
      return ['W', 'L', 'PCT', 'GB'];
    default:
      return ['W', 'L'];
  }
}

function getStatKeys(league: string): string[] {
  switch (league) {
    case 'nhl':
      return ['gamesPlayed', 'wins', 'losses', 'otLosses', 'points'];
    case 'nfl':
      return ['wins', 'losses', 'ties', 'winPercent'];
    case 'mlb':
      return ['wins', 'losses', 'winPercent', 'gamesBehind'];
    default:
      return ['wins', 'losses'];
  }
}
