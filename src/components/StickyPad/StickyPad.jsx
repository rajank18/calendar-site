import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { NOTE_TAGS } from '../../constants/colors'
import { getRangeLength } from '../../utils/dateHelpers'
import Button from '../UI/Button'
import TagChip from '../UI/TagChip'

function TypewriterText({ text }) {
  const [visibleChars, setVisibleChars] = useState(0)

  useEffect(() => {
    setVisibleChars(0)
    const timer = setInterval(() => {
      setVisibleChars((prev) => {
        if (prev >= text.length) {
          clearInterval(timer)
          return prev
        }
        return prev + 1
      })
    }, 14)

    return () => clearInterval(timer)
  }, [text])

  return <p>{text.slice(0, visibleChars)}</p>
}

export default function StickyPad({ range, notes, onAddNote, onDeleteNote, onExport }) {
  const [draft, setDraft] = useState('')
  const [tag, setTag] = useState('Idea')

  const selectionLabel = useMemo(() => {
    const count = getRangeLength(range)
    if (!count) {
      return 'All notes'
    }
    return `${count} day selection`
  }, [range])

  const saveNote = (event) => {
    event.preventDefault()
    onAddNote({ text: draft, tag })
    setDraft('')
  }

  return (
    <motion.aside
      className="sticky-pad"
      initial={{ y: 20, opacity: 0, rotate: 2.4 }}
      animate={{ y: 0, opacity: 1, rotate: 1.2 }}
      transition={{ type: 'spring', damping: 18, stiffness: 160 }}
    >
      <header className="sticky-head">
        <div>
          <h2>Notes</h2>
          <span>{selectionLabel}</span>
        </div>
        <Button className="export-btn" onClick={onExport} title="Export notes">
          Export
        </Button>
      </header>

      <form onSubmit={saveNote} className="note-form">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          placeholder="Write something for this date..."
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
        />
        <div className="note-form-row">
          <select value={tag} onChange={(event) => setTag(event.target.value)}>
            {NOTE_TAGS.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <motion.button
            className="add-note"
            type="submit"
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, -1.5, 0] }}
            transition={{ duration: 0.4 }}
          >
            Stick note
          </motion.button>
        </div>
      </form>

      <ul className="notes-list">
        {notes.map((note) => (
          <motion.li
            key={note.id}
            layout
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 16 }}
          >
            <div className="note-top">
              <TagChip tag={note.tag} />
              <button type="button" onClick={() => onDeleteNote(note.id)} aria-label="Delete note">
                x
              </button>
            </div>
            <TypewriterText text={note.text} />
          </motion.li>
        ))}
      </ul>

      {notes.length === 0 && (
        <div className="notes-empty" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="presentation">
            <path d="M3.5 20.5 8 19.6l9.8-9.8-3.3-3.3-9.8 9.8-.9 4.2z" />
            <path d="m13.9 5.4 3.3 3.3" />
          </svg>
          <p>nothing here yet...</p>
        </div>
      )}
    </motion.aside>
  )
}
