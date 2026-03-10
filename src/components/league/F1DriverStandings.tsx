import { useF1DriverStandings } from '../../hooks/useF1Data';
import { Trophy } from 'lucide-react';

export function F1DriverStandings() {
  const { data, isLoading } = useF1DriverStandings();

  if (isLoading) {
    return (
      <div className="glass rounded-2xl p-6 animate-pulse">
        <div className="h-5 w-40 bg-surface-overlay rounded mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-surface-overlay rounded mb-2" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-text-muted text-sm">
        Driver standings not yet available
      </p>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border-subtle/30 flex items-center gap-2">
        <Trophy size={16} className="text-amber-400" />
        <h3 className="font-display font-bold text-sm">
          Driver Championship
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-2 font-semibold">Pos</th>
              <th className="text-left px-4 py-2 font-semibold">Driver</th>
              <th className="text-left px-4 py-2 font-semibold">Team</th>
              <th className="text-center px-3 py-2 font-semibold">Wins</th>
              <th className="text-center px-3 py-2 font-semibold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr
                key={d.Driver.driverId}
                className="border-t border-border-subtle/20 hover:bg-surface-overlay/30 transition-colors"
              >
                <td className="px-4 py-2.5 font-mono-nums text-text-muted text-xs">
                  {d.position}
                </td>
                <td className="px-4 py-2.5 font-medium">
                  {d.Driver.givenName} {d.Driver.familyName}
                </td>
                <td className="px-4 py-2.5 text-text-secondary text-xs">
                  {d.Constructors[0]?.name ?? '-'}
                </td>
                <td className="text-center px-3 py-2.5 font-mono-nums text-xs">
                  {d.wins}
                </td>
                <td className="text-center px-3 py-2.5 font-mono-nums font-bold text-accent">
                  {d.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
