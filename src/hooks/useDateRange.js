import { useMemo, useRef, useState } from 'react'
import { addDays, isSameDay, normalizeRange } from '../utils/dateHelpers'

export function useDateRange() {
  const [range, setRange] = useState({ start: null, end: null })
  const [focusedDate, setFocusedDate] = useState(new Date())
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef(null)
  const dragMovedRef = useRef(false)
  const suppressClickRef = useRef(false)

  const safeRange = useMemo(() => normalizeRange(range), [range])

  const selectDate = (date) => {
    setFocusedDate(date)

    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }

    setRange((prev) => {
      if (prev.start && !prev.end && isSameDay(prev.start, date)) {
        return { start: null, end: null }
      }

      if (prev.start && prev.end && isSameDay(prev.start, date) && isSameDay(prev.end, date)) {
        return { start: null, end: null }
      }

      if (!prev.start || prev.end) {
        return { start: date, end: null }
      }
      return normalizeRange({ start: prev.start, end: date })
    })
  }

  const beginDrag = (date) => {
    setFocusedDate(date)
    dragStartRef.current = date
    dragMovedRef.current = false
    setIsDragging(true)
  }

  const hoverDrag = (date) => {
    setFocusedDate(date)
    if (!isDragging || !dragStartRef.current) {
      return
    }

    if (!isSameDay(dragStartRef.current, date)) {
      dragMovedRef.current = true
    }

    setRange(normalizeRange({ start: dragStartRef.current, end: date }))
  }

  const endDrag = () => {
    if (dragMovedRef.current) {
      suppressClickRef.current = true
    }

    dragStartRef.current = null
    dragMovedRef.current = false
    setIsDragging(false)
  }

  const clearRange = () => {
    setRange({ start: null, end: null })
  }

  const moveFocus = (days) => {
    setFocusedDate((prev) => addDays(prev, days))
  }

  const selectFocused = () => {
    selectDate(focusedDate)
  }

  return {
    range: safeRange,
    focusedDate,
    isDragging,
    selectDate,
    beginDrag,
    hoverDrag,
    endDrag,
    clearRange,
    moveFocus,
    selectFocused,
  }
}
