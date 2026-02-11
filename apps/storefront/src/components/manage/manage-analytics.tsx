import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"
import { StatsGrid } from "@/components/manage/ui"
import { SectionCard } from "@/components/manage/ui"
import { CurrencyDollar, ArrowUpMini, Users, ShoppingCart, ChartBar } from "@medusajs/icons"

interface ManageAnalyticsProps {
  locale?: string
}

export function ManageAnalytics({ locale: localeProp }: ManageAnalyticsProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  const stats = [
    {
      icon: <CurrencyDollar className="w-5 h-5" />,
      label: t(locale, "manage.total_revenue"),
      value: "$0.00",
      trend: { value: 0, positive: true },
    },
    {
      icon: <ArrowUpMini className="w-5 h-5" />,
      label: t(locale, "manage.conversion_rate"),
      value: "0%",
      trend: { value: 0, positive: true },
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: t(locale, "manage.new_customers"),
      value: "0",
    },
    {
      icon: <ShoppingCart className="w-5 h-5" />,
      label: t(locale, "manage.average_order_value"),
      value: "$0.00",
    },
  ]

  return (
    <div className="space-y-6">
      <StatsGrid stats={stats} />

      <SectionCard title={t(locale, "manage.revenue_over_time")}>
        <div className="h-64 flex items-center justify-center border border-dashed border-ds-border rounded-lg">
          <div className="text-center space-y-2">
            <ChartBar className="w-12 h-12 text-ds-muted-foreground mx-auto" />
            <p className="text-sm text-ds-muted-foreground">{t(locale, "manage.revenue_over_time")}</p>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title={t(locale, "manage.top_products")}>
          <p className="text-sm text-ds-muted-foreground text-center py-8">{t(locale, "manage.no_products")}</p>
        </SectionCard>

        <SectionCard title={t(locale, "manage.customer_stats")}>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-ds-background rounded-lg text-center">
              <p className="text-2xl font-bold text-ds-text">0</p>
              <p className="text-xs text-ds-muted-foreground mt-1">{t(locale, "manage.new_customers")}</p>
            </div>
            <div className="p-4 bg-ds-background rounded-lg text-center">
              <p className="text-2xl font-bold text-ds-text">0</p>
              <p className="text-xs text-ds-muted-foreground mt-1">{t(locale, "manage.returning_customers")}</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
