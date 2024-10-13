import RNCalendarEvents from 'react-native-calendar-events';
import moment from 'moment';
import { decode } from 'html-entities';

export const listCalendars = async () => {
  let permissions;
  let calendars = [];
  try {
    permissions = await RNCalendarEvents.checkPermissions((readOnly = false));
    if (permissions !== 'authorized') {
      permissions = await RNCalendarEvents.requestPermissions((readOnly = false));
    }

    if (permissions !== 'authorized') {
      throw 'Zugriff auf Kalender nicht erlaubt';
    }

    calendars = await RNCalendarEvents.findCalendars();
  } catch {}

  return calendars;
};

export const addCalendarEvent = async (event, calendar, doneHandler, errorHandler) => {
  let permissions;
  let createdEvent = false;
  try {
    console.log('Try to save event to calendar');
    permissions = await RNCalendarEvents.checkPermissions((readOnly = false));
    if (permissions !== 'authorized') {
      permissions = await RNCalendarEvents.requestPermissions((readOnly = false));
    }

    if (permissions !== 'authorized') {
      throw 'Zugriff auf Kalender nicht erlaubt';
    }

    var sourceDateFormat = 'YYYY-MM-DD HH:mm:ssZ';
    var targetDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSS';
    var startDate = moment(`${event.utc_start_date}Z`, sourceDateFormat).utc().format(targetDateFormat) + 'Z';
    var endDate = moment(`${event.utc_end_date}Z`, sourceDateFormat).utc().format(targetDateFormat) + 'Z';
    var location = typeof(event.venue.venue) != 'undefined' ? decode(event.venue.venue.replace(/<[^>]+>/g, '')) : '';
    var description = typeof(event.description) != 'undefined' ? decode(event.description.replace(/<[^>]+>/g, '')) : '';

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

    createdEvent = await  RNCalendarEvents.saveEvent(event.title, {
        calendarId: calendar.id,
        startDate: startDate,
        endDate: endDate,
        location: location,
        notes: description,
        allDay: event.all_day,
      });
    if (typeof(doneHandler) != 'undefined'){
      doneHandler();
    }
  } catch (e) {
    console.log('Could not save event: ' + e);
    if (typeof(errorHandler) != 'undefined'){
      errorHandler(e);
    }
  }

  return createdEvent;
};