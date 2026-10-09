"use client"

import { ComputerDesktopIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function ThemeSwitcher({
  isCircle = false,
  intent = "outline",
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light"
    setTheme(nextTheme)
  }

  // The stored theme is unknown on the server, so show the system icon until mounted.
  const current = mounted ? theme : "system"

  return (
    <Button
      isCircle={isCircle}
      intent={intent}
      className={className}
      size="sq-sm"
      aria-label="Switch theme"
      onPress={toggleTheme}
      {...props}
    >
      {current === "light" ? <SunIcon /> : current === "dark" ? <MoonIcon /> : <ComputerDesktopIcon />}
    </Button>
  )
}
