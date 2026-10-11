import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function GlassCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "gap-0 rounded-2xl border-white/70 bg-white/40 p-3.5 shadow-lg backdrop-blur-xl backdrop-saturate-150",
        className
      )}
      {...props}
    />
  )
}

export function CardTitle({
  icon: Icon,
  children,
}: {
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <p className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground">
      <Icon className="size-4 text-emerald-700" aria-hidden /> {children}
    </p>
  )
}
