import { useEffect, useRef } from "react"

interface Drop {
  x: number
  y: number
  len: number
  speed: number
  alpha: number
}

const SLANT = 0.18

/** Canvas rain. Place inside a `relative isolate` parent; it sits behind the parent's content. */
export function RainBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let w = 0
    let h = 0
    let raf = 0
    let drops: Drop[] = []

    const spawn = (anywhere: boolean): Drop => {
      const len = 10 + Math.random() * 18
      return {
        x: Math.random() * (w + h * SLANT) - h * SLANT,
        y: anywhere ? Math.random() * h : -len,
        len,
        speed: 7 + Math.random() * 9,
        alpha: 0.12 + Math.random() * 0.3,
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drops = Array.from({ length: Math.min(260, Math.floor(w / 5)) }, () =>
        spawn(true)
      )
    }

    const frame = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 1
      ctx.lineCap = "round"
      for (const d of drops) {
        ctx.strokeStyle = `rgba(190, 225, 205, ${d.alpha})`
        ctx.beginPath()
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x + d.len * SLANT, d.y + d.len)
        ctx.stroke()
        d.y += d.speed
        d.x += d.speed * SLANT
        if (d.y > h) Object.assign(d, spawn(false))
      }
      raf = requestAnimationFrame(frame)
    }

    // Only animate while the hero is on screen.
    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !raf) raf = requestAnimationFrame(frame)
      if (!entry.isIntersecting) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    })
    const sizing = new ResizeObserver(resize)

    resize()
    visibility.observe(canvas)
    sizing.observe(canvas)
    return () => {
      cancelAnimationFrame(raf)
      visibility.disconnect()
      sizing.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 size-full ${className}`}
    />
  )
}
