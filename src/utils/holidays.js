import { addDays, toDateKey } from './dateHelpers'

const HOLIDAYS = [
  { mmdd: '01-01', label: 'New Year\'s Day', scope: 'International' },
  { mmdd: '01-26', label: 'Republic Day', scope: 'India' },
  { mmdd: '03-08', label: 'International Women\'s Day', scope: 'International' },
  { mmdd: '05-01', label: 'Labour Day', scope: 'International' },
  { mmdd: '08-15', label: 'Independence Day', scope: 'India' },
  { mmdd: '10-02', label: 'Gandhi Jayanti', scope: 'India' },
  { mmdd: '11-14', label: 'Children\'s Day', scope: 'India' },
  { mmdd: '12-25', label: 'Christmas', scope: 'International' },
]

function toMonthDay(date) {
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${m}-${d}`
}

export function getHolidaysForDate(date) {
  const mmdd = toMonthDay(date)
  return HOLIDAYS.filter((holiday) => holiday.mmdd === mmdd)
}

export function getHolidayMapForMonth(monthDate) {
  const map = {}
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  const last = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)

  let cursor = first
  while (cursor <= last) {
    const matches = getHolidaysForDate(cursor)
    if (matches.length) {
      map[toDateKey(cursor)] = matches
    }
    cursor = addDays(cursor, 1)
  }

  return map
}

export function getUpcomingHolidayCount(monthDate, today = new Date()) {
  const map = getHolidayMapForMonth(monthDate)
  return Object.keys(map).filter((dateKey) => new Date(dateKey) >= today).length
}
