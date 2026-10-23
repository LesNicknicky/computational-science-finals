import { Rocket, Sprout } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { NAV_LINKS, SITE } from "@/data/landing-content"

interface NavbarProps {
  onLaunch: () => void
}

export function Navbar({ onLaunch }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#d8ddc6] bg-[#ecede3]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-[#e3e8d3] text-emerald-700 shadow-sm">
            <Sprout className="size-6" />
          </span>
          <span className="leading-tight">
            <span className="font-display block text-2xl font-bold text-[#12291d]">
              {SITE.name}
            </span>
            <span className="block text-[11px] font-semibold tracking-widest text-[#5f6b2f]">
              {SITE.navSubtitle}
            </span>
          </span>
        </a>

        <nav className="hidden gap-1 rounded-2xl bg-[#e3e8d3] p-1.5 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "rounded-xl px-5 font-semibold text-[#12291d] hover:bg-white/60"
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Badge
            variant="secondary"
            className="hidden gap-2 rounded-xl bg-[#e3e8d3] px-4 py-2 text-xs font-semibold text-[#12291d] hover:bg-[#e3e8d3] lg:flex"
          >
            <span className="size-2 rounded-full bg-emerald-600" />
            {SITE.standardBadge}
          </Badge>
          <Button
            onClick={onLaunch}
            className="gap-2 bg-emerald-700 font-bold text-white shadow-md hover:bg-emerald-800"
          >
            <Rocket className="size-4" />
            {SITE.launchLabel}
          </Button>
        </div>
      </div>
    </header>
  )
}
