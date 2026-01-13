import { LayoutDashboard, Users, UserCog, BarChart3, List, TrendingUp, Eye, Settings } from "lucide-react"
import { Link } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items
const items = [
  {
    title: "Home",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Lead List",
    url: "/leadlist",
    icon: List,
  },
  {
    title: "Sales Agents",
    url: "/salesmanagement",
    icon: UserCog,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "Lead Status Wise",
    url: "/leadstatus",
    icon: TrendingUp,
  },
  {
    title: "Sales Agent View",
    url: "/salesagentview",
    icon: Eye,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Avanya CRM</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}