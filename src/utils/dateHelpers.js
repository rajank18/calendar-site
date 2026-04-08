export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function fromDateKey(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(date, amount) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

export function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

export function isSameDay(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

export function isSameMonth(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth()
  )
}

export function normalizeRange(range) {
  if (!range.start) {
    return { start: null, end: null }
  }

  if (!range.end) {
    return { start: range.start, end: range.start }
  }

  if (range.start <= range.end) {
    return range
  }

  return { start: range.end, end: range.start }
}

export function isDateInRange(date, range) {
  if (!range.start) {
    return false
  }

  const safeRange = normalizeRange(range)
  const current = startOfDay(date).getTime()
  const start = startOfDay(safeRange.start).getTime()
  const end = startOfDay(safeRange.end).getTime()
  return current >= start && current <= end
}

export function getCalendarDays(monthDate) {
  const firstDayOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  const weekOffset = firstDayOfMonth.getDay()
  const gridStart = addDays(firstDayOfMonth, -weekOffset)

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index)
    return {
      index,
      date,
      inMonth: date.getMonth() === monthDate.getMonth(),
    }
  })
}

export function getMonthLabel(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function getRangeKey(range) {
  if (!range.start) {
    return 'all'
  }

  const safeRange = normalizeRange(range)
  const startKey = toDateKey(safeRange.start)
  const endKey = toDateKey(safeRange.end)
  return startKey === endKey ? startKey : `${startKey}_${endKey}`
}

export function getRangeLength(range) {
  if (!range.start) {
    return 0
  }

  const safeRange = normalizeRange(range)
  const start = startOfDay(safeRange.start).getTime()
  const end = startOfDay(safeRange.end).getTime()
  return Math.floor((end - start) / 86400000) + 1
}
