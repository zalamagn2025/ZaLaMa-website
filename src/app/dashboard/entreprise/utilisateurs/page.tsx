import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { UserTable } from "@/components/users/user-table"
import { UserStats } from "@/components/users/user-stats"
import { UserFilters } from "@/components/users/user-filters"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function UsersPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Gestion des Utilisateurs</h1>
                <UserStats />
                <div className="mt-6">
                  <UserFilters />
                </div>
                <div className="mt-6">
                  <UserTable />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 