import { Sprout } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#12291d] text-[#b9c4ae]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-xl bg-[#e3e8d3] text-emerald-700">
            <Sprout className="size-7" />
          </span>
          <div>
            <p className="font-display text-2xl font-bold text-white">BINHI</p>
            <p className="max-w-xl text-sm">
              Reforestation Offset Simulator: Modeling Sapling Requirements,
              Absorption Recovery, and Relative Flood Risk
            </p>
          </div>
        </div>
        <p className="text-sm md:text-right">
          © 2026 Team Dysonic • DENR MO 2012-02 &amp; PAGASA climatological data
        </p>
      </div>
    </footer>
  )
}
