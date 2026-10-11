import { BookOpen, Database, LayoutDashboard, TreePine } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
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
]

export function AppSidebar() {
  const { pathname } = useLocation()

  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 h-svh bg-linear-to-b from-emerald-700 to-emerald-900 text-emerald-50"
    >
      <SidebarHeader className="items-center py-4">
        <TreePine className="size-7" aria-label="Offset Simulator" />
      </SidebarHeader>
      <SidebarContent className="items-center px-1">
        <SidebarMenu>
          {NAV.map((n) => (
            <SidebarMenuItem key={n.href}>
              <SidebarMenuButton
                render={<NavLink to={n.href} />}
                isActive={pathname === n.href}
                className="h-auto flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] leading-tight text-emerald-100 hover:bg-white/15 hover:text-white data-active:bg-white/20 data-active:text-white"
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