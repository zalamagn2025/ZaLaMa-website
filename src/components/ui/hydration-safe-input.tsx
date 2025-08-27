import * as React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export interface HydrationSafeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
}

const HydrationSafeInput = React.forwardRef<HTMLInputElement, HydrationSafeInputProps>(
  ({ className, type, ...props }, ref) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    // Pendant l'hydratation, supprimer complètement les attributs problématiques
    const cleanProps = { ...props };
    
    if (!isClient) {
      // Supprimer tous les attributs qui peuvent causer des problèmes d'hydratation
      delete cleanProps.autoComplete;
      delete (cleanProps as any)['data-lpignore'];
      delete (cleanProps as any)['data-form-type'];
      delete (cleanProps as any)['data-1p-ignore'];
      delete (cleanProps as any)['data-bwignore'];
      delete (cleanProps as any)['data-1p-ignore'];
      delete (cleanProps as any)['data-bwignore'];
      delete (cleanProps as any)['data-form-type'];
      delete (cleanProps as any)['data-lpignore'];
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...cleanProps}
      />
    )
  }
)
HydrationSafeInput.displayName = "HydrationSafeInput"

export { HydrationSafeInput }

