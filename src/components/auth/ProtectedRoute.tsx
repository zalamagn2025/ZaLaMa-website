"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEmployeeAuth } from "@/contexts/EmployeeAuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  fallback,
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, employee } = useEmployeeAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("🔍 ProtectedRoute Debug:", { loading, isAuthenticated, redirectTo, hasEmployee: !!employee });
    
    // Seulement rediriger si on n'est pas en train de charger ET qu'on n'est pas authentifié ET qu'on n'a pas d'employé
    if (!loading && !isAuthenticated && !employee) {
      console.log("🔒 Accès refusé, redirection vers:", redirectTo);
      // Ajouter un délai plus long pour permettre à l'état de se stabiliser
      const timer = setTimeout(() => {
        router.push(redirectTo);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading, employee, router, redirectTo]);

  // Afficher un loader pendant le chargement
  if (loading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#FF671E]" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié ET n'a pas d'employé, ne rien afficher (redirection en cours)
  if (!isAuthenticated && !employee) {
    return null;
  }

  // Si l'utilisateur est authentifié, afficher le contenu protégé
  return <>{children}</>;
}
