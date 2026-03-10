import { useScoreboard } from '../../hooks/useScoreboard';
import { GameCard } from '../shared/GameCard';
import { SkeletonCard } from '../shared/SkeletonCard';

interface ScoreboardProps {
  sport: string;
  league: string;
  title?: string;
}

export function Scoreboard({ sport, league, title }: ScoreboardProps) {
  const { data, isLoading, isError } = useScoreboard(sport, league);

  if (isLoading) {
    return (
      <div>
        {title && (
          <h2 className="font-display font-bold text-lg mb-4">{title}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-text-muted text-sm">Unable to load scoreboard</p>
    );
  }

  const events = data.events;

  return (
    <div>
      {title && (
        <h2 className="font-display font-bold text-lg mb-4">{title}</h2>
      )}
      {events.length === 0 ? (
        <p className="text-text-muted text-sm glass rounded-xl p-6 text-center">
          No games scheduled today
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {events.map((event) => (
            <GameCard key={event.id} event={event} leagueKey={league} />
          ))}
        </div>
      )}
    </div>
  );
}
