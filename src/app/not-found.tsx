"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { IconArrowLeft, IconHome } from "@tabler/icons-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md text-center">
        <Image 
          src="https://www.zalamagn.com/images/Logo_vertical.svg" 
          alt="ZaLaMa Logo" 
          width={100} 
          height={100}
          className="mx-auto mb-6"
        />
        
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Page introuvable
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => router.back()}
          >
            <IconArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          
          <Button 
            className="flex items-center gap-2"
            onClick={() => router.push("/")}
          >
            <IconHome className="h-4 w-4" />
            Accueil
          </Button>
        </div>
        
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Besoin d'aide? Contactez notre support au{" "}
            <a href="tel:+33123456789" className="font-medium text-primary hover:text-primary/80">
              01 23 45 67 89
            </a>
          </p>
        </div>
        
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} ZaLaMa. Tous droits réservés.
        </p>
      </div>
    </div>
  )
} 