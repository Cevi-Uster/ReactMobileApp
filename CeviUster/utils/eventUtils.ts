import { decode } from 'html-entities';

export function formatEventDateTime(event: {
  start_date_details: { day: number; month: number; year: number; hour?: number; minutes?: number };
  end_date_details?: { day: number; month: number; year: number; hour?: number; minutes?: number };
  all_day?: boolean;
}): string {
  let dateTime = `${event.start_date_details.day}.${event.start_date_details.month}.${event.start_date_details.year}`;

  if (!event.all_day) {
    dateTime += ` ${event.start_date_details.hour}:${event.start_date_details.minutes}`;
  }

  if (event.end_date_details) {
    dateTime += ` - ${event.end_date_details.day}.${event.end_date_details.month}.${event.end_date_details.year}`;
    if (!event.all_day) {
      dateTime += ` ${event.end_date_details.hour}:${event.end_date_details.minutes}`;
    }
  }

  return dateTime;
}

export function formatEventDescription(description: string): string {
  return decode((description || '').replace(/<(.|\n)*?>/g, ''));
}