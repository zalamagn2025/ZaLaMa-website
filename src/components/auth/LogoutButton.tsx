"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { useEmployeeAuth } from "@/contexts/EmployeeAuthContext";

interface LogoutButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  children?: React.ReactNode;
}

export default function LogoutButton({ 
  className = "", 
  variant = "default",
  size = "md",
  showIcon = true,
  children = "Déconnexion"
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { logout } = useEmployeeAuth();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      
      // Redirection vers la page de connexion
      router.push("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // Même en cas d'erreur, rediriger vers la page de connexion
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Classes de base
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Classes selon la variante
  const variantClasses = {
    default: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline: "border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500",
    ghost: "text-red-600 hover:bg-red-50 focus:ring-red-500"
  };
  
  // Classes selon la taille
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={buttonClasses}
    >
      {isLoggingOut ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Déconnexion...
        </>
      ) : (
        <>
          {showIcon && <LogOut className="w-4 h-4 mr-2" />}
          {children}
        </>
      )}
    </button>
  );
}
