import RNCalendarEvents from 'react-native-calendar-events';
import { decode } from 'html-entities';

export interface Calendar {
  id: string;
  title: string;
  color: string;
  allowsModifications: boolean;
}

export interface CalendarEventInput {
  title: string;
  utc_start_date: string;
  utc_end_date: string;
  venue?: { venue?: string };
  description?: string;
  all_day?: boolean;
}

const stripHtml = (text: string) => decode(text.replace(/<[^>]+>/g, ''));

async function ensureCalendarPermission(): Promise<void> {
  let permissions = await RNCalendarEvents.checkPermissions(false);
  if (permissions !== 'authorized') {
    permissions = await RNCalendarEvents.requestPermissions(false);
  }
  if (permissions !== 'authorized') {
    throw new Error('Zugriff auf Kalender nicht erlaubt');
  }
}

export const listCalendars = async (): Promise<Calendar[]> => {
  await ensureCalendarPermission();
  return (await RNCalendarEvents.findCalendars()) as Calendar[];
};

// Die Tribe-API liefert UTC als «YYYY-MM-DD HH:mm:ss».
const utcToIso = (utc: string) => new Date(`${utc.replace(' ', 'T')}Z`).toISOString();

export const addCalendarEvent = async (
  event: CalendarEventInput,
  calendar: Calendar,
  doneHandler?: () => void,
  errorHandler?: (error: Error) => void
): Promise<boolean> => {
  try {
    await ensureCalendarPermission();

    const eventId = await RNCalendarEvents.saveEvent(decode(event.title), {
      calendarId: calendar.id,
      startDate: utcToIso(event.utc_start_date),
      endDate: utcToIso(event.utc_end_date),
      location: event.venue?.venue ? stripHtml(event.venue.venue) : '',
      notes: event.description ? stripHtml(event.description) : '',
      allDay: !!event.all_day,
    });
    doneHandler?.();
    return !!eventId;
  } catch (e) {
    errorHandler?.(e instanceof Error ? e : new Error(String(e)));
    return false;
  }
};
