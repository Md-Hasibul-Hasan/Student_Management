"use client"

import * as React from "react"

import { NavUser } from "@/components/nav-user"
import { NavCombo } from "@/components/nav-combo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Logo } from "./logo"
import { DashboardSwitcher } from "./dashboard-switcher"


export function AppSidebar({
  logo,
  teams,
  combo,
  single,
  user,
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>

      <SidebarHeader>
        {/* <TeamSwitcher teams={teams} /> */}
        <Logo data={logo} />
        {/* <DashboardSwitcher teams={teams} /> */}
      </SidebarHeader>

      <SidebarContent>
        <NavCombo data={combo} />
        <NavCombo data={combo} />
        {/* <NavSingle data={single} /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />

    </Sidebar>
  );
}
