import RNCalendarEvents from 'react-native-calendar-events';
import moment from 'moment';
import { decode } from 'html-entities';

interface Calendar {
  id: string;
  title: string;
  color: string;
  allowsModifications: boolean;
}

export const listCalendars = async (): Promise<Calendar[]> => {
  let permissions: string;
  let calendars: Calendar[] = [];
  try {
    console.log('Checking calendar permissions...');
    permissions = await RNCalendarEvents.checkPermissions(false);
    console.log('Current permissions:', permissions);

    if (permissions !== 'authorized') {
      console.log('Requesting calendar permissions...');
      permissions = await RNCalendarEvents.requestPermissions(false);
      console.log('Updated permissions:', permissions);
    }

    if (permissions !== 'authorized') {
      throw new Error('Zugriff auf Kalender nicht erlaubt');
    }

    console.log('Fetching calendars...');
    calendars = await RNCalendarEvents.findCalendars();
    console.log('Calendars found:', calendars);
  } catch (error) {
    console.error('Error fetching calendars:', error);
  }

  return calendars;
};

interface Event {
  title: string;
  utc_start_date: string;
  utc_end_date: string;
  venue: { venue?: string };
  description?: string;
  all_day: boolean;
}

export const addCalendarEvent = async (
  event: Event,
  calendar: Calendar,
  doneHandler?: () => void,
  errorHandler?: (error: unknown) => void
): Promise<boolean> => {
  let permissions: string;
  let createdEvent = false;
  try {
    console.log('Try to save event to calendar');
    permissions = await RNCalendarEvents.checkPermissions(false);
    if (permissions !== 'authorized') {
      permissions = await RNCalendarEvents.requestPermissions(false);
    }

    if (permissions !== 'authorized') {
      throw new Error('Zugriff auf Kalender nicht erlaubt');
    }

    const sourceDateFormat = 'YYYY-MM-DD HH:mm:ssZ';
    const targetDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSS';
    const startDate = moment(`${event.utc_start_date}Z`, sourceDateFormat).utc().format(targetDateFormat) + 'Z';
    const endDate = moment(`${event.utc_end_date}Z`, sourceDateFormat).utc().format(targetDateFormat) + 'Z';
    const location = event.venue.venue ? decode(event.venue.venue.replace(/<[^>]+>/g, '')) : '';
    const description = event.description ? decode(event.description.replace(/<[^>]+>/g, '')) : '';

    console.log(`Calender Id: ${calendar.id}`);
    console.log(`Event title: ${event.title}`);
    console.log(`Original startDate: ${event.utc_start_date}Z`);
    console.log(`Original endDate: ${event.utc_end_date}Z`);
    console.log(`Parsed startDate: ${startDate}`);
    console.log(`Parsed endDate: ${endDate}`);
    console.log(`Original Location: ${event.venue.venue}`);
    console.log(`Original Description: ${event.description}`);
    console.log(`Cleaned Location: ${location}`);
    console.log(`Cleaned Description: ${description}`);

    createdEvent = await RNCalendarEvents.saveEvent(event.title, {
      calendarId: calendar.id,
      startDate: startDate,
      endDate: endDate,
      location: location,
      notes: description,
      allDay: event.all_day,
    });
    if (doneHandler) {
      doneHandler();
    }
  } catch (e) {
    console.log('Could not save event: ' + e);
    if (errorHandler) {
      errorHandler(e);
    }
  }

  return createdEvent;
};