import { useLocation, useNavigate } from "react-router-dom"
import { Database, Sigma, TreePine } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../components/ui/sidebar"

interface NavItem {
  title: string
  path: string
  icon: LucideIcon
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const NAV: NavGroup[] = [
  {
    label: "Simulator",
    items: [{ title: "Simulation", path: "/", icon: TreePine }],
  },
  {
    label: "Documentation",
    items: [
      { title: "Methodology", path: "/methodology", icon: Sigma },
      { title: "Research & data", path: "/research", icon: Database },
    ],
  },
]

export default function AppSidebar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-1 font-semibold">Off-set Simulator</div>
      </SidebarHeader>

      <SidebarContent>
        {NAV.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={pathname === item.path}
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
