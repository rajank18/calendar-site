import { useEffect, useRef } from 'react'

const CLOCK_MARKERS = Array.from({ length: 12 }, (_, index) => {
  const value = index + 1
  const radians = ((value - 3) * Math.PI) / 6
  return {
    value,
    x: 50 + Math.cos(radians) * 40,
    y: 50 + Math.sin(radians) * 40,
  }
})

export default function DeskAnalogClock() {
  const hourRef = useRef(null)
  const minuteRef = useRef(null)
  const secondRef = useRef(null)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000
      const minutes = now.getMinutes() + seconds / 60
      const hours = (now.getHours() % 12) + minutes / 60

      hourRef.current?.style.setProperty('--hand-angle', `${hours * 30}deg`)
      minuteRef.current?.style.setProperty('--hand-angle', `${minutes * 6}deg`)
      secondRef.current?.style.setProperty('--hand-angle', `${seconds * 6}deg`)
    }

    tick()
    const intervalId = window.setInterval(tick, 33)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <div className="desk-analog-clock" aria-label="Analog clock" role="img">
      {CLOCK_MARKERS.map((marker) => (
        <span
          key={marker.value}
          className="clock-number"
          style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
        >
          {marker.value}
        </span>
      ))}
      <div ref={hourRef} className="clock-hand hour" />
      <div ref={minuteRef} className="clock-hand minute" />
      <div ref={secondRef} className="clock-hand second" />
      <div className="clock-center" />
    </div>
  )
}
