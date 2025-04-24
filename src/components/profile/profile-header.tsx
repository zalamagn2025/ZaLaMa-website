import { IconEdit, IconBell } from "@tabler/icons-react"

export function ProfileHeader() {
  // Données fictives pour la démonstration
  const user = {
    name: "Mory koulibaly ",
    phone: "+224 625 21 21 15",
    email: "mory.koulibaly@example.com",
    role: "Employé",
    entreprise:"ZALAMA",
    department: "Direction générale",
    joinDate: "12 Mars 2023",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-photo.jpg-R1e1uXntiyEHv8U1TpMMPbJ2lWRbQ6.jpeg"
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-[#0524DD] to-[#FF671E]">
        
      </div>
      <div className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between -mt-16">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0">
            <div className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-3xl font-bold text-indigo-800 dark:text-indigo-300">
           
            </div>
          </div>
          <div className="mt-4 md:mt-0 md:ml-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="mr-1">📱</span>
                {user.phone}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="mr-1">📧</span>
                {user.email}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="mr-1">🏢</span>
                {user.department}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="mr-1">📅</span>
                Inscrit le {user.joinDate}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="mr-1">🏢</span>
                {user.entreprise}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 md:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900">
            <IconBell className="h-4 w-4 mr-2" />
            Notifications
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900">
            <IconEdit className="h-4 w-4 mr-2" />
            Modifier le profil
          </button>
        </div>
      </div>
    </div>
  )
} 