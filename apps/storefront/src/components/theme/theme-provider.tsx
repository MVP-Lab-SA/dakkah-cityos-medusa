import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { ReactNode } from "react"

type Theme = "light" | "dark" | "auto"

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "auto",
  resolvedTheme: "light",
  setTheme: () => {},
})

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "auto"
  try {
    const stored = localStorage.getItem("ds-theme")
    if (stored === "light" || stored === "dark" || stored === "auto") return stored
  } catch {}
  return "auto"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("auto")
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const stored = getStoredTheme()
    setThemeState(stored)
    setResolvedTheme(stored === "auto" ? getSystemTheme() : stored)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const resolved = theme === "auto" ? getSystemTheme() : theme
    setResolvedTheme(resolved)
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(resolved)
  }, [theme])

  useEffect(() => {
    if (typeof window === "undefined") return
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (theme === "auto") {
        const resolved = getSystemTheme()
        setResolvedTheme(resolved)
        document.documentElement.classList.remove("light", "dark")
        document.documentElement.classList.add(resolved)
      }
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("ds-theme", newTheme)
      } catch {}
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
