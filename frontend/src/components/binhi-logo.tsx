import { cn } from "@/lib/utils"

/** BINHI ("seed"): a sprouting seed inside a clay bubble. */
export function BinhiLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="BINHI logo"
      className={cn("size-10 shrink-0", className)}
    >
      <defs>
        <linearGradient id="binhi-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fe3b5" />
          <stop offset="1" stopColor="#2f9d68" />
        </linearGradient>
        <linearGradient id="binhi-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d9f7e6" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#binhi-bg)" />
      <circle
        cx="24"
        cy="24"
        r="22"
        fill="none"
        stroke="#fff"
        strokeOpacity=".55"
        strokeWidth="1.5"
      />
      {/* seed */}
      <ellipse cx="24" cy="35" rx="7.5" ry="5" fill="#7a4e2b" />
      <ellipse cx="22" cy="33.6" rx="3" ry="1.6" fill="#a8743f" />
      {/* stem */}
      <path
        d="M24 31 C24 26 24 22 24 18"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* leaves */}
      <path
        d="M24 21 C24 13 17 10 11 11 C11 18 16 22 24 21Z"
        fill="url(#binhi-leaf)"
      />
      <path
        d="M24 18 C24 10 31 7 37 8 C37 15 32 19 24 18Z"
        fill="url(#binhi-leaf)"
      />
    </svg>
  )
}
