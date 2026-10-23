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
import { CTA, HERO, NEWS, PROBLEM, PURPOSE } from "@/data/landing-content"

// **bold** markers in the content file become <strong>
function rich(text: string): ReactNode {
  return text
    .split("**")
    .map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))
}

// Photo background with a plain green fallback when no image is set
const heroBg = (image: string, a: number, b: number) =>
  image
    ? `linear-gradient(rgba(15,42,28,${a}), rgba(15,42,28,${b})), url(${image})`
    : `linear-gradient(rgba(15,42,28,${a}), rgba(15,42,28,${b}))`

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
  const [failed, setFailed] = useState(false)
  return (
    <>
      {src && !failed ? (
        <img
          src={src}
          alt=""
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="size-full bg-gradient-to-br from-[#1f4d36] to-[#0f2a1c]" />
      )}
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
  const cardIcons = [Scale, ShieldCheck, ShieldCheck]

  return (
    <div id="top" className="bg-[#f4f5ec] font-sans text-[#12291d]">
      <Navbar onLaunch={onLaunch} />

      {/* Hero */}
      <section
        className="on-dark relative isolate overflow-hidden bg-[#0f2a1c] px-6 pt-16 pb-24 text-center"
        style={{
          backgroundImage: heroBg(HERO.image, 0.85, 0.92),
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <RainBackground />
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-700/50 bg-emerald-900/40 px-6 py-2 font-semibold text-emerald-400">
            <span className="size-3 rounded-full bg-emerald-500" />
            {HERO.pill}
          </span>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="font-display mt-10 text-8xl font-extrabold tracking-tight text-white md:text-[10rem] md:leading-none">
            {HERO.title}
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mx-auto mt-8 max-w-4xl rounded-2xl border border-emerald-700/40 bg-emerald-900/30 px-8 py-6 text-2xl font-medium text-white italic md:text-3xl">
            {HERO.subtitle}
          </p>
        </Reveal>
        <Reveal delay={360}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              onClick={onLaunch}
              className="h-14 gap-3 px-8 text-lg font-bold"
            >
              <Rocket className="size-5" />
              {HERO.primaryButton}
            </Button>
            <a
              href="#purpose"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "h-14 gap-3 px-8 text-lg font-bold text-[#12291d]"
              )}
            >
              {HERO.secondaryButton}
              <ArrowDown className="size-5 text-emerald-700" />
            </a>
          </div>
        </Reveal>

        {HERO.didYouKnow.show && (
          <Reveal>
            <div className="mx-auto mt-16 max-w-4xl rounded-3xl bg-[#e3e8d3] p-8 text-left text-[#12291d] shadow-2xl">
              <h2 className="font-display flex items-center gap-3 text-2xl font-bold">
                <Lightbulb className="size-6 text-emerald-700" />{" "}
                {HERO.didYouKnow.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed">
                {rich(HERO.didYouKnow.body)}
              </p>
            </div>
          </Reveal>
        )}

        {HERO.mandate.show && (
          <Reveal>
            <div className="mx-auto mt-8 grid max-w-4xl gap-6 rounded-3xl bg-[#e3e8d3] p-8 text-left text-[#12291d] shadow-2xl md:grid-cols-2">
              <div className="relative h-60 overflow-hidden rounded-2xl">
                <ImageWithBadge
                  src={HERO.mandate.image}
                  badge={HERO.mandate.imageBadge}
                  icon={<ShieldCheck className="size-4 text-emerald-400" />}
                />
              </div>
              <div className="flex flex-col justify-center gap-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold tracking-wide text-emerald-800">
                    {HERO.mandate.label}
                  </span>
                  <span className="rounded-lg bg-white px-3 py-1 text-sm font-bold">
                    {HERO.mandate.ratio}
                  </span>
                </div>
                <p>{rich(HERO.mandate.body)}</p>
              </div>
            </div>
          </Reveal>
        )}
      </section>

      {/* Purpose */}
      {PURPOSE.show && (
        <section id="purpose" className="scroll-mt-20 px-6 py-24">
          <SectionHeader
            tag={PURPOSE.tag}
            title={PURPOSE.title}
            intro={PURPOSE.intro}
          />
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
            {PURPOSE.cards.map((c, i) => {
              const Icon = cardIcons[i % cardIcons.length]
              return (
                <ConceptCard
                  key={c.title}
                  title={c.title}
                  delay={i * 120}
                  visual={
                    c.visual === "growth-chart" ? (
                      <GrowthChart />
                    ) : (
                      <ImageWithBadge
                        src={c.image}
                        badge={c.imageBadge}
                        icon={<Icon className="size-4 text-emerald-400" />}
                      />
                    )
                  }
                >
                  {rich(c.body)}
                </ConceptCard>
              )
            })}
          </div>
        </section>
      )}

      {/* Problem & solution */}
      {PROBLEM.show && (
        <section id="problem" className="scroll-mt-20 px-6 py-24">
          <SectionHeader
            tag={PROBLEM.tag}
            title={PROBLEM.title}
            intro={PROBLEM.intro}
          />
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
            <Reveal direction="left" className="h-full">
              <Card className="h-full gap-0 rounded-3xl border-0 border-t-4 border-red-600 bg-[#e3e8d3] p-8 shadow-lg">
                <Badge className="gap-2 bg-red-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-red-600">
                  <TriangleAlert className="size-4" /> {PROBLEM.problem.badge}
                </Badge>
                <h3 className="font-display mt-5 text-3xl font-bold">
                  {PROBLEM.problem.title}
                </h3>
                <p className="mt-4 leading-relaxed">
                  {rich(PROBLEM.problem.body)}
                </p>
                <ul className="mt-6 space-y-4">
                  {PROBLEM.problem.items.map((it) => (
                    <li key={it.title} className="flex gap-3">
                      <CircleX className="mt-0.5 size-5 shrink-0 text-red-600" />
                      <span>
                        <strong>{it.title}:</strong> {it.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 flex justify-between gap-4 rounded-2xl bg-white/70 px-5 py-4 text-sm font-bold text-red-600">
                  <span>{PROBLEM.problem.resultLabel}</span>
                  <span>{PROBLEM.problem.result}</span>
                </p>
              </Card>
            </Reveal>

            <Reveal direction="right" className="h-full">
              <Card className="h-full gap-0 rounded-3xl border-0 border-t-4 border-emerald-700 bg-[#e3e8d3] p-8 shadow-lg">
                <Badge className="gap-2 bg-emerald-700 px-4 py-1.5 text-sm font-bold text-white hover:bg-emerald-700">
                  <ShieldCheck className="size-4" /> {PROBLEM.solution.badge}
                </Badge>
                <h3 className="font-display mt-5 text-3xl font-bold">
                  {PROBLEM.solution.title}
                </h3>
                <p className="mt-4 leading-relaxed">
                  {rich(PROBLEM.solution.body)}
                </p>
                <ul className="mt-6 space-y-4">
                  {PROBLEM.solution.items.map((it) => (
                    <li key={it.title} className="flex gap-3">
                      <CircleCheck className="mt-0.5 size-5 shrink-0 text-emerald-700" />
                      <span>
                        <strong>{it.title}:</strong> {it.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 flex justify-between gap-4 rounded-2xl bg-white/70 px-5 py-4 text-sm font-bold text-emerald-800">
                  <span>{PROBLEM.solution.resultLabel}</span>
                  <span>{PROBLEM.solution.result}</span>
                </p>
              </Card>
            </Reveal>
          </div>
          {PROBLEM.disclaimer && (
            <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-[#5b665a]">
              {PROBLEM.disclaimer}
            </p>
          )}
        </section>
      )}

      {/* News */}
      {NEWS.show && (
        <section id="news" className="scroll-mt-20 px-6 py-24">
          <SectionHeader
            tag={NEWS.tag}
            tagClass="text-red-600"
            title={NEWS.title}
            intro={NEWS.intro}
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
                      news-video.ts
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
                    <ExternalLink className="size-4" /> {NEWS.watchLabel}
                  </a>
                )}
              </div>
              <p className="mt-6 text-sm font-bold tracking-wide text-[#5b665a]">
                {NEWS.selectLabel}
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
      )}

      {/* CTA */}
      {CTA.show && (
        <section className="px-6 pb-24">
          <Reveal className="mx-auto max-w-6xl">
            <div
              className="on-dark relative overflow-hidden rounded-[2rem] bg-[#123422] px-8 py-20 text-center"
              style={{
                backgroundImage: CTA.image
                  ? `linear-gradient(rgba(18,52,34,.82), rgba(18,52,34,.9)), url(${CTA.image})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h2 className="font-display mx-auto max-w-3xl text-4xl leading-tight font-bold text-white md:text-6xl">
                {CTA.titleBefore}{" "}
                <span className="text-emerald-400">{CTA.titleHighlight}</span>
                {CTA.titleAfter}
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-[#d4dccb]">
                {CTA.body}
              </p>
              <Button
                size="lg"
                onClick={onLaunch}
                className="mt-10 h-14 gap-3 px-8 text-lg font-bold"
              >
                <Rocket className="size-5" />
                {CTA.button}
              </Button>
            </div>
          </Reveal>
        </section>
      )}

      <Footer />
    </div>
  )
}
