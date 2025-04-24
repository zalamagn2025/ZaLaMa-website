import { IconUsers, IconUserPlus, IconUserCheck, IconUserX } from "@tabler/icons-react"

export function UserStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Utilisateurs" 
        value="1,248" 
        icon={<IconUsers className="h-6 w-6 text-blue-500" />}
        change="+12.5%"
        trend="up"
      />
      <StatCard 
        title="Nouveaux Utilisateurs" 
        value="64" 
        icon={<IconUserPlus className="h-6 w-6 text-green-500" />}
        change="+8.2%"
        trend="up"
      />
      <StatCard 
        title="Utilisateurs Actifs" 
        value="986" 
        icon={<IconUserCheck className="h-6 w-6 text-indigo-500" />}
        change="+5.1%"
        trend="up"
      />
      <StatCard 
        title="Utilisateurs Inactifs" 
        value="262" 
        icon={<IconUserX className="h-6 w-6 text-gray-500" />}
        change="-3.4%"
        trend="down"
      />
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  change: string
  trend: "up" | "down"
}

function StatCard({ title, value, icon, change, trend }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1 dark:text-white">{value}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">{icon}</div>
      </div>
      <div className="mt-4">
        <span className={`text-sm ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
          {change}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">depuis le mois dernier</span>
      </div>
    </div>
  )
} 