import { useEffect, useMemo, useState } from 'react'
import { getRangeKey } from '../utils/dateHelpers'
import { readStorage, writeStorage } from '../utils/storage'

const STORAGE_KEY = 'desk-calendar-notes'

export function useNotes(activeRange) {
  const [notes, setNotes] = useState(() => readStorage(STORAGE_KEY, []))

  useEffect(() => {
    writeStorage(STORAGE_KEY, notes)
  }, [notes])

  const activeRangeKey = getRangeKey(activeRange)

  const visibleNotes = useMemo(() => {
    return notes.filter((note) => note.rangeKey === activeRangeKey)
  }, [notes, activeRangeKey])

  const addNote = ({ text, tag }) => {
    const cleanText = text.trim()
    if (!cleanText) {
      return
    }

    const newNote = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
      text: cleanText,
      tag,
      rangeKey: activeRangeKey,
      createdAt: new Date().toISOString(),
    }

    setNotes((prev) => [newNote, ...prev])
  }

  const deleteNote = (noteId) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId))
  }

  return {
    notes,
    visibleNotes,
    addNote,
    deleteNote,
  }
}
