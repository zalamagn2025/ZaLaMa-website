"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')

  // Fonction pour obtenir le thème système
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark'
  }

  // Fonction pour appliquer le thème
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    let resolved: 'light' | 'dark'

    if (newTheme === 'system') {
      resolved = getSystemTheme()
    } else {
      resolved = newTheme
    }

    // Appliquer la classe dark sur l'élément html
    if (resolved === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    setResolvedTheme(resolved)
  }

  // Initialiser le thème au chargement
  useEffect(() => {
    // Récupérer le thème depuis localStorage
    const savedTheme = localStorage.getItem('zalama-theme') as Theme
    const initialTheme = savedTheme || 'dark'
    
    setTheme(initialTheme)
    applyTheme(initialTheme)

    // Écouter les changements de thème système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [])

  // Fonction pour changer le thème
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    applyTheme(newTheme)
    localStorage.setItem('zalama-theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme: handleSetTheme,
      resolvedTheme
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 