import { AddToCalendarButton } from 'add-to-calendar-button-react';
import type { CalendarEventProps } from '../../api/types';

interface Props {
  event: CalendarEventProps;
}

export function AddToCalendarIcon({ event }: Props) {
  return (
    <div className="inline-flex [&>div]:!shadow-none">
      <AddToCalendarButton
        name={event.name}
        startDate={event.startDate}
        startTime={event.startTime}
        endDate={event.endDate}
        endTime={event.endTime}
        timeZone={event.timeZone}
        location={event.location}
        description={event.description}
        options={['Apple', 'Google', 'iCal', 'Outlook.com']}
        buttonStyle="text"
        trigger="click"
        size="3"
        lightMode="dark"
        styleLight="--btn-background: transparent; --btn-border: transparent; --btn-text: #94a3b8; --btn-hover-background: rgba(51,65,85,0.5); --btn-hover-text: #f1f5f9; --list-background: #1e293b; --list-text: #f1f5f9; --list-hover-background: #334155;"
      />
    </div>
  );
}
