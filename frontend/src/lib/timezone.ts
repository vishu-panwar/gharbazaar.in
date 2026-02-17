/**
 * Timezone System
 * 
 * Provides timezone-aware date formatting and conversion utilities.
 * Uses date-fns-tz for robust timezone handling.
 */

import { format, formatDistance, formatRelative, parseISO } from 'date-fns';
import { formatInTimeZone, toDate, fromZonedTime, toZonedTime } from 'date-fns-tz';
import { enIN, enUS, hi } from 'date-fns/locale';

// Common timezones
export const COMMON_TIMEZONES = [
  { value: 'Asia/Kolkata', label: 'India (IST)', offset: '+05:30' },
  { value: 'America/New_York', label: 'New York (EST/EDT)', offset: '-05:00/-04:00' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', offset: '-08:00/-07:00' },
  { value: 'Europe/London', label: 'London (GMT/BST)', offset: '+00:00/+01:00' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)', offset: '+01:00/+02:00' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', offset: '+04:00' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', offset: '+08:00' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: '+09:00' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', offset: '+10:00/+11:00' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)', offset: '+12:00/+13:00' },
] as const;

export type TimezoneValue = typeof COMMON_TIMEZONES[number]['value'];

// Locale mapping
const LOCALE_MAP = {
  en: enUS,
  hi: hi,
  mr: enIN, // Marathi uses Indian English locale
};

/**
 * Get user's detected timezone
 */
export function getDetectedTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
  } catch {
    return 'Asia/Kolkata';
  }
}

/**
 * Format date in user's timezone
 */
export function formatInUserTimezone(
  date: string | Date | number,
  formatStr: string = 'PPP p',
  timezone?: string,
  locale: 'en' | 'hi' | 'mr' = 'en'
): string {
  try {
    const tz = timezone || getDetectedTimezone();
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    const localeObj = LOCALE_MAP[locale];

    return formatInTimeZone(dateObj, tz, formatStr, { locale: localeObj });
  } catch (error) {
    console.error('Error formatting date in timezone:', error);
    return 'Invalid date';
  }
}

/**
 * Format date relatively (e.g., "2 hours ago")
 */
export function formatRelativeDate(
  date: string | Date | number,
  baseDate: Date = new Date(),
  locale: 'en' | 'hi' | 'mr' = 'en'
): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    const localeObj = LOCALE_MAP[locale];

    return formatRelative(dateObj, baseDate, { locale: localeObj });
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return 'Invalid date';
  }
}

/**
 * Format date as distance (e.g., "2 hours ago", "in 3 days")
 */
export function formatDateDistance(
  date: string | Date | number,
  baseDate: Date = new Date(),
  options?: { addSuffix?: boolean },
  locale: 'en' | 'hi' | 'mr' = 'en'
): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    const localeObj = LOCALE_MAP[locale];

    return formatDistance(dateObj, baseDate, { 
      ...options,
      locale: localeObj,
      addSuffix: options?.addSuffix ?? true,
    });
  } catch (error) {
    console.error('Error formatting date distance:', error);
    return 'Invalid date';
  }
}

/**
 * Convert UTC date to user's timezone
 */
export function utcToUserTimezone(
  utcDate: string | Date,
  timezone?: string
): Date {
  try {
    const tz = timezone || getDetectedTimezone();
    const dateObj = typeof utcDate === 'string' ? parseISO(utcDate) : utcDate;
    return toZonedTime(dateObj, tz);
  } catch (error) {
    console.error('Error converting UTC to timezone:', error);
    return new Date();
  }
}

/**
 * Convert user's timezone date to UTC
 */
export function userTimezoneToUTC(
  localDate: Date,
  timezone?: string
): Date {
  try {
    const tz = timezone || getDetectedTimezone();
    return fromZonedTime(localDate, tz);
  } catch (error) {
    console.error('Error converting timezone to UTC:', error);
    return localDate;
  }
}

/**
 * Format date for API (ISO 8601 in UTC)
 */
export function formatForAPI(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj.toISOString();
  } catch (error) {
    console.error('Error formatting date for API:', error);
    return new Date().toISOString();
  }
}

/**
 * Common date format presets
 */
export const DATE_FORMATS = {
  full: 'PPP p', // e.g., "April 29, 2023 at 12:00 PM"
  date: 'PPP', // e.g., "April 29, 2023"
  time: 'p', // e.g., "12:00 PM"
  dateTime: 'Pp', // e.g., "04/29/2023, 12:00 PM"
  short: 'P', // e.g., "04/29/2023"
  shortTime: 'p', // e.g., "12:00 PM"
  monthYear: 'MMMM yyyy', // e.g., "April 2023"
  dayMonth: 'dd MMM', // e.g., "29 Apr"
  year: 'yyyy', // e.g., "2023"
} as const;

/**
 * Check if date is today
 */
export function isToday(date: string | Date): boolean {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  } catch {
    return false;
  }
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: string | Date): boolean {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      dateObj.getDate() === yesterday.getDate() &&
      dateObj.getMonth() === yesterday.getMonth() &&
      dateObj.getFullYear() === yesterday.getFullYear()
    );
  } catch {
    return false;
  }
}

/**
 * Format date smartly (today: time only, yesterday: "Yesterday", older: full date)
 */
export function formatSmart(
  date: string | Date,
  timezone?: string,
  locale: 'en' | 'hi' | 'mr' = 'en'
): string {
  try {
    if (isToday(date)) {
      return formatInUserTimezone(date, DATE_FORMATS.shortTime, timezone, locale);
    }
    
    if (isYesterday(date)) {
      return locale === 'en' ? 'Yesterday' : locale === 'hi' ? 'कल' : 'काल';
    }

    return formatInUserTimezone(date, DATE_FORMATS.date, timezone, locale);
  } catch (error) {
    console.error('Error formatting smart date:', error);
    return 'Invalid date';
  }
}

/**
 * Get timezone offset string (e.g., "+05:30")
 */
export function getTimezoneOffset(timezone?: string): string {
  try {
    const tz = timezone || getDetectedTimezone();
    const now = new Date();
    const formatted = formatInTimeZone(now, tz, 'XXX');
    return formatted;
  } catch {
    return '+00:00';
  }
}

/**
 * Parse date string safely
 */
export function parseDate(dateString: string): Date | null {
  try {
    return parseISO(dateString);
  } catch {
    return null;
  }
}
