import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface EmptyStateProps {
  locale?: string
  className?: string
  icon?: "cart" | "search" | "orders" | "notifications" | "generic"
  title: string
  description?: string
  ctaLabel?: string
  onCtaClick?: () => void
  ctaHref?: string
}

export function EmptyState({
  locale: localeProp,
  className = "",
  icon = "generic",
  title,
  description,
  ctaLabel,
  onCtaClick,
  ctaHref,
}: EmptyStateProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  const icons: Record<string, React.ReactNode> = {
    cart: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    ),
    search: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    orders: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    notifications: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    generic: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    ),
  }

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="w-20 h-20 bg-ds-accent rounded-full flex items-center justify-center text-ds-muted mb-4">
        {icons[icon]}
      </div>
      <h3 className="text-base font-semibold text-ds-text mb-1">{title}</h3>
      {description && <p className="text-sm text-ds-muted max-w-sm mb-4">{description}</p>}
      {(ctaLabel || ctaHref) && (
        <a
          href={ctaHref || "#"}
          onClick={(e) => {
            if (onCtaClick) { e.preventDefault(); onCtaClick() }
          }}
          className="px-4 py-2 bg-ds-primary text-ds-primary-foreground text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
        >
          {ctaLabel || t(locale, "common.learn_more")}
        </a>
      )}
    </div>
  )
}
