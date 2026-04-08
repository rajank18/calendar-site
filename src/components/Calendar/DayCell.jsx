import { memo } from 'react'
import { motion } from 'framer-motion'
import { isDateInRange, isSameDay, toDateKey } from '../../utils/dateHelpers'

function DayCell({
  day,
  today,
  focusedDate,
  range,
  holidayMap,
  onSelect,
  onPointerDown,
  onPointerEnter,
  onPointerUp,
}) {
  const dateKey = toDateKey(day.date)
  const holidays = holidayMap[dateKey] || []
  const isToday = isSameDay(day.date, today)
  const isFocused = isSameDay(day.date, focusedDate)
  const inRange = isDateInRange(day.date, range)
  const isStart = range.start && isSameDay(day.date, range.start)
  const isEnd = range.end && isSameDay(day.date, range.end)

  return (
    <motion.button
      type="button"
      className={[
        'day-cell',
        day.inMonth ? '' : 'is-outside',
        inRange ? 'is-range' : '',
        isStart || isEnd ? 'is-edge' : '',
        isFocused ? 'is-focused' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => onSelect(day.date)}
      onPointerDown={() => onPointerDown(day.date)}
      onPointerEnter={() => onPointerEnter(day.date)}
      onPointerUp={onPointerUp}
      whileHover={{ scale: 1.045, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      aria-label={day.date.toDateString()}
    >
      {inRange && (
        <motion.span
          className="range-ink"
          initial={false}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        />
      )}
      <span className="day-number">{day.date.getDate()}</span>
      {isToday && (
        <motion.svg viewBox="0 0 100 100" className="today-ring" aria-hidden="true">
          <motion.circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            strokeWidth="7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </motion.svg>
      )}
      {holidays.length > 0 && <span className="holiday-dot" title={holidays.map((h) => h.label).join(', ')} />}
    </motion.button>
  )
}

function areEqual(prev, next) {
  const prevTime = prev.day.date.getTime()
  const nextTime = next.day.date.getTime()

  const prevStart = prev.range.start ? prev.range.start.getTime() : -1
  const nextStart = next.range.start ? next.range.start.getTime() : -1
  const prevEnd = prev.range.end ? prev.range.end.getTime() : -1
  const nextEnd = next.range.end ? next.range.end.getTime() : -1

  return (
    prevTime === nextTime &&
    prev.day.inMonth === next.day.inMonth &&
    prev.focusedDate.getTime() === next.focusedDate.getTime() &&
    prev.today.getTime() === next.today.getTime() &&
    prevStart === nextStart &&
    prevEnd === nextEnd &&
    prev.holidayMap[toDateKey(prev.day.date)]?.length ===
      next.holidayMap[toDateKey(next.day.date)]?.length
  )
}

export default memo(DayCell, areEqual)
