import { t, formatNumber, formatCurrency, type SupportedLocale } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"
import type { ReferralStatsProps } from "@cityos/design-system"

export function ReferralStats({
  totalReferred,
  successfulReferrals,
  pendingReferrals,
  totalEarned,
  currencyCode = "USD",
  locale: localeProp,
  className,
}: ReferralStatsProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  const stats = [
    {
      label: t(locale, "referral.total_referred"),
      value: formatNumber(totalReferred, locale as SupportedLocale),
      color: "text-ds-foreground",
    },
    {
      label: t(locale, "referral.successful"),
      value: formatNumber(successfulReferrals, locale as SupportedLocale),
      color: "text-ds-success",
    },
    {
      label: t(locale, "referral.pending"),
      value: formatNumber(pendingReferrals, locale as SupportedLocale),
      color: "text-ds-warning",
    },
    {
      label: t(locale, "referral.total_earned"),
      value: formatCurrency(totalEarned, currencyCode, locale as SupportedLocale),
      color: "text-ds-primary",
    },
  ]

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className || ""}`}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-ds-background border border-ds-border rounded-lg p-4 text-center"
        >
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-xs text-ds-muted-foreground mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
