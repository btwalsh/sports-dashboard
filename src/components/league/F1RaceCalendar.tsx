import { useF1Schedule, useF1LastRace } from '../../hooks/useF1Data';
import { useF1ConstructorStandings } from '../../hooks/useF1Data';
import { AddToCalendarIcon } from '../shared/AddToCalendarIcon';
import { buildF1CalendarEvent } from '../../utils/calendar';
import { MapPin, Flag, Clock, Trophy } from 'lucide-react';

export function F1RaceCalendar() {
  const { data: races, isLoading } = useF1Schedule();
  const { data: lastRace } = useF1LastRace();
  const { data: constructors } = useF1ConstructorStandings();

  if (isLoading) {
    return (
      <div className="glass rounded-2xl p-6 animate-pulse">
        <div className="h-5 w-40 bg-surface-overlay rounded mb-4" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-surface-overlay rounded mb-2" />
        ))}
      </div>
    );
  }

  if (!races) {
    return (
      <p className="text-text-muted text-sm">Race calendar not available</p>
    );
  }

  const now = new Date();
  const upcoming = races.filter(
    (r) => new Date(r.date) >= new Date(now.toDateString())
  );
  const past = races.filter(
    (r) => new Date(r.date) < new Date(now.toDateString())
  );

  return (
    <div className="space-y-6">
      {lastRace && (
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Flag size={16} className="text-accent" />
            <h3 className="font-display font-bold text-sm">
              Last Race: {lastRace.raceName}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {lastRace.Results.slice(0, 3).map((r, i) => (
              <div
                key={r.Driver.code}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface/50"
              >
                <span
                  className={`font-mono-nums font-bold text-sm ${
                    i === 0
                      ? 'text-amber-400'
                      : i === 1
                        ? 'text-slate-300'
                        : 'text-amber-700'
                  }`}
                >
                  P{r.position}
                </span>
                <span className="text-sm font-medium">
                  {r.Driver.givenName} {r.Driver.familyName}
                </span>
                {r.Time?.time && (
                  <span className="text-xs text-text-muted ml-auto">
                    {r.Time.time}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {constructors && constructors.length > 0 && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border-subtle/30 flex items-center gap-2">
            <Trophy size={16} className="text-amber-400" />
            <h3 className="font-display font-bold text-sm">
              Constructor Championship
            </h3>
          </div>
          <div className="divide-y divide-border-subtle/20">
            {constructors.map((c) => (
              <div
                key={c.Constructor.constructorId}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono-nums text-xs text-text-muted w-6">
                    {c.position}
                  </span>
                  <span className="text-sm font-medium">
                    {c.Constructor.name}
                  </span>
                </div>
                <span className="font-mono-nums font-bold text-sm text-accent">
                  {c.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border-subtle/30">
          <h3 className="font-display font-bold text-sm">
            {upcoming.length > 0 ? 'Upcoming Races' : 'Season Complete'}
          </h3>
        </div>
        <div className="divide-y divide-border-subtle/20">
          {upcoming.map((race) => {
            const raceDate = new Date(race.date);
            return (
              <div
                key={race.round}
                className="flex items-center justify-between px-4 py-3 hover:bg-surface-overlay/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[3rem]">
                    <div className="font-mono-nums text-xs text-text-muted">
                      R{race.round}
                    </div>
                    <div className="font-mono-nums text-sm font-bold">
                      {raceDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {race.raceName}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <MapPin size={10} />
                      {race.Circuit.Location.locality},{' '}
                      {race.Circuit.Location.country}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {race.time && (
                    <span className="flex items-center gap-1 text-xs text-text-secondary">
                      <Clock size={10} />
                      {new Date(
                        `${race.date}T${race.time}`
                      ).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                  <AddToCalendarIcon event={buildF1CalendarEvent(race)} />
                </div>
              </div>
            );
          })}
          {past.length > 0 && (
            <details className="group">
              <summary className="px-4 py-3 text-xs text-text-muted cursor-pointer hover:text-text-secondary">
                {past.length} completed race{past.length !== 1 ? 's' : ''}
              </summary>
              {past.reverse().map((race) => (
                <div
                  key={race.round}
                  className="flex items-center gap-4 px-4 py-2 text-text-muted"
                >
                  <span className="font-mono-nums text-xs min-w-[3rem] text-center">
                    R{race.round}
                  </span>
                  <span className="text-xs">{race.raceName}</span>
                  <span className="text-xs ml-auto">
                    {new Date(race.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              ))}
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
