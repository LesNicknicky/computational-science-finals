import { cn } from "cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("clay-inset animate-pulse", className)}
      {...props}
    />
  )
}

export { Skeleton }