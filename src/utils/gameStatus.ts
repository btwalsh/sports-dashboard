interface StatusInfo {
  displayClock?: string;
  period?: number;
  type?: {
    shortDetail?: string;
    detail?: string;
  };
}

export function formatGameProgress(status: StatusInfo, league?: string): string {
  const detail = status.type?.shortDetail ?? status.type?.detail;

  if (league === 'mlb' || league === 'baseball') {
    return detail ?? '';
  }

  const parts: string[] = [];
  if (status.displayClock) parts.push(status.displayClock);
  if (status.period != null) parts.push(`P${status.period}`);

  return parts.join(' · ') || detail || '';
}
