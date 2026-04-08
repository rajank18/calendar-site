import { useMemo, useState } from 'react'
import { addMonths, getCalendarDays, isSameMonth } from '../utils/dateHelpers'
import { getHolidayMapForMonth, getUpcomingHolidayCount } from '../utils/holidays'

export function useCalendar(initialDate = new Date()) {
  const [monthDate, setMonthDate] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1))

  const days = useMemo(() => getCalendarDays(monthDate), [monthDate])
  const holidayMap = useMemo(() => getHolidayMapForMonth(monthDate), [monthDate])

  const nextMonth = () => setMonthDate((prev) => addMonths(prev, 1))
  const prevMonth = () => setMonthDate((prev) => addMonths(prev, -1))

  const isCurrentMonth = isSameMonth(monthDate, new Date())
  const upcomingHolidayCount = useMemo(() => {
    return getUpcomingHolidayCount(monthDate, isCurrentMonth ? new Date() : new Date(monthDate.getFullYear(), monthDate.getMonth(), 1))
  }, [monthDate, isCurrentMonth])

  return {
    monthDate,
    days,
    holidayMap,
    upcomingHolidayCount,
    setMonthDate,
    nextMonth,
    prevMonth,
  }
}
