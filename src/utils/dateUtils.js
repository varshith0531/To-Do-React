/**
 * Utility functions for timezone-safe date handling in TaskFlow
 */

// Format any date/string into a local 'YYYY-MM-DD' key
export const formatDateKey = (dateInput) => {
  if (!dateInput) return '';
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    return dateInput;
  }
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Parse a 'YYYY-MM-DD' key into a local Date object set to noon
// (noon prevents daylight savings boundary shifts)
export const parseDateKey = (dateKey) => {
  if (!dateKey) return new Date();
  if (typeof dateKey === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Date(year, month - 1, day, 12, 0, 0);
  }
  const d = new Date(dateKey);
  return isNaN(d.getTime()) ? new Date() : d;
};

// Check if two dates/keys represent the same calendar day
export const isSameDay = (date1, date2) => {
  return formatDateKey(date1) === formatDateKey(date2);
};

// Check if a date is today
export const isToday = (dateInput) => {
  return isSameDay(dateInput, new Date());
};

// Add or subtract days from a date
export const addDays = (dateInput, days) => {
  const d = dateInput instanceof Date ? new Date(dateInput) : parseDateKey(dateInput);
  d.setDate(d.getDate() + days);
  return d;
};

// Returns user-friendly labels for dates
export const getRelativeDateInfo = (dateInput) => {
  const dateKey = formatDateKey(dateInput);
  const targetDate = parseDateKey(dateKey);
  
  const todayKey = formatDateKey(new Date());
  const tomorrowKey = formatDateKey(addDays(new Date(), 1));
  const yesterdayKey = formatDateKey(addDays(new Date(), -1));

  const dayOfWeekShort = targetDate.toLocaleDateString(undefined, { weekday: 'short' });
  const dayOfWeekLong = targetDate.toLocaleDateString(undefined, { weekday: 'long' });
  const monthDay = targetDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const fullMonthDayYear = targetDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });

  const currentYear = new Date().getFullYear();
  const targetYear = targetDate.getFullYear();
  const yearSuffix = targetYear !== currentYear ? `, ${targetYear}` : '';

  if (dateKey === todayKey) {
    return {
      title: 'Today',
      subtitle: `${dayOfWeekLong}, ${fullMonthDayYear}`,
      shortLabel: 'Today',
      badge: 'Today',
      isToday: true,
      isTomorrow: false,
      isYesterday: false,
      dateKey,
    };
  }

  if (dateKey === tomorrowKey) {
    return {
      title: 'Tomorrow',
      subtitle: `${dayOfWeekLong}, ${fullMonthDayYear}`,
      shortLabel: 'Tomorrow',
      badge: 'Tomorrow',
      isToday: false,
      isTomorrow: true,
      isYesterday: false,
      dateKey,
    };
  }

  if (dateKey === yesterdayKey) {
    return {
      title: 'Yesterday',
      subtitle: `${dayOfWeekLong}, ${fullMonthDayYear}`,
      shortLabel: 'Yesterday',
      badge: 'Yesterday',
      isToday: false,
      isTomorrow: false,
      isYesterday: true,
      dateKey,
    };
  }

  return {
    title: `${dayOfWeekShort}, ${monthDay}${yearSuffix}`,
    subtitle: `${dayOfWeekLong}, ${fullMonthDayYear}`,
    shortLabel: `${dayOfWeekShort}, ${monthDay}`,
    badge: `${monthDay}`,
    isToday: false,
    isTomorrow: false,
    isYesterday: false,
    dateKey,
  };
};
