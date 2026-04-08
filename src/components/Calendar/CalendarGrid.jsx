import { useMemo, useRef, useState } from 'react'
import { MONTHS, WEEK_DAYS } from '../../constants/months'
import { MONTH_IMAGES } from '../../constants/monthImages'
import { getCalendarDays, getMonthLabel } from '../../utils/dateHelpers'
import { getHolidayMapForMonth } from '../../utils/holidays'
import DayCell from './DayCell'
import MonthNavigator from './MonthNavigator'

export default function CalendarGrid({
  monthDate,
  range,
  focusedDate,
  onPrevMonth,
  onNextMonth,
  onDaySelect,
  onDayPointerDown,
  onDayPointerEnter,
  onDayPointerUp,
}) {
  const days = useMemo(() => getCalendarDays(monthDate), [monthDate])
  const holidayMap = useMemo(() => getHolidayMapForMonth(monthDate), [monthDate])
  const today = useMemo(() => new Date(), [])
  const [flipProgress, setFlipProgress] = useState(0)
  const [flipDirection, setFlipDirection] = useState('next')
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ active: false, pointerId: null, startX: 0, startY: 0, progress: 0 })
  const animatingRef = useRef(false)

  const animateProgress = (from, to, duration, done) => {
    const start = performance.now()
    animatingRef.current = true

    const frame = (time) => {
      const t = Math.min(1, (time - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setFlipProgress(from + (to - from) * eased)

      if (t < 1) {
        requestAnimationFrame(frame)
        return
      }

      animatingRef.current = false
      if (done) {
        done()
      }
    }

    requestAnimationFrame(frame)
  }

  const triggerMonthFlip = (direction) => {
    if (animatingRef.current || isDragging || flipProgress > 0.01) {
      return
    }

    setFlipDirection(direction)

    animateProgress(0, 1, 520, () => {
      if (direction === 'prev') {
        onPrevMonth()
      } else {
        onNextMonth()
      }
      setFlipProgress(0)
    })
  }

  const onCurlPointerDown = (event) => {
    if (animatingRef.current) {
      return
    }

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      progress: flipProgress,
    }
    setFlipDirection('next')
    setIsDragging(true)
  }

  const onCurlPointerMove = (event) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) {
      return
    }

    const dx = Math.max(0, dragRef.current.startX - event.clientX)
    const dy = Math.max(0, dragRef.current.startY - event.clientY)
    const progress = Math.max(0, Math.min(1, (dx * 0.65 + dy * 1.1) / 220))
    dragRef.current.progress = progress
    setFlipProgress(progress)
  }

  const onCurlPointerEnd = () => {
    if (!dragRef.current.active) {
      return
    }

    const progress = dragRef.current.progress
    dragRef.current.active = false
    dragRef.current.pointerId = null
    setIsDragging(false)

    if (progress >= 0.45) {
      animateProgress(progress, 1, 300, () => {
        onNextMonth()
        setFlipProgress(0)
      })
      return
    }

    animateProgress(progress, 0, 260)
  }

  return (
    <div className="calendar-paper">
      <MonthNavigator onPrev={() => triggerMonthFlip('prev')} onNext={() => triggerMonthFlip('next')} />
      <div className="calendar-page-shell">
        <div
          className={`calendar-page ${flipProgress > 0.01 ? 'is-flipping' : ''}`}
          style={{ '--flip-progress': flipProgress, '--flip-sign': flipDirection === 'prev' ? -1 : 1 }}
        >
          <div className="calendar-page-content">
            <div className="calendar-mobile-hero" aria-hidden="true">
              <img src={MONTH_IMAGES[monthDate.getMonth()]} alt={`${MONTHS[monthDate.getMonth()]} mood board`} loading="eager" />
            </div>
            <header className="calendar-head">
              <h1>{getMonthLabel(monthDate)}</h1>
            </header>

            <div className="weekday-row">
              {WEEK_DAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="calendar-grid">
              {days.map((day) => (
                <DayCell
                  key={day.date.toISOString()}
                  day={day}
                        today={today}
                  focusedDate={focusedDate}
                  range={range}
                  holidayMap={holidayMap}
                  onSelect={onDaySelect}
                  onPointerDown={onDayPointerDown}
                  onPointerEnter={onDayPointerEnter}
                  onPointerUp={onDayPointerUp}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`page-curl ${isDragging ? 'is-dragging' : ''}`}
        aria-label="Drag corner to flip page"
        onPointerDown={onCurlPointerDown}
        onPointerMove={onCurlPointerMove}
        onPointerUp={onCurlPointerEnd}
        onPointerCancel={onCurlPointerEnd}
      />
    </div>
  )
}
