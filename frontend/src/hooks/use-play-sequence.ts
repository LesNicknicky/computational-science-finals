import { useCallback, useEffect, useState } from "react"

// index = last visible month (0-based). Idle = last month, so the full year shows.
// Pass `resetKey` (e.g. the simulation result) to jump back to the full year when it changes.
export function usePlaySequence(
  total: number,
  intervalMs = 700,
  resetKey?: unknown
) {
  const [index, setIndex] = useState(total - 1)
  const [playing, setPlaying] = useState(false)
  const [prevKey, setPrevKey] = useState(resetKey)

  // React's recommended way to reset state when an input changes (no effect needed)
  if (prevKey !== resetKey) {
    setPrevKey(resetKey)
    setPlaying(false)
    setIndex(total - 1)
  }

  useEffect(() => {
    if (!playing) return
    // state is only set inside the timer callback, never synchronously in the effect
    const t = setTimeout(() => {
      if (index >= total - 1) setPlaying(false)
      else setIndex(index + 1)
    }, intervalMs)
    return () => clearTimeout(t)
  }, [playing, index, total, intervalMs])

  const toggle = useCallback(() => {
    if (playing) {
      setPlaying(false)
      setIndex(total - 1)
    } else {
      setIndex(0)
      setPlaying(true)
    }
  }, [playing, total])

  return { index, playing, toggle }
}