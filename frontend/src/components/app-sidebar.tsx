import { CloudRain, Table2, TreePine } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import{
    Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarRail,
} from "../components/ui/sidebar"

interface NavItem{
    title:string;
    targetId:string;
    icon:LucideIcon;
}