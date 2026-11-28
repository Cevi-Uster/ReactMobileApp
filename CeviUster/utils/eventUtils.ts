import { decode } from 'html-entities';

export type EventDateDetails = {
  day: number | string;
  month: number | string;
  year: number | string;
  hour?: number | string;
  minutes?: number | string;
};

export type EventDates = {
  start_date_details: EventDateDetails;
  end_date_details?: EventDateDetails;
  all_day?: boolean;
};

const pad = (value: number | string | undefined): string => String(Number(value ?? 0)).padStart(2, '0');

export function formatDate(d: EventDateDetails): string {
  return `${pad(d.day)}.${pad(d.month)}.${Number(d.year)}`;
}

export function formatTime(d: EventDateDetails): string {
  return `${pad(d.hour)}:${pad(d.minutes)}`;
}

const sameDay = (a: EventDateDetails, b: EventDateDetails) => formatDate(a) === formatDate(b);

/** Zeitangabe für Listen: «09:00 - 11:30» oder «Ganzer Tag». */
export function formatEventTimeRange(event: EventDates): string {
  if (event.all_day) {
    return 'Ganzer Tag';
  }
  const start = event.start_date_details;
  const end = event.end_date_details;
  if (end && end.hour !== undefined && sameDay(start, end)) {
    return `${formatTime(start)} - ${formatTime(end)}`;
  }
  return formatTime(start);
}

/** Datum und Zeit für die Detailseite. Gleiche Tage werden nur einmal gezeigt. */
export function formatEventDateTime(event: EventDates): string {
  const start = event.start_date_details;
  const end = event.end_date_details;
  const multiDay = !!end && !sameDay(start, end);

  if (event.all_day) {
    return multiDay ? `${formatDate(start)} - ${formatDate(end)}` : `${formatDate(start)}, Ganzer Tag`;
  }
  if (!end) {
    return `${formatDate(start)} ${formatTime(start)}`;
  }
  if (multiDay) {
    return `${formatDate(start)} ${formatTime(start)} - ${formatDate(end)} ${formatTime(end)}`;
  }
  return `${formatDate(start)} ${formatTime(start)} - ${formatTime(end)}`;
}

export function formatEventDescription(description: string): string {
  return decode((description || '').replace(/<(.|\n)*?>/g, ''));
}

/** Heutiges Datum als «YYYY-MM-DD 00:00:00» für die Events-API. */
export function todayStart(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} 00:00:00`;
}
