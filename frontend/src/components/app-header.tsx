import { useState } from "react"
import { BookOpen } from "lucide-react"
import { useLocation } from "react-router-dom"
import { BinhiLogo } from "@/components/binhi-logo"
import GuideContent from "@/pages/guide-page"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { PROJECT } from "@/lib/project"

const SEEN_KEY = "binhi-guide-seen"

function firstVisit(pathname: string) {
  if (pathname !== "/") return false
  try {
    return !localStorage.getItem(SEEN_KEY)
  } catch {
    return false
  }
}

/**
 * Sticky top bar on every page: logo, system name, title, description, and a
 * slot (`children`) for page actions such as ground type, Simulate and Report.
 */
export function AppHeader({ children }: { children?: React.ReactNode }) {
  const { pathname } = useLocation()
  // the guide opens by itself the first time someone visits the simulator
  const [open, setOpen] = useState(() => firstVisit(pathname))

  const onOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      try {
        localStorage.setItem(SEEN_KEY, "1")
      } catch {
        // storage can be blocked; the guide just opens again next time
      }
    }
  }

  return (
    <header className="sticky top-0 z-30 min-w-0 shrink-0 bg-(--clay-bg) px-3 pt-3 pb-1.5">
      <div className="clay flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[1.5rem]! px-4 py-2">
        <div className="flex items-center gap-2.5">
          <BinhiLogo className="size-11 drop-shadow-[2px_3px_3px_rgba(30,110,70,0.35)]" />
          <div className="leading-none">
            <div className="text-2xl font-black tracking-wide text-emerald-800">
              {PROJECT.name}
            </div>
            <div className="mt-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              by {PROJECT.team}
            </div>
          </div>
        </div>

        <div className="clay-inset hidden min-w-0 flex-1 basis-72 rounded-2xl! px-3.5 py-1.5 md:block">
          <p className="line-clamp-2 text-[12px] leading-snug font-bold text-emerald-950 italic">
            {PROJECT.title}
          </p>
          <p
            className="line-clamp-1 text-[11px] text-muted-foreground"
            title={PROJECT.description}
          >
            {PROJECT.description}
          </p>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {children}
          {/* no Guide button on the guide page itself */}
          {pathname !== "/guide" && (
            <Sheet open={open} onOpenChange={onOpenChange}>
              <SheetTrigger
                render={
                  <Button variant="outline" aria-label="Open the guide">
                    <BookOpen /> Guide
                  </Button>
                }
              />
              <SheetContent side="right" className="w-full">
                <SheetHeader className="pr-14">
                  <SheetTitle className="text-lg font-extrabold text-emerald-900">
                    What is BINHI simulating?
                  </SheetTitle>
                  <SheetDescription>
                    A quick guide to the idea, the goals, and how to read the
                    results.
                  </SheetDescription>
                </SheetHeader>
                <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
                  <GuideContent />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}
