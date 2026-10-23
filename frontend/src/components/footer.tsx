import { Sprout } from "lucide-react"
import { SITE } from "@/data/landing-content"

export function Footer() {
  return (
    <footer className="bg-[#12291d] text-[#b9c4ae]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-xl bg-[#e3e8d3] text-emerald-700">
            <Sprout className="size-7" />
          </span>
          <div>
            <p className="font-display text-2xl font-bold text-white">
              {SITE.name}
            </p>
            <p className="max-w-xl text-sm">{SITE.fullTitle}</p>
          </div>
        </div>
        <p className="text-sm md:text-right">{SITE.footerCredit}</p>
      </div>
    </footer>
  )
}
