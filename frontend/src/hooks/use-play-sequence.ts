import { useCallback, useEffect, useState } from "react"

// index = last visible month (0-based). Idle = the last month of the chosen range,
// so the whole range shows. `start`/`end` are the first/last month (0-based) being simulated.
// Pass `resetKey` (e.g. the simulation result) to jump back to the idle state when it changes.
export function usePlaySequence(
  total: number,
  intervalMs = 700,
  resetKey?: unknown,
  start = 0,
  end = total - 1
) {
  const [index, setIndex] = useState(end)
  const [playing, setPlaying] = useState(false)
  const [prevKey, setPrevKey] = useState(resetKey)
  const [prevBounds, setPrevBounds] = useState(`${start}-${end}`)

  // React's recommended way to reset state when an input changes (no effect needed)
  if (prevKey !== resetKey || prevBounds !== `${start}-${end}`) {
    setPrevKey(resetKey)
    setPrevBounds(`${start}-${end}`)
    setPlaying(false)
    setIndex(end)
  }

  useEffect(() => {
    if (!playing) return
    // state is only set inside the timer callback, never synchronously in the effect
    const t = setTimeout(() => {
      if (index >= end) setPlaying(false)
      else setIndex(index + 1)
    }, intervalMs)
    return () => clearTimeout(t)
  }, [playing, index, end, intervalMs])

  const toggle = useCallback(() => {
    if (playing) {
      setPlaying(false)
      setIndex(end)
    } else {
      setIndex(start)
      setPlaying(true)
    }
  }, [playing, start, end])

  return { index, playing, toggle }
}