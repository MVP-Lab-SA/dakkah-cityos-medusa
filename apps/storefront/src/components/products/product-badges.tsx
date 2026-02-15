import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

type BadgeType = "new" | "sale" | "bestseller" | "limited" | "eco" | "exclusive"

interface ProductBadgesProps {
  locale?: string
  badges: BadgeType[]
  salePercentage?: number
  className?: string
}

const badgeConfig: Record<BadgeType, { bgClass: string; textClass: string; i18nKey: string }> = {
  new: { bgClass: "bg-ds-primary", textClass: "text-ds-primary-foreground", i18nKey: "productDisplay.badge_new" },
  sale: { bgClass: "bg-ds-destructive", textClass: "text-white", i18nKey: "productDisplay.badge_sale" },
  bestseller: { bgClass: "bg-ds-warning", textClass: "text-white", i18nKey: "productDisplay.badge_bestseller" },
  limited: { bgClass: "bg-ds-primary", textClass: "text-white", i18nKey: "productDisplay.badge_limited" },
  eco: { bgClass: "bg-ds-success", textClass: "text-white", i18nKey: "productDisplay.badge_eco" },
  exclusive: { bgClass: "bg-ds-card border border-ds-border", textClass: "text-ds-text", i18nKey: "productDisplay.badge_exclusive" },
}

export function ProductBadges({ locale: localeProp, badges, salePercentage, className = "" }: ProductBadgesProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  if (badges.length === 0) return null

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {badges.map((badge) => {
        const config = badgeConfig[badge]
        const label =
          badge === "sale" && salePercentage
            ? `-${salePercentage}%`
            : t(locale, config.i18nKey)

        return (
          <span
            key={badge}
            className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded ${config.bgClass} ${config.textClass}`}
          >
            {label}
          </span>
        )
      })}
    </div>
  )
}
