import type { ESPNCompetition } from '../api/types';
import type { CalendarEventProps } from '../api/types';
import { GAME_DURATION_HOURS } from '../config/leagues';

export function buildCalendarEvent(
  competition: ESPNCompetition,
  leagueKey: string
): CalendarEventProps {
  const start = new Date(competition.date);
  const durationHours = GAME_DURATION_HOURS[leagueKey] ?? 3;
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

  const home = competition.competitors.find((c) => c.homeAway === 'home');
  const away = competition.competitors.find((c) => c.homeAway === 'away');

  const title = `${away?.team.abbreviation ?? 'TBD'} @ ${home?.team.abbreviation ?? 'TBD'}`;
  const venue = competition.venue;
  const location = venue
    ? `${venue.fullName}${venue.address ? `, ${venue.address.city}, ${venue.address.state}` : ''}`
    : '';
  const broadcasts = competition.broadcasts
    ?.flatMap((b) => b.names)
    .join(', ');
  const description = [
    `${away?.team.displayName ?? ''} at ${home?.team.displayName ?? ''}`,
    leagueKey.toUpperCase(),
    broadcasts ? `TV: ${broadcasts}` : '',
  ]
    .filter(Boolean)
    .join(' | ');

  return {
    name: title,
    startDate: formatDate(start),
    startTime: formatTime(start),
    endDate: formatDate(end),
    endTime: formatTime(end),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    location,
    description,
  };
}

export function buildF1CalendarEvent(race: {
  raceName: string;
  date: string;
  time?: string;
  Circuit: { circuitName: string; Location: { locality: string; country: string } };
}): CalendarEventProps {
  const timeStr = race.time ?? '14:00:00Z';
  const start = new Date(`${race.date}T${timeStr}`);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  return {
    name: `F1: ${race.raceName}`,
    startDate: formatDate(start),
    startTime: formatTime(start),
    endDate: formatDate(end),
    endTime: formatTime(end),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    location: `${race.Circuit.circuitName}, ${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
    description: `Formula 1 - ${race.raceName}`,
  };
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-CA');
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
