import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface SkipLinksProps {
  locale?: string
}

export function SkipLinks({ locale: localeProp }: SkipLinksProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  const links = [
    { href: "#main-content", label: t(locale, "navigation.skip_to_content") },
    { href: "#main-nav", label: t(locale, "navigation.skip_to_nav") },
    { href: "#search", label: t(locale, "navigation.skip_to_search") },
  ]

  return (
    <div className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:top-0 focus-within:start-0 focus-within:z-[100] focus-within:p-2 focus-within:bg-ds-card focus-within:shadow-lg">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="block px-4 py-2 text-sm font-medium text-ds-primary bg-ds-card border border-ds-border rounded-md mb-1 focus:outline-none focus:ring-2 focus:ring-ds-primary"
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}
