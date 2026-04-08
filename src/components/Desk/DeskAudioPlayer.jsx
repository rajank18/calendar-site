import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'

import trackJanuary from '../../assets/Audios/Mice on Venus_spotdown.org.mp3'
import trackFebruary from '../../assets/Audios/Minecraft_spotdown.org.mp3'
import trackMarch from '../../assets/Audios/Subwoofer Lullaby_spotdown.org.mp3'
import trackApril from '../../assets/Audios/Sweden_spotdown.org.mp3'

const PLAYLIST = [
  { name: 'Mice on Venus', src: trackJanuary },
  { name: 'Minecraft', src: trackFebruary },
  { name: 'Subwoofer Lullaby', src: trackMarch },
  { name: 'Sweden', src: trackApril },
]

const titleVariants = {
  enter: (direction) => ({
    x: direction >= 0 ? 22 : -22,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction >= 0 ? -22 : 22,
    opacity: 0,
  }),
}

function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="6" width="2.5" height="12" rx="0.6" />
      <path d="M18 6.5 9 12l9 5.5z" />
    </svg>
  )
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6.5 15 12l-9 5.5z" />
      <rect x="17.5" y="6" width="2.5" height="12" rx="0.6" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5 18 12 8 18.5z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="6" width="3.2" height="12" rx="0.8" />
      <rect x="13.8" y="6" width="3.2" height="12" rx="0.8" />
    </svg>
  )
}

function ShuffleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 7 3.5 0c1.8 0 3 .5 4.4 1.8l6.1 5.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 7h4v4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17h3.5c1.8 0 3-.5 4.4-1.8l6.1-5.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17h4v-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9 5.3 5.3" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.3 2.8a8.8 8.8 0 1 0 6.9 13.8A9.2 9.2 0 0 1 14.3 2.8z" />
    </svg>
  )
}

export default function DeskAudioPlayer({ theme, onToggleTheme }) {
  const [trackIndex, setTrackIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShuffleOn, setIsShuffleOn] = useState(false)
  const audioRef = useRef(null)

  const activeTrack = useMemo(() => PLAYLIST[trackIndex], [trackIndex])

  const startPlayback = async () => {
    try {
      await audioRef.current?.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }

  const pausePlayback = () => {
    if (!audioRef.current) {
      return
    }

    audioRef.current.pause()
    setIsPlaying(false)
  }

  const togglePlayback = () => {
    if (isPlaying) {
      pausePlayback()
      return
    }
    startPlayback()
  }

  const changeTrack = (nextDirection) => {
    const randomIndex = () => {
      if (PLAYLIST.length <= 1) {
        return trackIndex
      }

      let pick = trackIndex
      while (pick === trackIndex) {
        pick = Math.floor(Math.random() * PLAYLIST.length)
      }
      return pick
    }

    setDirection(nextDirection)
    setTrackIndex((prev) => {
      if (isShuffleOn) {
        if (PLAYLIST.length <= 1) {
          return prev
        }

        let pick = prev
        while (pick === prev) {
          pick = Math.floor(Math.random() * PLAYLIST.length)
        }
        return pick
      }

      const next = (prev + nextDirection + PLAYLIST.length) % PLAYLIST.length
      return next
    })

    // Keep playback flowing while switching tracks.
    if (isPlaying) {
      queueMicrotask(() => {
        startPlayback()
      })
    }
  }

  return (
    <motion.div
      className="desk-audio-player"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.42 }}
    >
      <div className="audio-title-wrap" aria-live="polite">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.p
            key={activeTrack.name}
            custom={direction}
            variants={titleVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="audio-title"
          >
            {activeTrack.name}
          </motion.p>
        </AnimatePresence>
      </div>
      
      <audio ref={audioRef} src={activeTrack.src} preload="metadata" onEnded={() => changeTrack(1)} />

      <div className="audio-controls">
        <button
          type="button"
          className={`audio-icon-btn ${isShuffleOn ? 'is-active' : ''}`}
          onClick={() => setIsShuffleOn((prev) => !prev)}
          aria-label={isShuffleOn ? 'Disable shuffle' : 'Enable shuffle'}
        >
          <ShuffleIcon />
        </button>
        <button type="button" className="audio-icon-btn" onClick={() => changeTrack(-1)} aria-label="Previous song">
          <PrevIcon />
        </button>
        <button type="button" className="audio-play" onClick={togglePlayback} aria-label={isPlaying ? 'Pause song' : 'Play song'}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button type="button" className="audio-icon-btn" onClick={() => changeTrack(1)} aria-label="Next song">
          <NextIcon />
        </button>
        <button type="button" className="audio-icon-btn audio-theme-btn" onClick={onToggleTheme} aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>

      
    </motion.div>
  )
}
