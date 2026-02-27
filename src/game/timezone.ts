export const MELBOURNE_TIMEZONE = 'Australia/Melbourne';

const DATE_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: MELBOURNE_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

export const getMelbourneDateString = (date: Date = new Date()): string => {
  const parts = DATE_FORMATTER.formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    throw new Error('Unable to compute Melbourne date.');
  }

  return `${year}-${month}-${day}`;
};

export interface DateParts {
  year: number;
  month: number;
  day: number;
}

export const parseDateKey = (dateKey: string): DateParts => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) {
    throw new Error(`Invalid date key: ${dateKey}`);
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3])
  };
};

const toSerialDay = (dateKey: string): number => {
  const { year, month, day } = parseDateKey(dateKey);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
};

export const getPuzzleNumberForDate = (
  dateKey: string,
  epochDateKey: string = '2026-01-01'
): number => {
  return toSerialDay(dateKey) - toSerialDay(epochDateKey);
};
