import { useState, useEffect, useRef, useCallback } from 'react'

const SPEEDS = { slow: 1400, normal: 750, fast: 280 }

export function usePlayback() {
  const [steps,   setSteps]   = useState([])
  const [idx,     setIdx]     = useState(0)
  const [playing, setPlaying] = useState(false)
  const [preset,  setPreset]  = useState('normal')
  const timerRef = useRef(null)

  const speed = SPEEDS[preset]
  const total = steps.length
  const step  = steps[idx] ?? null
  const pct   = total > 1 ? (idx / (total - 1)) * 100 : 0

  useEffect(() => {
    clearInterval(timerRef.current)
    if (playing && total) {
      timerRef.current = setInterval(() => {
        setIdx(i => {
          if (i >= total - 1) { setPlaying(false); return i }
          return i + 1
        })
      }, speed)
    }
    return () => clearInterval(timerRef.current)
  }, [playing, speed, total])

  const load = useCallback((newSteps) => {
    clearInterval(timerRef.current)
    setSteps(newSteps)
    setIdx(0)
    setPlaying(false)
  }, [])

  const clear = useCallback(() => {
    clearInterval(timerRef.current)
    setSteps([])
    setIdx(0)
    setPlaying(false)
  }, [])

  const stepBack    = useCallback(() => setIdx(i => Math.max(0, i - 1)), [])
  const stepForward = useCallback(() => setIdx(i => Math.min(total - 1, i + 1)), [total])
  const jumpTo      = useCallback((i) => setIdx(Math.max(0, Math.min(total - 1, i))), [total])
  const togglePlay  = useCallback(() => setPlaying(p => !p), [])

  return {
    steps, step, idx, total, pct, playing, preset,
    setPreset, load, clear, stepBack, stepForward, jumpTo, togglePlay,
    active: total > 0,
  }
}
