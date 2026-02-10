import { useNavigate, useParams } from "@tanstack/react-router"
import { LOCALE_CONFIG, type SupportedLocale, SUPPORTED_LOCALES } from "@/lib/i18n"

export function LocaleSwitcher() {
  const navigate = useNavigate()
  const params = useParams({ strict: false }) as { tenant?: string; locale?: string }
  const currentLocale = (params.locale || "en") as SupportedLocale
  const tenant = params.tenant || "default"

  const handleChange = (locale: SupportedLocale) => {
    if (locale === currentLocale) return
    const currentPath = window.location.pathname
    const newPath = currentPath.replace(
      `/${tenant}/${currentLocale}`,
      `/${tenant}/${locale}`
    )
    navigate({ to: newPath })
  }

  return (
    <div className="flex items-center gap-1">
      {SUPPORTED_LOCALES.map((locale) => (
        <button
          key={locale}
          onClick={() => handleChange(locale)}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            locale === currentLocale
              ? "bg-primary text-ds-primary-foreground font-semibold"
              : "text-ds-muted-foreground hover:bg-ds-muted"
          }`}
          title={LOCALE_CONFIG[locale].name}
        >
          {LOCALE_CONFIG[locale].nativeName}
        </button>
      ))}
    </div>
  )
}
