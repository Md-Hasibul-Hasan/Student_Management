// app/(dashboard)/layout.jsx

import AppHeader from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SettingsIcon,  GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon,  BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon , LayoutDashboardIcon,Plus} from "lucide-react"


import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";


// This is sample data.
const data = {
  logo: {
    title: "Dashboard",
    description: "Student Dashboard",
    url: "/Student",
  },
  user: {
    name: "Hasib",
    email: "m@example.com",
    avatar: "/pp.jpg",
  },
  teams: [
    {
      name: "Admin",
      logo: (
        <GalleryVerticalEndIcon />
      ),
      plan: "Dashboard",
      url : "/dashboard"
    },
    {
      name: "User",
      logo: (
        <AudioLinesIcon />
      ),
      plan: "Dashboard",
      url : "/user_dashboard"
    },
  ],
  Single: [
    
  ],

  Combo :[
    {
      title: "Dashboard",
      url: "/Student",
      icon: <LayoutDashboardIcon />,
    },

    {
      title: "SetUp",
      icon: <FrameIcon />,
      isActive: true,
      items: [
        {
          title: "Class",
          url: "/Student/Setup/Class",
          icon: <Plus/>
        },
        {
          title: "Section",
          url: "/Student/Setup/Section",
          icon: <Plus/>
        },
      ],
    },


    {
      title: "Settings",
      url: "/settings",
      icon: <SettingsIcon />,
    },
  ]

}


export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar logo={data.logo} teams={data.teams} combo={data.Combo} single={data.Single} user={data.user} />

      <SidebarInset>
        <AppHeader />

        <main className="p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}