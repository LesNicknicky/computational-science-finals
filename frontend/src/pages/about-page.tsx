import { AppHeader } from "@/components/app-header"
import { PROJECT } from "@/lib/project"
import KEVIN from "/team/KEVIN.jpg"
import RICH from "/team/RICH.jpg"
import LOUIEGE from "/team/LOUIEGE.jpg"
import RAHIEM from "/team/RAHIEMPIC.jpg"

/* ------------------------------------------------------------------ */
/*  EDIT HERE: one entry per developer, shown in this order.           */
/*  - roles : one or more, each shows on its own line (top right)      */
/*  - quote : optional, shown in italics                               */
/*  - bio   : optional short description                               */
/*  - photo : optional. Put the image in /public/team/ and write       */
/*            "/team/rahiem.jpg". Leave it out to show initials.       */
/* ------------------------------------------------------------------ */
interface Developer {
  name: string
  roles: string[]
  quote?: string
  bio?: string
  photo?: string
}

const DEVELOPERS: Developer[] = [
  {
    name: "Rahiem Reyel",
    roles: ["Project Manager", "Software Engineer"],
    quote:
      "I have tasted victory, endured defeat, and risen from the ashes of both. Let history bear witness to what I have achieved. Here I stand. Unfazed.",
    bio: "The Project Manager who applies military tactics into task and hard taskmaster ",
    photo: RAHIEM,
  },
  {
    name: "Vince Kevin Legaspi",
    roles: ["IoT Engineer", "QA Master"],
    quote: "Every setback is a setup for a comeback",
    bio: "A Keen Eye is needed To win a campaign.",
    photo: KEVIN,
  },
  {
    name: "Rich Mae Oredeña",
    roles: ["Backend Lead", "AI/ML Engineer"],
    quote: "The secret of getting ahead is getting started",
    bio: "Managing The Logic was hard enough, but taking two intricate roles are far more difficult",
    photo: RICH,
  },
  {
    name: "Louiege Tabago",
    roles: ["Frontend Lead", "Document Specialist"],
    quote: "So, life actually has its own beauty—it's now possible to dream.",
    bio: "To build a structure was hard without foundation. The Project Manager couldn't ask for more",
    photo: LOUIEGE,
  },
]

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

export default function AboutPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AppHeader />
      <div className="app-bg flex-1 p-4 md:p-6">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-4">
            <h2 className="text-xl font-extrabold text-emerald-900">
              About the developers
            </h2>
            <p className="max-w-3xl text-sm text-muted-foreground">
              {PROJECT.name} is made by {PROJECT.team}.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {DEVELOPERS.map((d) => (
              <section
                key={d.name}
                className="clay-sm flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch"
              >
                {/* photo */}
                <div className="clay-inset grid size-28 shrink-0 place-items-center overflow-hidden rounded-2xl! sm:size-32">
                  {d.photo ? (
                    <img
                      src={d.photo}
                      alt={d.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span
                      className="text-3xl font-black tracking-wide text-emerald-700/70"
                      aria-hidden
                    >
                      {initials(d.name)}
                    </span>
                  )}
                </div>

                {/* name, quote, description */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                    <h3 className="text-2xl leading-tight font-extrabold text-emerald-900">
                      {d.name}
                    </h3>
                    <ul className="text-right text-[11px] font-bold tracking-wider text-emerald-700 uppercase sm:ml-auto">
                      {d.roles.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className="my-2 h-0.5 w-16 rounded-full bg-emerald-400/70"
                    aria-hidden
                  />
                  {d.quote && (
                    <p className="text-[15px] leading-snug text-emerald-950/90 italic">
                      “{d.quote}”
                    </p>
                  )}
                  {d.bio && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {d.bio}
                    </p>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
