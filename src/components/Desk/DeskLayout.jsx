import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import DeskAudioPlayer from './DeskAudioPlayer'
import DeskAnalogClock from './DeskAnalogClock'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) {
    return 'Good morning'
  }
  if (hour < 17) {
    return 'Good afternoon'
  }
  if (hour < 21) {
    return 'Good evening'
  }
  return 'Good night'
}

export default function DeskLayout({ polaroid, calendar, sticky, theme, onToggleTheme }) {
  const [greeting, setGreeting] = useState(getGreeting())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setGreeting(getGreeting())
    }, 60000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <main className="desk-scene">
      <p className="desk-greeting">{greeting}, welcome back.</p>

      <motion.div
        className="desk-object desk-polaroid"
        initial={{ opacity: 0, y: -28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {polaroid}
      </motion.div>

      <motion.div
        className="desk-object desk-calendar"
        initial={{ opacity: 0, y: -34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.23 }}
      >
        {calendar}
      </motion.div>

      <motion.div
        className="desk-object desk-sticky"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.35 }}
      >
        {sticky}
      </motion.div>

      <motion.div
        className="desk-clock-wrap"
        initial={{ opacity: 0, scale: 0.85, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.3 }}
      >
        <DeskAnalogClock />
      </motion.div>

      <DeskAudioPlayer theme={theme} onToggleTheme={onToggleTheme} />
    </main>
  )
}
