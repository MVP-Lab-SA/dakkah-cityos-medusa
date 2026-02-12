// @ts-nocheck
import { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "@tanstack/react-router"

const LOCALES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
]

interface LocaleSwitcherProps {
  currentLocale: string
  tenant: string
}

function LocaleSwitcher({ currentLocale, tenant }: LocaleSwitcherProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const current = LOCALES.find((l) => l.code === currentLocale) || LOCALES[0]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (code: string) => {
    setOpen(false)
    if (code === currentLocale) return

    const path = location.pathname
    const pattern = `/${tenant}/${currentLocale}`
    const newPath = path.startsWith(pattern)
      ? path.replace(pattern, `/${tenant}/${code}`)
      : `/${tenant}/${code}`

    navigate({ to: newPath })
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ds-foreground bg-ds-card border border-ds-border rounded-lg hover:bg-ds-muted transition-colors"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <svg
          className={`w-4 h-4 text-ds-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full mt-1 end-0 w-44 bg-ds-card border border-ds-border rounded-lg shadow-lg overflow-hidden z-50"
          role="listbox"
          aria-label="Select language"
        >
          {LOCALES.map((loc) => (
            <button
              key={loc.code}
              onClick={() => handleSelect(loc.code)}
              role="option"
              aria-selected={loc.code === currentLocale}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                loc.code === currentLocale
                  ? "bg-ds-primary/10 text-ds-primary font-medium"
                  : "text-ds-foreground hover:bg-ds-muted"
              }`}
            >
              <span className="text-base">{loc.flag}</span>
              <span>{loc.label}</span>
              {loc.code === currentLocale && (
                <svg className="w-4 h-4 ms-auto text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LocaleSwitcher
