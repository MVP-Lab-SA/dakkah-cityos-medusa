import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"
import { StatsCard } from "./stats-card"

interface ManageAnalyticsProps {
  locale?: string
}

export function ManageAnalytics({ locale: localeProp }: ManageAnalyticsProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label={t(locale, "manage.total_revenue")}
          value="$0.00"
          trend={{ value: 0, positive: true }}
          locale={locale}
        />
        <StatsCard
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          label={t(locale, "manage.conversion_rate")}
          value="0%"
          trend={{ value: 0, positive: true }}
          locale={locale}
        />
        <StatsCard
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          label={t(locale, "manage.new_customers")}
          value="0"
          locale={locale}
        />
        <StatsCard
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          }
          label={t(locale, "manage.average_order_value")}
          value="$0.00"
          locale={locale}
        />
      </div>

      <div className="bg-ds-card border border-ds-border rounded-lg p-6">
        <h3 className="text-sm font-semibold text-ds-text mb-4">{t(locale, "manage.revenue_over_time")}</h3>
        <div className="h-64 flex items-center justify-center border border-dashed border-ds-border rounded-lg">
          <div className="text-center space-y-2">
            <svg className="w-12 h-12 text-ds-muted mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm text-ds-muted">{t(locale, "manage.revenue_over_time")}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-ds-card border border-ds-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-ds-text mb-4">{t(locale, "manage.top_products")}</h3>
          <div className="space-y-3">
            <p className="text-sm text-ds-muted text-center py-8">{t(locale, "manage.no_products")}</p>
          </div>
        </div>

        <div className="bg-ds-card border border-ds-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-ds-text mb-4">{t(locale, "manage.customer_stats")}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-ds-background rounded-lg text-center">
              <p className="text-2xl font-bold text-ds-text">0</p>
              <p className="text-xs text-ds-muted mt-1">{t(locale, "manage.new_customers")}</p>
            </div>
            <div className="p-4 bg-ds-background rounded-lg text-center">
              <p className="text-2xl font-bold text-ds-text">0</p>
              <p className="text-xs text-ds-muted mt-1">{t(locale, "manage.returning_customers")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
