"use client"

import dynamic from "next/dynamic"
import { useCallback } from "react"
import { cn } from "@/lib/utils"

const GoogleReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
})

interface ReCaptchaCheckboxProps {
  onChange: (token: string | null) => void
  className?: string
  size?: "normal" | "compact"
  theme?: "light" | "dark"
  tabIndex?: number
}

export function ReCaptchaCheckbox({
  onChange,
  className,
  size = "normal",
  theme = "light",
  tabIndex,
}: ReCaptchaCheckboxProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  const handleChange = useCallback(
    (token: string | null) => {
      onChange(token)
    },
    [onChange]
  )

  if (!siteKey) {
    console.warn("NEXT_PUBLIC_RECAPTCHA_SITE_KEY manquant")
    return null
  }

  return (
    <div className={cn("flex justify-center", className)}>
      <GoogleReCAPTCHA
        sitekey={siteKey}
        onChange={handleChange}
        onExpired={() => onChange(null)}
        size={size}
        theme={theme}
        tabIndex={tabIndex}
      />
    </div>
  )
}

