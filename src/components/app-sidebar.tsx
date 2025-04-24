"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,

  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconBell,
  IconMoon,
  IconSun,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin ZaLaMa",
    email: "admin@zalama.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Tableau de bord",
      url: "/dashboard/entreprise",
      icon: IconDashboard,
    },
    {
      title: "Utilisateurs",
      url: "/dashboard/entreprise/utilisateurs",
      icon: IconUsers,
    },
    {
      title: "Finances",
      url: "/dashboard/entreprise/finances",
      icon: IconChartBar,
    },
    {
      title: "Services",
      url: "/dashboard/entreprise/services",
      icon: IconFolder,
    },
    {
      title: "Partenaires",
      url: "/dashboard/entreprise/partenaires",
      icon: IconUsers,
    },
    {
      title: "Alertes & Risques",
      url: "/dashboard/entreprise/alertes",
      icon: IconReport,
    },
    {
      title: "Objectifs & Performances",
      url: "/dashboard/entreprise/performance",
      icon: IconListDetails,
    },
    {
      title: "Graphiques & Visualisations",
      url: "/dashboard/entreprise/visualisations",
      icon: IconChartBar,
    },
  ],
  navSecondary: [
    {
      title: "Paramètres",
      url: "/dashboard/entreprise/settings",
      icon: IconSettings,
    },
    {
      title: "Aide",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Recherche",
      url: "#",
      icon: IconSearch,
    },
    {
      title: "Déconnexion",
      url: "/logout",
      icon: IconInnerShadowTop,
    },
  ],
  documents: [
    {
      name: "Rapports mensuels",
      url: "#",
      icon: IconFileDescription,
    },
    {
      name: "Données utilisateurs",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Analyses prédictives",
      url: "#",
      icon: IconFileAi,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [darkMode, setDarkMode] = React.useState(false);
  
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-between items-center w-full">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard/entreprise">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">ZaLaMa Admin</span>
              </a>
            </SidebarMenuButton>
            
            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ml-auto"
            >
              {darkMode ? <IconSun className="size-5" /> : <IconMoon className="size-5" />}
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary 
          items={data.navSecondary.map(item => {
            if (item.title === "Notifications") {
              return {
                ...item,
                icon: () => (
                  <div className="relative">
                    <IconBell className="size-5" />
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                    Badge
                    </span>
                  </div>
                )
              };
            }
            return item;
          })} 
          className="mt-auto" 
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser 
          user={data.user}
          renderName={(name) => (
            <div className="flex flex-col">
              <span>{name}</span>
              <span className="text-xs text-gray-500">Admin</span>
            </div>
          )}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
