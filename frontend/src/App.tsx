import { BrowserRouter, Route, Routes } from "react-router-dom"
import AppSidebar from "@/components/app-sidebar"
import SimulationForm from "@/components/simulation-form"
import MethodologyPage from "@/pages/methodology-page"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">
              Deforestation Offset Simulator
            </h1>
          </header>

          <Routes>
            <Route path="/" element={<SimulationForm />} />
            <Route path="/methodology" element={<MethodologyPage />} />
          </Routes>
        </SidebarInset>
      </SidebarProvider>
    </BrowserRouter>
  )
}
