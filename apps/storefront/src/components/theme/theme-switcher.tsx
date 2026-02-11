import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useTheme } from "./theme-provider"

type Theme = "light" | "dark" | "auto"

interface ThemeSwitcherProps {
  locale?: string
}

export function ThemeSwitcher({ locale: localeProp }: ThemeSwitcherProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const { theme, setTheme } = useTheme()

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    {
      value: "light",
      label: t(locale, "theme.light"),
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      value: "dark",
      label: t(locale, "theme.dark"),
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
    },
    {
      value: "auto",
      label: t(locale, "theme.auto"),
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex items-center bg-ds-muted rounded-lg p-1" role="radiogroup" aria-label={t(locale, "theme.switch_theme")}>
      {themes.map((item) => (
        <button
          key={item.value}
          onClick={() => setTheme(item.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            theme === item.value
              ? "bg-ds-card text-ds-foreground shadow-sm"
              : "text-ds-muted-foreground hover:text-ds-foreground"
          }`}
          role="radio"
          aria-checked={theme === item.value}
          aria-label={item.label}
        >
          {item.icon}
          <span className="hidden sm:inline">{item.label}</span>
        </button>
      ))}
    </div>
  )
}
