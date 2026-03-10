import { useState, useEffect, useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { getTeam } from '../../api/espn';
import { FAVORITE_TEAMS } from '../../config/teams';
import type { TeamConfig } from '../../config/teams';
import { TeamLogo } from '../shared/TeamLogo';
import { Timer } from 'lucide-react';

interface SoonestGame {
  date: Date;
  teamName: string;
  opponent: string;
  logo: string;
  teamConfig: TeamConfig;
}

export function NextGameCountdown() {
  const results = useQueries({
    queries: FAVORITE_TEAMS.map((t) => ({
      queryKey: ['team', t.league, t.espnId],
      queryFn: () => getTeam(t.sport, t.league, t.espnId),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const soonest = useMemo<SoonestGame | null>(() => {
    const now = Date.now();
    let best: SoonestGame | null = null;

    results.forEach((r, i) => {
      if (!r.data) return;
      const team = r.data.team;
      const events = team.nextEvent ?? [];
      for (const ev of events) {
        const d = new Date(ev.date);
        if (d.getTime() <= now) continue;
        if (!best || d < best.date) {
          const comp = ev.competitions?.[0];
          const opp = comp?.competitors.find((c) => c.team.id !== team.id);
          best = {
            date: d,
            teamName: team.shortDisplayName,
            opponent: opp?.team.abbreviation ?? 'TBD',
            logo: team.logos?.[0]?.href ?? '',
            teamConfig: FAVORITE_TEAMS[i],
          };
        }
      }
    });

    return best;
  }, [results]);

  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!soonest) return null;

  const diff = soonest.date.getTime() - Date.now();
  if (diff <= 0) return null;

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return (
    <div
      className="glass rounded-2xl p-4 mb-6"
      style={
        {
          borderImage: `linear-gradient(90deg, ${soonest.teamConfig.colors.accent}40, transparent) 1`,
        } as React.CSSProperties
      }
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Timer size={18} className="text-accent" />
          <span className="text-sm text-text-secondary">Next game:</span>
          <div className="flex items-center gap-2">
            <TeamLogo src={soonest.logo} alt={soonest.teamName} size={24} />
            <span className="font-display font-bold text-sm">
              {soonest.teamName}
            </span>
            <span className="text-text-muted text-sm">vs</span>
            <span className="font-display font-semibold text-sm">
              {soonest.opponent}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 font-mono-nums text-sm">
          {days > 0 && <CountdownUnit value={days} label="d" />}
          <CountdownUnit value={hours} label="h" />
          <CountdownUnit value={minutes} label="m" />
          <CountdownUnit value={seconds} label="s" />
        </div>
      </div>
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-0.5">
      <span className="font-bold text-base text-accent">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs text-text-muted">{label}</span>
    </div>
  );
}
