import SimulationForm from "./components/simulation-form"

export default function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto max-w-3xl px-4 pt-8">
        <h1 className="text-2xl font-bold">Deforestation Offset Simulator</h1>
        <p className="text-sm text-muted-foreground">
          Estimate the saplings and lead time needed to offset felled mature
          trees without raising flood risk.
        </p>
      </header>
      <SimulationForm />
    </main>
  )
}
