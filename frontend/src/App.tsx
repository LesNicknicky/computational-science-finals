import type { CSSProperties } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import AppSidebar from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AboutPage from "@/pages/about-page"
import MethodologyPage from "@/pages/methodology-page"
import ResearchPage from "@/pages/research-pages"
import SimulationPage from "@/pages/simulation-page"

export default function App() {
  return (
    <BrowserRouter>
      <SidebarProvider
        style={{ "--sidebar-width": "4.5rem" } as CSSProperties}
      >
        <AppSidebar />
        <SidebarInset>
          <Routes>
            <Route path="/" element={<SimulationPage />} />
            <Route path="/methodology" element={<MethodologyPage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </SidebarInset>
      </SidebarProvider>
    </BrowserRouter>
  )
}