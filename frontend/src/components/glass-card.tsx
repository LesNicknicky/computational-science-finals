import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function GlassCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return <Card className={cn("gap-0 p-4", className)} {...props} />
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
      <Icon
        className="size-4 text-emerald-600 drop-shadow-[1px_2px_1px_rgba(30,110,70,0.25)]"
        aria-hidden
      />{" "}
      {children}
    </p>
  )
}
