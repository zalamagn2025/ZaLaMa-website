"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react'
import { useTheme } from 'next-themes'

interface ThemeToggleProps {
  variant?: 'button' | 'switch' | 'dropdown'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ThemeToggle({ 
  variant = 'button', 
  className = '',
  size = 'md'
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  }

  const getThemeIcon = () => {
    if (theme === 'system') {
      return <IconDeviceDesktop size={iconSizes[size]} />
    }
    return resolvedTheme === 'dark' ? 
      <IconMoon size={iconSizes[size]} /> : 
      <IconSun size={iconSizes[size]} />
  }

  const getNextTheme = () => {
    if (theme === 'light') return 'dark'
    if (theme === 'dark') return 'system'
    return 'light'
  }

  const handleToggle = () => {
    setTheme(getNextTheme())
  }

  if (variant === 'switch') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF671E] to-[#FF8E53] text-white shadow-lg hover:shadow-[#FF671E]/40 transition-all duration-300 ${sizeClasses[size]} ${className}`}
        title={`Thème actuel: ${theme === 'system' ? 'Système' : theme === 'dark' ? 'Sombre' : 'Clair'}`}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {getThemeIcon()}
        </motion.div>
      </motion.button>
    )
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          className={`flex items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 ${sizeClasses[size]}`}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {getThemeIcon()}
          </motion.div>
        </motion.button>
      </div>
    )
  }

  // Variant 'button' par défaut
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      className={`flex items-center justify-center rounded-lg bg-gradient-to-r from-[#FF671E] to-[#FF8E53] text-white shadow-lg hover:shadow-[#FF671E]/40 transition-all duration-300 ${sizeClasses[size]} ${className}`}
      title={`Basculer vers ${getNextTheme() === 'system' ? 'Système' : getNextTheme() === 'dark' ? 'Sombre' : 'Clair'}`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 180, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {getThemeIcon()}
      </motion.div>
    </motion.button>
  )
} 