import { MAP_VIEWBOX, OTHER_REGIONS_PATH, REGIONS } from "@/data/region-map"
import { cn } from "@/lib/utils"

interface Props {
  value: string
  onChange: (id: string) => void
  className?: string
}

export function RegionMap({ value, onChange, className }: Props) {
  // Draw the selected region last so its outline sits on top of its neighbours.
  const ordered = [...REGIONS].sort(
    (a, b) => Number(a.id === value) - Number(b.id === value)
  )

  return (
    // The svg is absolutely positioned inside this box, so the map can never
    // push the card taller than the space the layout gives it: it just scales
    // down to fit. min-h-72 is only a fallback for phones, where the card has
    // no fixed height.
    <div className={cn("clay-inset relative min-h-0 flex-1", className)}>
      <svg
        viewBox={MAP_VIEWBOX}
        className="absolute inset-3 size-[calc(100%-1.5rem)]"
        role="group"
        aria-label="Pick a region"
      >
        <path
          d={OTHER_REGIONS_PATH}
          className="fill-stone-300/70 stroke-white/80"
          strokeWidth={0.5}
          strokeLinejoin="round"
          aria-hidden
        />
        <g className="drop-shadow-[2px_3px_2px_rgba(6,78,59,0.35)]">
          {ordered.map((r) => (
            <path
              key={r.id}
              d={r.path}
              role="button"
              tabIndex={0}
              aria-label={r.name}
              aria-pressed={r.id === value}
              onClick={() => onChange(r.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onChange(r.id)
                }
              }}
              className={cn(
                "cursor-pointer stroke-white transition-colors outline-none focus-visible:stroke-emerald-900",
                r.id === value
                  ? "fill-emerald-700"
                  : "fill-emerald-300 hover:fill-emerald-400"
              )}
              strokeWidth={r.id === value ? 1.2 : 0.8}
              strokeLinejoin="round"
            >
              <title>{r.name}</title>
            </path>
          ))}
        </g>
      </svg>
    </div>
  )
}
