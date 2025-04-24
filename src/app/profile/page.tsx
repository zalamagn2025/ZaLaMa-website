import { ProfileHeader } from "@/components/profile/profile-header"
import { FinancialServices } from "@/components/profile/financial-services"
import { TransactionHistory } from "@/components/profile/transaction-history"
import { ProfileStats } from "@/components/profile/profile-stats"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <ProfileHeader />
                
                <div className="mt-6">
                  <ProfileStats />
                </div>
                
                <div className="mt-8">
                  <Tabs defaultValue="services" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                      <TabsTrigger value="services">Services Financiers</TabsTrigger>
                      <TabsTrigger value="history">Historique</TabsTrigger>
                      <TabsTrigger value="settings">Paramètres</TabsTrigger>
                    </TabsList>
                    <TabsContent value="services" className="mt-2">
                      <FinancialServices />
                    </TabsContent>
                    <TabsContent value="history" className="mt-2">
                      <TransactionHistory />
                    </TabsContent>
                    <TabsContent value="settings" className="mt-2">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Paramètres du compte</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Les paramètres du compte seront disponibles prochainement.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
  
  )
} 