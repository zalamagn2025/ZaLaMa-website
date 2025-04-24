import { IconCoin, IconCreditCard, IconReceipt, IconArrowUpRight } from "@tabler/icons-react"

export function ProfileStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Solde disponible" 
        value="2,500,000 GNF" 
        icon={<IconCoin className="h-6 w-6 text-yellow-500" />}
        change="+15.3%"
        trend="up"
      />
      <StatCard 
        title="Acompte disponible" 
        value="750,000 GNF" 
        icon={<IconCreditCard className="h-6 w-6 text-blue-500" />}
        change="30% du salaire"
        trend="neutral"
      />
      <StatCard 
        title="Prêts actifs" 
        value="1,200,000 GNF" 
        icon={<IconReceipt className="h-6 w-6 text-green-500" />}
        change="1 prêt"
        trend="neutral"
      />
      <StatCard 
        title="Limite de crédit" 
        value="5,000,000 GNF" 
        icon={<IconArrowUpRight className="h-6 w-6 text-indigo-500" />}
        change="50% utilisé"
        trend="neutral"
      />
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  change: string
  trend: "up" | "down" | "neutral"
}

function StatCard({ title, value, icon, change, trend }: StatCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-500"
      case "down":
        return "text-red-500"
      default:
        return "text-gray-500 dark:text-gray-400"
    }
  }

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
        <span className={`text-sm ${getTrendColor()}`}>
          {change}
        </span>
      </div>
    </div>
  )
} 