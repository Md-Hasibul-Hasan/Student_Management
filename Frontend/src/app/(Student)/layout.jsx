// app/(dashboard)/layout.jsx

import AppHeader from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SettingsIcon, BookOpenIcon, GalleryVerticalEndIcon, AudioLinesIcon, FrameIcon, LayoutDashboardIcon, Plus, User } from "lucide-react"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";


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
      url: "/dashboard"
    },
    {
      name: "User",
      logo: (
        <AudioLinesIcon />
      ),
      plan: "Dashboard",
      url: "/user_dashboard"
    },
  ],

  sidebar_section: [
    {
      section_title: "Management",
      section_items: [
        {
          title: "Dashboard",
          url: "/Student",
          icon: <LayoutDashboardIcon />,
        },

        {
          title: "Setup",
          icon: <FrameIcon />,
          isActive: true,
          items: [
            {
              title: "Class",
              url: "/Student/Setup/Class",
              icon: <Plus />
            },
            {
              title: "Section",
              url: "/Student/Setup/Section",
              icon: <Plus />
            },
            {
              title: "Subject",
              url: "/Student/Setup/Subject",
              icon: <Plus />
            },
          ],
        },

        {
          title: "Admission",
          icon: <BookOpenIcon />,
          isActive: true,
          items: [
            {
              title: "Admitted Students",
              url: "/Student/Admission/Students",
              icon: <Plus />
            },
            {
              title: "New Admission",
              url: "/Student/Admission",
              icon: <Plus />
            },
          ],
        },

        {
          title: "Admin Panel",
          url: `${process.env.NEXT_PUBLIC_API_URL}/admin`,
          icon: <User />,
        },
      ]
    },
  ]
}


export default function DashboardLayout({ children }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar logo={data.logo} teams={data.teams} sidebar_section={data.sidebar_section} user={data.user} />

        <SidebarInset>
          <AppHeader />

          <main className="p-6">
            {children}
          </main>

        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}