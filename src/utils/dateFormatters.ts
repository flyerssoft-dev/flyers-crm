import dayjs from 'dayjs';

/**
 * Formats a date into the given format.
 * @param date - A dayjs instance, string, or undefined
 * @param format - Desired output format (default: 'YYYY-MM-DD')
 * @returns A formatted date string or null
 */
export const formatDate = (
  date?: dayjs.Dayjs | string | null,
  format: string = 'YYYY-MM-DD',
  isoWithoutTimezone: boolean = false,
): string | null => {
  if (!date) return null;
  const parsed = typeof date === 'string' || date instanceof Date ? dayjs(date) : date;

  if (!parsed.isValid()) return null;

  if (isoWithoutTimezone) {
    const year = parsed.year();
    const month = `${parsed.month() + 1}`.padStart(2, '0');
    const day = `${parsed.date()}`.padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00.000Z`;
  }

  return parsed.format(format);
};

// functions to convert date to string and string to date
export const dateformat = (dateString: string): string => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
