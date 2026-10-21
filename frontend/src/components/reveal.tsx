import type { ReactNode } from "react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

const hiddenState = {
  up: "translate-y-8",
  left: "-translate-x-8",
  right: "translate-x-8",
} as const

interface RevealProps {
  children: ReactNode
  delay?: number
  direction?: keyof typeof hiddenState
  className?: string
}

/** Fades and slides its children in when they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
}: RevealProps) {
  const { ref, inView, reduced } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        !reduced && "transition-all duration-700 ease-out",
        !reduced && !inView && `opacity-0 ${hiddenState[direction]}`,
        className
      )}
    >
      {children}
    </div>
  )
}
