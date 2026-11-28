import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatEventDateTime, formatEventTimeRange, todayStart } from './eventUtils.ts';

const d = (day: number, month: number, year: number, hour?: number, minutes?: number) => ({
  day,
  month,
  year,
  hour,
  minutes,
});

test('Datum und Zeit mit führenden Nullen, gleicher Tag nur einmal', () => {
  const event = { start_date_details: d(1, 2, 2026, 9, 5), end_date_details: d(1, 2, 2026, 11, 0) };
  assert.equal(formatEventDateTime(event), '01.02.2026 09:05 - 11:00');
  assert.equal(formatEventTimeRange(event), '09:05 - 11:00');
});

test('mehrtägiger Anlass zeigt beide Daten', () => {
  const event = { start_date_details: d(1, 2, 2026, 9, 0), end_date_details: d(3, 2, 2026, 16, 30) };
  assert.equal(formatEventDateTime(event), '01.02.2026 09:00 - 03.02.2026 16:30');
});

test('ganztägig', () => {
  const single = { all_day: true, start_date_details: d(5, 3, 2026), end_date_details: d(5, 3, 2026, 23, 59) };
  assert.equal(formatEventDateTime(single), '05.03.2026, Ganzer Tag');
  assert.equal(formatEventTimeRange(single), 'Ganzer Tag');
  const multi = { all_day: true, start_date_details: d(5, 3, 2026), end_date_details: d(7, 3, 2026) };
  assert.equal(formatEventDateTime(multi), '05.03.2026 - 07.03.2026');
});

test('Strings der API werden akzeptiert', () => {
  const event = {
    start_date_details: { day: '09', month: '12', year: '2026', hour: '08', minutes: '05' },
  };
  assert.equal(formatEventDateTime(event), '09.12.2026 08:05');
});

test('todayStart', () => {
  assert.equal(todayStart(new Date(2026, 0, 5, 13, 45)), '2026-01-05 00:00:00');
});
