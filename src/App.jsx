import { useEffect } from 'react'
import CalendarGrid from './components/Calendar/CalendarGrid'
import DeskLayout from './components/Desk/DeskLayout'
import PolaroidHero from './components/Polaroid/PolaroidHero'
import StickyPad from './components/StickyPad/StickyPad'
import { useCalendar } from './hooks/useCalendar'
import { useDateRange } from './hooks/useDateRange'
import { useNotes } from './hooks/useNotes'
import { useTheme } from './hooks/useTheme'
import { toDateKey } from './utils/dateHelpers'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { monthDate, nextMonth, prevMonth } = useCalendar()
  const { range, focusedDate, isDragging, selectDate, beginDrag, hoverDrag, endDrag, clearRange, moveFocus, selectFocused } = useDateRange()
  const { visibleNotes, addNote, deleteNote } = useNotes(range)

  useEffect(() => {
    const isTypingTarget = (target) => {
      if (!(target instanceof HTMLElement)) {
        return false
      }
      return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
    }

    const onKeyDown = (event) => {
      if (isTypingTarget(event.target)) {
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        moveFocus(-1)
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        moveFocus(1)
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        moveFocus(-7)
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        moveFocus(7)
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        selectFocused()
      }
      if (event.key === 'Escape') {
        clearRange()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [clearRange, moveFocus, selectFocused])

  const handleSelectDate = (date) => {
    selectDate(date)
  }

  const exportSelection = () => {
    const title = range.start
      ? `${toDateKey(range.start)}${range.end ? ` to ${toDateKey(range.end)}` : ''}`
      : 'All Notes'

    const notesToRender =
      visibleNotes.length > 0
        ? visibleNotes
        : [{ tag: 'Info', text: 'nothing here yet...' }]

    const canvas = document.createElement('canvas')
    const width = 1280
    const lineHeight = 42
    const wrappedNotes = []

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    context.font = '500 34px Inter, sans-serif'

    notesToRender.forEach((note, index) => {
      const words = `${index + 1}. [${note.tag}] ${note.text}`.split(' ')
      const lines = []
      let currentLine = ''

      words.forEach((word) => {
        const candidate = currentLine ? `${currentLine} ${word}` : word
        if (context.measureText(candidate).width > 1080) {
          lines.push(currentLine)
          currentLine = word
          return
        }
        currentLine = candidate
      })

      if (currentLine) {
        lines.push(currentLine)
      }

      wrappedNotes.push(...lines, '')
    })

    const height = Math.max(900, 320 + wrappedNotes.length * lineHeight)
    canvas.width = width
    canvas.height = height

    context.fillStyle = '#f6e7b2'
    context.fillRect(0, 0, width, height)

    context.fillStyle = 'rgba(120, 88, 41, 0.22)'
    for (let y = 210; y < height; y += 48) {
      context.fillRect(0, y, width, 1)
    }

    context.fillStyle = '#3a2718'
    context.font = '700 66px Playfair Display, serif'
    context.fillText('Desk Notes Export', 84, 110)

    context.font = '500 30px Inter, sans-serif'
    context.fillText(`Selection: ${title}`, 84, 168)
    context.fillText(`Generated: ${new Date().toLocaleString()}`, 84, 208)

    context.font = '500 34px Caveat, cursive'
    context.fillStyle = '#4a311e'
    wrappedNotes.forEach((line, index) => {
      context.fillText(line, 84, 282 + index * lineHeight)
    })

    const baseName = `desk-notes-${new Date().toISOString().slice(0, 10)}`

    const pngLink = document.createElement('a')
    pngLink.href = canvas.toDataURL('image/png')
    pngLink.download = `${baseName}.png`
    pngLink.click()

    const jpgLink = document.createElement('a')
    jpgLink.href = canvas.toDataURL('image/jpeg', 0.92)
    jpgLink.download = `${baseName}.jpg`
    jpgLink.click()
  }

  return (
    <DeskLayout
      theme={theme}
      onToggleTheme={toggleTheme}
      polaroid={<PolaroidHero monthDate={monthDate} />}
      calendar={
        <CalendarGrid
          monthDate={monthDate}
          range={range}
          focusedDate={focusedDate}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onDaySelect={handleSelectDate}
          onDayPointerDown={beginDrag}
          onDayPointerEnter={(date) => {
            if (isDragging) {
              hoverDrag(date)
            }
          }}
          onDayPointerUp={endDrag}
        />
      }
      sticky={
        <StickyPad
          range={range}
          notes={visibleNotes}
          onAddNote={addNote}
          onDeleteNote={deleteNote}
          onExport={exportSelection}
        />
      }
    />
  )
}

export default App
