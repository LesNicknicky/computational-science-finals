import { AppHeader } from "@/components/app-header"
import { GuideContent } from "@/components/guide-content"
import { PROJECT } from "@/lib/project"

export default function GuidePage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AppHeader />
      <div className="app-bg flex-1 p-4 md:p-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-4">
            <h2 className="text-xl font-extrabold text-emerald-900">
              {PROJECT.name} Guide
            </h2>
            <p className="max-w-3xl text-sm text-muted-foreground">
              What the simulator does, who it is for, and how to read what it
              shows.
            </p>
          </div>
          <GuideContent twoColumn />
        </div>
      </div>
    </div>
  )
}
