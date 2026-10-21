import {
  BookOpen,
  Flag,
  ListChecks,
  MapPin,
  Play,
  ShieldAlert,
  TriangleAlert,
  Users,
} from "lucide-react"
import { PROJECT } from "@/lib/project"
import { SEVERITY, type Severity } from "@/lib/interpret"

function Block({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="clay-sm p-4">
      <h3 className="mb-2 flex items-center gap-2 text-[15px] font-extrabold text-emerald-900">
        <Icon className="size-4.5 text-emerald-600" aria-hidden />
        {title}
      </h3>
      <div className="space-y-2 text-sm leading-relaxed">{children}</div>
    </section>
  )
}

const List = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="list-disc space-y-1 pl-5">
    {items.map((i, k) => (
      <li key={k}>{i}</li>
    ))}
  </ul>
)

/** The full guide: used in the Guide sheet and on the About page. */
export function GuideContent({ twoColumn = false }: { twoColumn?: boolean }) {
  return (
    <div
      className={
        twoColumn
          ? "gap-4 lg:columns-2 [&>*]:mb-4 [&>*]:break-inside-avoid"
          : "space-y-3"
      }
    >
      <Block icon={BookOpen} title="What is BINHI?">
        <p>
          <b>BINHI</b> (Filipino for “seed”) is a simulator made by{" "}
          <b>{PROJECT.team}</b>. It shows what happens to rainwater and flood
          risk when trees are cut and replaced by newly planted saplings.
        </p>
      </Block>

      <Block icon={MapPin} title="What are we simulating?">
        <p>
          A stand of mature trees is partly cut. The law asks for many new trees
          to replace each one (100 saplings per tree, DENR Memorandum Order
          2012-02). But saplings are small: they soak up much less water than
          the old trees, and only catch up as they grow.
        </p>
        <p>
          BINHI plays out{" "}
          <b>one year, month by month, from January to December</b>. Each month
          it makes random daily rain (based on PAGASA 1991–2020 monthly normals
          for a station in the region), works out how much runs off the ground,
          subtracts what the trees and saplings soak up, and checks whether
          water would pile up faster than it drains.
        </p>
        <p>
          The result is a month-by-month answer to:{" "}
          <i>“Can the ground still handle the rain after this cut?”</i>
        </p>
      </Block>

      <Block icon={Flag} title="Objectives">
        <List
          items={[
            "Work out how many saplings must be planted to offset the trees cut.",
            "Show how the ground's water absorption recovers over time as saplings grow.",
            "Estimate the relative flood risk each month under simulated rainfall.",
            "Show how long before cutting the saplings should be planted.",
            "Explain every result in plain language and produce a report with severity.",
          ]}
        />
      </Block>

      <Block icon={Users} title="Who is it for?">
        <List
          items={[
            "Local government units (LGUs) and barangay planners weighing cutting and replanting plans.",
            "DENR and forestry staff reviewing replacement-planting requirements.",
            "Community and environmental groups who want to see the effect of tree cutting on flooding.",
            "Students, researchers and reviewers who want to compare scenarios.",
          ]}
        />
      </Block>

      <Block icon={ListChecks} title="How to use it">
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            Tap a <b>region</b> on the map.
          </li>
          <li>
            Pick the <b>ground type</b> from the dropdown at the top.
          </li>
          <li>
            Slide how many <b>trees to cut</b>.
          </li>
          <li>
            Press <b>Simulate</b>. The year plays month by month; pause or
            replay it any time.
          </li>
          <li>
            Read the <b>interpretation</b> and severity on the right.
          </li>
          <li>
            Press <b>Report</b> to save the results as a PDF.
          </li>
        </ol>
      </Block>

      <Block icon={ShieldAlert} title="How to read the results">
        <p>Each month is marked:</p>
        <List
          items={[
            <>
              <b className="text-emerald-600">Safe</b>: the ground keeps up with
              the rain.
            </>,
            <>
              <b className="text-amber-500">Be careful</b>: the ground is close
              to its limit.
            </>,
            <>
              <b className="text-red-600">Danger</b>: flooding is likely.
            </>,
          ]}
        />
        <p>The whole year then gets a severity:</p>
        <div className="grid gap-1.5">
          {(Object.keys(SEVERITY) as Severity[]).map((k) => (
            <div key={k} className="flex items-start gap-2">
              <span
                className={`mt-0.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${SEVERITY[k].badge}`}
              >
                {SEVERITY[k].label}
              </span>
              <span>{SEVERITY[k].meaning}</span>
            </div>
          ))}
        </div>
      </Block>

      <Block icon={TriangleAlert} title="Good to know">
        <List
          items={[
            "Severity is a relative score for comparing scenarios. It is not a forecast of flood depth.",
            "The rain is one simulated year. It is not a prediction of next year's weather.",
            "Only regions with confirmed rain data are shown. Gravel or dirt and Partial pavement use estimated soak-in values.",
            "This tool supports planning. It does not replace a field survey or a permit review.",
          ]}
        />
      </Block>

      <p className="flex items-center justify-center gap-1.5 pb-1 text-xs text-muted-foreground">
        <Play className="size-3" aria-hidden /> {PROJECT.name} · by{" "}
        {PROJECT.team}
      </p>
    </div>
  )
}
