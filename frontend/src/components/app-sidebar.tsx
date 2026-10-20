import { BookOpen, Database, Info, LayoutDashboard } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { BinhiLogo } from "@/components/binhi-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const NAV = [
  { title: "Simulate", href: "/", icon: LayoutDashboard },
  { title: "How it works", href: "/methodology", icon: BookOpen },
  { title: "Sources", href: "/research", icon: Database },
  { title: "About", href: "/about", icon: Info },
]

export function AppSidebar() {
  const { pathname } = useLocation()

  return (
    <Sidebar
      collapsible="none"
      className="clay-green sticky top-0 z-10 h-svh rounded-r-[2rem] bg-linear-to-b from-emerald-500 to-emerald-700 text-emerald-50"
    >
      <SidebarHeader className="items-center py-4">
        <BinhiLogo className="size-11 drop-shadow-[2px_3px_3px_rgba(0,60,30,0.4)]" />
      </SidebarHeader>
      <SidebarContent className="items-center px-1">
        <SidebarMenu className="gap-3">
          {NAV.map((n) => (
            <SidebarMenuItem key={n.href}>
              <SidebarMenuButton
                render={<NavLink to={n.href} />}
                isActive={pathname === n.href}
                className="clay-press h-auto flex-col items-center justify-center gap-1 rounded-2xl bg-white/10 px-1 py-2.5 text-[10px] leading-tight font-semibold text-emerald-50 shadow-[3px_4px_8px_rgba(0,60,30,0.3),-2px_-2px_6px_rgba(255,255,255,0.18)] hover:bg-white/20 hover:text-white data-active:bg-emerald-800/30 data-active:text-white data-active:shadow-[inset_3px_3px_7px_rgba(0,60,30,0.45),inset_-2px_-2px_6px_rgba(255,255,255,0.25)]"
              >
                <n.icon className="size-5!" />
                <span className="text-center whitespace-normal!">{n.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar