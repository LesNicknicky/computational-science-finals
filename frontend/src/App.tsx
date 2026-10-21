import type { CSSProperties } from "react"
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom"
import AppSidebar from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AboutPage from "@/pages/about-page"
import GuidePage from "@/pages/guide-page"
import { LandingPage } from "@/pages/landing-page"
import MethodologyPage from "@/pages/methodology-page"
import ResearchPage from "@/pages/research-pages"
import SimulationPage from "@/pages/simulation-page"

function LandingRoute() {
  const navigate = useNavigate()
  return <LandingPage onLaunch={() => navigate("/simulation")} />
}

function AppLayout() {
  return (
    <SidebarProvider style={{ "--sidebar-width": "4.5rem" } as CSSProperties}>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing: no sidebar */}
        <Route path="/" element={<LandingRoute />} />

        {/* Everything else: inside the sidebar layout */}
        <Route element={<AppLayout />}>
          <Route path="/simulation" element={<SimulationPage />} />
          <Route path="/methodology" element={<MethodologyPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
