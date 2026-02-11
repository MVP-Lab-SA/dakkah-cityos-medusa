import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface TrustBadgesProps {
  locale?: string
  layout?: "horizontal" | "vertical" | "grid"
}

export function TrustBadges({ locale: localeProp, layout = "horizontal" }: TrustBadgesProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  const badges = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      title: t(locale, "marketing.free_shipping"),
      desc: t(locale, "marketing.free_shipping_desc"),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: t(locale, "marketing.money_back_guarantee"),
      desc: t(locale, "marketing.money_back_guarantee_desc"),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: t(locale, "marketing.secure_payment"),
      desc: t(locale, "marketing.secure_payment_desc"),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: t(locale, "marketing.support_24_7"),
      desc: t(locale, "marketing.support_24_7_desc"),
    },
  ]

  const layoutClasses = {
    horizontal: "flex flex-wrap items-center justify-center gap-6",
    vertical: "flex flex-col gap-4",
    grid: "grid grid-cols-2 sm:grid-cols-4 gap-4",
  }

  return (
    <div className={layoutClasses[layout]}>
      {badges.map((badge, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 ${
            layout === "grid" ? "flex-col text-center p-4 bg-ds-card border border-ds-border rounded-lg" : ""
          }`}
        >
          <div className="flex-shrink-0 w-10 h-10 bg-ds-primary/10 rounded-full flex items-center justify-center text-ds-primary">
            {badge.icon}
          </div>
          <div className={layout === "grid" ? "" : ""}>
            <p className="text-sm font-medium text-ds-text">{badge.title}</p>
            <p className="text-xs text-ds-muted">{badge.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
