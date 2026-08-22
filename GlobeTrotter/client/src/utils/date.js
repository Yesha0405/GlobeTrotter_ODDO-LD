/**
 * Safely converts a date input into a Date object, handling timezone shifts for YYYY-MM-DD strings.
 * @param {any} dateInput 
 * @returns {Date|null}
 */
export function parseDate(dateInput) {
  if (!dateInput) return null;
  if (dateInput instanceof Date) {
    return isNaN(dateInput.getTime()) ? null : dateInput;
  }
  if (typeof dateInput === 'string') {
    // Prevent timezone shift by parsing ISO-style dates (YYYY-MM-DD) locally
    const yyyymmddMatch = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (yyyymmddMatch) {
      const year = parseInt(yyyymmddMatch[1], 10);
      const month = parseInt(yyyymmddMatch[2], 10) - 1;
      const day = parseInt(yyyymmddMatch[3], 10);
      const d = new Date(year, month, day);
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(dateInput);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof dateInput === 'number') {
    const d = new Date(dateInput);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/**
 * Converts a date into a human-readable English format like "Apr 10, 2026".
 * @param {any} date 
 * @param {Intl.DateTimeFormatOptions} [options] 
 * @returns {string}
 */
export function formatDate(date, options) {
  const parsed = parseDate(date);
  if (!parsed) return "—";
  const defaultOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  return parsed.toLocaleDateString('en-US', options || defaultOptions);
}

/**
 * Converts a date into a short format like "Apr 10".
 * @param {any} date 
 * @returns {string}
 */
export function formatShortDate(date) {
  const parsed = parseDate(date);
  if (!parsed) return "—";
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Returns the full name of the weekday (e.g. "Friday").
 * @param {any} date 
 * @returns {string}
 */
export function formatDayName(date) {
  const parsed = parseDate(date);
  if (!parsed) return "—";
  return parsed.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Returns the month and year string (e.g. "April 2026").
 * @param {any} date 
 * @returns {string}
 */
export function formatMonthYear(date) {
  const parsed = parseDate(date);
  if (!parsed) return "—";
  return parsed.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Returns the number of calendar days in a trip, inclusive of both dates.
 * @param {any} startDate 
 * @param {any} endDate 
 * @returns {number}
 */
export function getTripDuration(startDate, endDate) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (!start || !end) return 0;

  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  if (e < s) return 0;

  const diffMs = e.getTime() - s.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

/**
 * Returns zero-based day index relative to trip start.
 * @param {any} tripStartDate 
 * @param {any} targetDate 
 * @returns {number}
 */
export function getDayIndex(tripStartDate, targetDate) {
  const start = parseDate(tripStartDate);
  const target = parseDate(targetDate);
  if (!start || !target) return -1;

  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const t = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  const diffMs = t.getTime() - s.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Returns a one-based day number (e.g. Day 1, Day 2).
 * @param {any} tripStartDate 
 * @param {any} targetDate 
 * @returns {number}
 */
export function getDayNumber(tripStartDate, targetDate) {
  const index = getDayIndex(tripStartDate, targetDate);
  if (index < 0) return 0;
  return index + 1;
}

/**
 * Returns an array containing YYYY-MM-DD strings for all dates between start and end inclusive.
 * @param {any} startDate 
 * @param {any} endDate 
 * @returns {string[]}
 */
export function getDateRange(startDate, endDate) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (!start || !end || end < start) return [];

  const range = [];
  const current = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  while (current <= e) {
    range.push(toISODate(current));
    current.setDate(current.getDate() + 1);
  }
  return range;
}

/**
 * Returns true if a target date falls within the inclusive range.
 * @param {any} date 
 * @param {any} startDate 
 * @param {any} endDate 
 * @returns {boolean}
 */
export function isDateInRange(date, startDate, endDate) {
  const d = parseDate(date);
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (!d || !start || !end) return false;

  const tTime = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const sTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const eTime = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();

  return tTime >= sTime && tTime <= eTime;
}

/**
 * Determines whether two inclusive ranges overlap.
 * @param {any} startA 
 * @param {any} endA 
 * @param {any} startB 
 * @param {any} endB 
 * @returns {boolean}
 */
export function datesOverlap(startA, endA, startB, endB) {
  const sA = parseDate(startA);
  const eA = parseDate(endA);
  const sB = parseDate(startB);
  const eB = parseDate(endB);
  if (!sA || !eA || !sB || !eB || eA < sA || eB < sB) return false;

  const tSA = new Date(sA.getFullYear(), sA.getMonth(), sA.getDate()).getTime();
  const tEA = new Date(eA.getFullYear(), eA.getMonth(), eA.getDate()).getTime();
  const tSB = new Date(sB.getFullYear(), sB.getMonth(), sB.getDate()).getTime();
  const tEB = new Date(eB.getFullYear(), eB.getMonth(), eB.getDate()).getTime();

  return tSA <= tEB && tEA >= tSB;
}

/**
 * Converts a date into an ISO string YYYY-MM-DD.
 * @param {any} date 
 * @returns {string|null}
 */
export function toISODate(date) {
  const parsed = parseDate(date);
  if (!parsed) return null;
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, '0');
  const d = String(parsed.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
