import { useState, type ReactNode } from "react"
import {
  ArrowDown,
  CircleCheck,
  CircleX,
  ExternalLink,
  Lightbulb,
  Play,
  Rocket,
  Scale,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { RainBackground } from "@/components/rain-background"
import { Reveal } from "@/components/reveal"
import { useInView } from "@/hooks/use-in-view"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"
import { newsVideos } from "@/data/news-video"

// TODO: point these at your own image files (e.g. in /public/images).
const IMAGES = {
  hero: "/images/forest-hero.jpg",
  sapling: "/images/hands-sapling.jpg",
  forest: "/images/forest-mist.jpg",
  water: "/images/water.jpg",
  canopy: "/images/canopy-tree.jpg",
}

interface LandingPageProps {
  onLaunch: () => void
}

function SectionHeader({
  tag,
  title,
  intro,
  tagClass = "text-emerald-800",
}: {
  tag: string
  title: string
  intro: string
  tagClass?: string
}) {
  return (
    <Reveal className="mx-auto mb-12 max-w-3xl text-center">
      <Badge
        variant="secondary"
        className={`bg-[#e3e8d3] px-5 py-2 text-xs font-bold tracking-widest hover:bg-[#e3e8d3] ${tagClass}`}
      >
        {tag}
      </Badge>
      <h2 className="font-display mt-5 text-4xl leading-tight font-bold text-[#12291d] md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-lg text-[#5b665a]">{intro}</p>
    </Reveal>
  )
}

function ConceptCard({
  visual,
  title,
  children,
  delay = 0,
}: {
  visual: ReactNode
  title: string
  children: ReactNode
  delay?: number
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <Card className="h-full gap-0 rounded-3xl border-0 bg-[#e3e8d3] p-6 shadow-lg transition-transform duration-300 hover:-translate-y-1">
        <div className="relative h-56 overflow-hidden rounded-2xl">
          {visual}
        </div>
        <h3 className="font-display mt-6 text-2xl font-bold text-[#12291d]">
          {title}
        </h3>
        <p className="mt-3 leading-relaxed text-[#1f2f26]">{children}</p>
      </Card>
    </Reveal>
  )
}

function ImageWithBadge({
  src,
  badge,
  icon,
}: {
  src: string
  badge: string
  icon: ReactNode
}) {
  return (
    <>
      <img src={src} alt="" className="size-full object-cover" />
      <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl bg-[#12291d]/90 px-3 py-1.5 text-sm font-bold text-white">
        {icon}
        {badge}
      </span>
    </>
  )
}

function GrowthChart() {
  const { ref, inView } = useInView<SVGSVGElement>(0.4)
  return (
    <svg
      ref={ref}
      viewBox="0 0 400 224"
      className="size-full bg-[#102a1c]"
      role="img"
      aria-label="Chapman-Richards growth curve"
    >
      <line x1="30" y1="150" x2="370" y2="150" stroke="#2f5a43" />
      <line
        x1="30"
        y1="60"
        x2="370"
        y2="60"
        stroke="#2f5a43"
        strokeDasharray="4 4"
      />
      <path
        d="M30 150 C130 150 150 70 250 62 S340 52 370 52"
        fill="none"
        stroke="#10b981"
        strokeWidth="4"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={inView ? 0 : 1}
        style={{ transition: "stroke-dashoffset 1.8s ease-out" }}
      />
      <circle
        cx="110"
        cy="128"
        r="6"
        fill="#f59e0b"
        style={{ opacity: inView ? 1 : 0, transition: "opacity .5s .9s" }}
      />
      <circle
        cx="340"
        cy="54"
        r="6"
        fill="#10b981"
        style={{ opacity: inView ? 1 : 0, transition: "opacity .5s 1.7s" }}
      />
      <text x="40" y="104" fill="#f59e0b" fontSize="12" fontWeight="700">
        Lag window (high risk)
      </text>
      <text x="236" y="38" fill="#10b981" fontSize="12" fontWeight="700">
        Full recovery
      </text>
      <text x="30" y="185" fill="#fff" fontSize="12" fontWeight="700">
        Year 0 (planting)
      </text>
      <text x="150" y="205" fill="#10b981" fontSize="12" fontWeight="700">
        Chapman–Richards curve
      </text>
      <text x="290" y="185" fill="#fff" fontSize="12" fontWeight="700">
        Full offset
      </text>
    </svg>
  )
}

export function LandingPage({ onLaunch }: LandingPageProps) {
  const [activeId, setActiveId] = useState(newsVideos[0].id)
  const active = newsVideos.find((v) => v.id === activeId) ?? newsVideos[0]

  return (
    <div id="top" className="bg-[#f4f5ec] font-sans text-[#12291d]">
      <Navbar onLaunch={onLaunch} />

      {/* Hero */}
      <section
        className="relative isolate overflow-hidden bg-[#0f2a1c] px-6 pt-16 pb-24 text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(15,42,28,.85), rgba(15,42,28,.92)), url(${IMAGES.hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <RainBackground />
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-700/50 bg-emerald-900/40 px-6 py-2 font-semibold text-emerald-400">
            <span className="size-3 rounded-full bg-emerald-500" />
            Interactive Hydrological Reforestation &amp; Flood Risk Guide
          </span>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="font-display mt-10 text-8xl font-extrabold tracking-tight text-white md:text-[10rem] md:leading-none">
            BINHI
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mx-auto mt-8 max-w-4xl rounded-2xl border border-emerald-700/40 bg-emerald-900/30 px-8 py-6 text-2xl font-medium text-white italic md:text-3xl">
            Reforestation Offset Simulator: Modeling Sapling Requirements,
            Absorption Recovery, and Relative Flood Risk
          </p>
        </Reveal>
        <Reveal delay={360}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              onClick={onLaunch}
              className="h-14 gap-3 bg-emerald-700 px-8 text-lg font-bold text-white shadow-lg shadow-emerald-900/50 hover:bg-emerald-600"
            >
              <Rocket className="size-5" />
              Launch Simulator
            </Button>
            <a
              href="#purpose"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "h-14 gap-3 bg-[#e3e8d3] px-8 text-lg font-bold text-[#12291d] hover:bg-white"
              )}
            >
              Learn How It Works
              <ArrowDown className="size-5 text-emerald-700" />
            </a>
          </div>
        </Reveal>

        <Reveal>
          <div className="mx-auto mt-16 max-w-4xl rounded-3xl bg-[#e3e8d3] p-8 text-left text-[#12291d] shadow-2xl">
            <h2 className="font-display flex items-center gap-3 text-2xl font-bold">
              <Lightbulb className="size-6 text-emerald-700" /> Did You Know?
            </h2>
            <p className="mt-4 text-lg leading-relaxed">
              Every time a mature tree is cleared, the soil loses its natural
              sponge-like absorption capacity. Rainwater that used to soak deep
              into the earth now rushes over the surface as flash floods. A
              single sapling doesn't instantly replace a mature tree: saplings
              start small and face natural field mortality. That is why DENR
              regulations require planting 100 saplings for every naturally
              growing tree cut.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mx-auto mt-8 grid max-w-4xl gap-6 rounded-3xl bg-[#e3e8d3] p-8 text-left text-[#12291d] shadow-2xl md:grid-cols-2">
            <div className="relative h-60 overflow-hidden rounded-2xl">
              <ImageWithBadge
                src={IMAGES.sapling}
                badge="Watershed Protection Protocol"
                icon={<ShieldCheck className="size-4 text-emerald-400" />}
              />
            </div>
            <div className="flex flex-col justify-center gap-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold tracking-wide text-emerald-800">
                  DENR MO 2012-02 MANDATE
                </span>
                <span className="rounded-lg bg-white px-3 py-1 text-sm font-bold">
                  1 : 100 ratio
                </span>
              </div>
              <p>
                Every 1 naturally growing mature tree cut requires 100 planted
                saplings to buffer canopy interception loss and restore soil
                permeability over time.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Purpose */}
      <section id="purpose" className="scroll-mt-20 px-6 py-24">
        <SectionHeader
          tag="PURPOSE & CORE CONCEPTS"
          title="The Science Behind Reforestation Offsets"
          intro="How tree cutting, soil drainage, and multi-year recovery lags combine to create downstream flood risk."
        />
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <ConceptCard
            title="The Replacement Gap"
            visual={
              <ImageWithBadge
                src={IMAGES.forest}
                badge="1 tree cut ≠ 1 sapling planted"
                icon={<Scale className="size-4 text-emerald-400" />}
              />
            }
          >
            One mature tree absorbs an estimated{" "}
            <strong>0.046 m³ (46 liters) of water per day</strong>. Because
            newly planted saplings are small and face field mortality (modeled
            at a <strong>68% default survival rate</strong>), planting a 1-to-1
            ratio leaves watersheds vulnerable. That is why{" "}
            <strong>DENR Memorandum Order No. 2012-02</strong> requires planting{" "}
            <strong>100 saplings per naturally growing tree cut</strong>.
          </ConceptCard>
          <ConceptCard
            title="The Hydrological Shield"
            delay={120}
            visual={
              <ImageWithBadge
                src={IMAGES.water}
                badge="Runoff & soil infiltration"
                icon={<ShieldCheck className="size-4 text-emerald-400" />}
              />
            }
          >
            Rainfall behavior depends on soil structure and permeability. Porous
            soils like <strong>sand and loam</strong> absorb water quickly and
            recharge deep aquifers, while compacted soils like{" "}
            <strong>clay and gravel/dirt</strong> make rainwater pool and rush
            off as flash floods.
          </ConceptCard>
          <ConceptCard
            title="Growth Lag Time"
            delay={240}
            visual={<GrowthChart />}
          >
            Saplings do not act like mature trees overnight. Using biological
            growth curves (Chapman–Richards function fitted to{" "}
            <em>Falcataria moluccana</em>), BINHI tracks the multi-year
            transition window, showing planners and communities how long a
            watershed stays exposed to elevated runoff before the canopy fully
            recovers.
          </ConceptCard>
        </div>
      </section>

      {/* Problem & solution */}
      <section id="problem" className="scroll-mt-20 px-6 py-24">
        <SectionHeader
          tag="PROBLEM & PREVENTION"
          title="The Watershed Crisis & How BINHI Prevents Disasters"
          intro="Why conventional tree-planting counts fall short, and how simulation helps communities foresee flash floods."
        />
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <Reveal direction="left" className="h-full">
            <Card className="h-full gap-0 rounded-3xl border-0 border-t-4 border-red-600 bg-[#e3e8d3] p-8 shadow-lg">
              <Badge className="gap-2 bg-red-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-red-600">
                <TriangleAlert className="size-4" /> The core problem
              </Badge>
              <h3 className="font-display mt-5 text-3xl font-bold">
                Blind Reforestation &amp; The Vulnerability Gap
              </h3>
              <p className="mt-4 leading-relaxed">
                When local government units (LGUs) or developers cut mature
                forests for timber, agriculture, or infrastructure, standard
                policies often require tree replacement without accounting for{" "}
                <strong>temporal growth lag</strong> or{" "}
                <strong>soil compaction</strong>.
              </p>
              <ul className="mt-6 space-y-4">
                {[
                  [
                    "False sense of security",
                    "Planting saplings today does not stop next week's monsoon flash floods.",
                  ],
                  [
                    "Ignoring mortality",
                    "Overlooking seedling field mortality leaves watersheds severely under-protected.",
                  ],
                  [
                    "Soil type neglect",
                    "Treating clay soils like sandy soils leads to major runoff underestimation.",
                  ],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3">
                    <CircleX className="mt-0.5 size-5 shrink-0 text-red-600" />
                    <span>
                      <strong>{t}:</strong> {d}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 flex justify-between gap-4 rounded-2xl bg-white/70 px-5 py-4 text-sm font-bold text-red-600">
                <span>Result without planning:</span>
                <span>Severe flash floods &amp; erosion</span>
              </p>
            </Card>
          </Reveal>

          <Reveal direction="right" className="h-full">
            <Card className="h-full gap-0 rounded-3xl border-0 border-t-4 border-emerald-700 bg-[#e3e8d3] p-8 shadow-lg">
              <Badge className="gap-2 bg-emerald-700 px-4 py-1.5 text-sm font-bold text-white hover:bg-emerald-700">
                <ShieldCheck className="size-4" /> How BINHI solves it
              </Badge>
              <h3 className="font-display mt-5 text-3xl font-bold">
                Proactive Modeling &amp; Risk-Aware Planning
              </h3>
              <p className="mt-4 leading-relaxed">
                BINHI bridges ecological policy and hydrological science in an
                interactive sandbox tool. By simulating daily rainfall, soil
                absorption, and sapling maturation, it gives planners actionable
                foresight.
              </p>
              <ul className="mt-6 space-y-4">
                {[
                  [
                    "Quantifying lead time",
                    "Planners see how many years a community stays exposed before canopy closure.",
                  ],
                  [
                    "Survival-adjusted targets",
                    "Mortality buffers are computed so planting counts match real-world survival.",
                  ],
                  [
                    "Regional climatology",
                    "Scenarios run against regional PAGASA storm normals to prepare for peak monsoon months.",
                  ],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3">
                    <CircleCheck className="mt-0.5 size-5 shrink-0 text-emerald-700" />
                    <span>
                      <strong>{t}:</strong> {d}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 flex justify-between gap-4 rounded-2xl bg-white/70 px-5 py-4 text-sm font-bold text-emerald-800">
                <span>Result with BINHI:</span>
                <span>Informed LGU decisions &amp; disaster resilience</span>
              </p>
            </Card>
          </Reveal>
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-[#5b665a]">
          BINHI reports relative flood risk for planning and education. It is
          not a flood forecast or an engineering assessment.
        </p>
      </section>

      {/* News */}
      <section id="news" className="scroll-mt-20 px-6 py-24">
        <SectionHeader
          tag="REAL-WORLD HAZARDS & NEWS"
          tagClass="text-red-600"
          title="Deforestation & Flooding in the News"
          intro="Investigative reports and broadcasts on how mountain clearing, illegal logging, and lost ground permeability drive flooding across Philippine watersheds."
        />
        <Reveal className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-[#e3e8d3] p-8 shadow-lg">
            <div className="aspect-video overflow-hidden rounded-2xl bg-black">
              {active.youtubeId ? (
                <iframe
                  key={active.id}
                  className="size-full"
                  src={`https://www.youtube.com/embed/${active.youtubeId}`}
                  title={active.title}
                  allow="accelerometer; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="grid size-full place-items-center text-white/70">
                  <span className="flex items-center gap-2">
                    <Play className="size-5" /> Add a YouTube ID in
                    news-videos.ts
                  </span>
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b border-[#c9d0b6] pb-6">
              <div className="max-w-2xl">
                <span
                  className={`text-xs font-bold tracking-wide ${active.accent}`}
                >
                  {active.source.toUpperCase()} REPORT
                </span>
                <h3 className="mt-1 text-xl font-bold">{active.title}</h3>
              </div>
              {active.youtubeId && (
                <a
                  href={`https://www.youtube.com/watch?v=${active.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-11 gap-2 border-0 bg-white font-bold text-emerald-800 shadow hover:bg-[#f4f5ec]"
                  )}
                >
                  <ExternalLink className="size-4" /> Watch on YouTube
                </a>
              )}
            </div>
            <p className="mt-6 text-sm font-bold tracking-wide text-[#5b665a]">
              SELECT A BROADCAST
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {newsVideos.map((v) => (
                <Button
                  key={v.id}
                  variant="ghost"
                  onClick={() => setActiveId(v.id)}
                  aria-pressed={v.id === activeId}
                  className={`h-auto flex-col items-start gap-1 rounded-2xl bg-[#f4f5ec] p-4 text-left whitespace-normal ${
                    v.id === activeId
                      ? "ring-2 ring-emerald-700"
                      : "hover:bg-white"
                  }`}
                >
                  <span className={`text-xs font-bold ${v.accent}`}>
                    {v.source.toUpperCase()} • {v.duration}
                  </span>
                  <span className="font-bold">{v.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <Reveal className="mx-auto max-w-6xl">
          <div
            className="relative overflow-hidden rounded-[2rem] px-8 py-20 text-center"
            style={{
              backgroundImage: `linear-gradient(rgba(18,52,34,.82), rgba(18,52,34,.9)), url(${IMAGES.canopy})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h2 className="font-display mx-auto max-w-3xl text-4xl leading-tight font-bold text-white md:text-6xl">
              Ready to Model Reforestation Scenarios with{" "}
              <span className="text-emerald-400">BINHI</span>?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#d4dccb]">
              Select a Philippine region, choose a ground type, set the share of
              mature trees removed, and run the simulation to explore absorption
              recovery and relative flood risk.
            </p>
            <Button
              size="lg"
              onClick={onLaunch}
              className="mt-10 h-14 gap-3 bg-emerald-700 px-8 text-lg font-bold text-white shadow-lg shadow-emerald-900/50 hover:bg-emerald-600"
            >
              <Rocket className="size-5" />
              Launch Simulator
            </Button>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  )
}
