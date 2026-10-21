import { Users } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { PROJECT } from "@/lib/project"

// Fill this in: one entry per developer. `photo` is optional (e.g. "/team/ana.jpg" in /public).
const DEVELOPERS: {
  name: string
  role: string
  bio?: string
  photo?: string
}[] = [
  { name: "Developer name", role: "Role", bio: "Short description." },
  { name: "Developer name", role: "Role", bio: "Short description." },
  { name: "Developer name", role: "Role", bio: "Short description." },
]

export default function AboutPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AppHeader />
      <div className="app-bg flex-1 p-4 md:p-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-4">
            <h2 className="text-xl font-extrabold text-emerald-900">
              About the developers
            </h2>
            <p className="max-w-3xl text-sm text-muted-foreground">
              {PROJECT.name} is made by {PROJECT.team}.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEVELOPERS.map((d, i) => (
              <section key={i} className="clay-sm flex items-start gap-3 p-4">
                {d.photo ? (
                  <img
                    src={d.photo}
                    alt={d.name}
                    className="size-16 rounded-2xl object-cover"
                  />
                ) : (
                  <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Users className="size-7" aria-hidden />
                  </span>
                )}
                <div className="min-w-0">
                  <h3 className="text-[15px] font-extrabold text-emerald-900">
                    {d.name}
                  </h3>
                  <p className="text-xs font-bold tracking-wide text-emerald-700 uppercase">
                    {d.role}
                  </p>
                  {d.bio && (
                    <p className="mt-1.5 text-sm leading-relaxed">{d.bio}</p>
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
