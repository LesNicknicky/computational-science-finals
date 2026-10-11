import { REGIONS } from "@/data/region-map"
import { cn } from "@/lib/utils"

interface Props {
  value: string
  onChange: (id: string) => void
  className?: string
}

export function RegionMap({ value, onChange, className }: Props) {
  return (
    <svg
      viewBox="0 0 200 250"
      className={cn("w-full", className)}
      role="group"
      aria-label="Pick a region"
    >
      <path
        d="M20 112 L40 142 L52 192 L44 196 L26 152Z"
        className="fill-stone-200"
      />
      <path d="M58 206 L94 214 L108 232 L68 236Z" className="fill-stone-200" />
      {REGIONS.map((r) => (
        <path
          key={r.id}
          d={r.path}
          role="button"
          tabIndex={0}
          aria-label={r.name}
          aria-pressed={r.id === value}
          onClick={() => onChange(r.id)}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && onChange(r.id)
          }
          className={cn(
            "cursor-pointer stroke-white stroke-2 transition-colors outline-none focus-visible:stroke-emerald-900",
            r.id === value
              ? "fill-emerald-600"
              : "fill-emerald-300 hover:fill-emerald-400"
          )}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}
