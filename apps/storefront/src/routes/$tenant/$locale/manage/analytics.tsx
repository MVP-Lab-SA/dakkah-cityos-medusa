import { createFileRoute } from "@tanstack/react-router"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, SectionCard, StatsGrid } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { ChartBar } from "@medusajs/icons"

export const Route = createFileRoute("/$tenant/$locale/manage/analytics")({
  component: ManageAnalyticsPage,
})

function ManageAnalyticsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"

  const stats = [
    {
      label: t(locale, "manage.total_revenue"),
      value: "$0.00",
      trend: { value: 0, positive: true },
    },
    {
      label: t(locale, "manage.conversion_rate"),
      value: "0%",
      trend: { value: 0, positive: true },
    },
    {
      label: t(locale, "manage.new_customers"),
      value: "0",
    },
    {
      label: t(locale, "manage.average_order_value"),
      value: "$0.00",
    },
  ]

  return (
    <ManageLayout locale={locale}>
      <Container>
        <PageHeader
          title={t(locale, "manage.analytics")}
          subtitle={t(locale, "manage.store_management")}
        />

        <StatsGrid stats={stats} />

        <SectionCard title={t(locale, "manage.revenue_over_time")}>
          <div className="h-64 flex items-center justify-center border border-dashed border-ds-border rounded-lg bg-ds-background">
            <div className="text-center space-y-2">
              <ChartBar className="w-8 h-8 text-ds-muted mx-auto" />
              <p className="text-sm text-ds-muted">{t(locale, "manage.revenue_over_time")}</p>
            </div>
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard title={t(locale, "manage.top_products")}>
            <p className="text-sm text-ds-muted text-center py-8">{t(locale, "manage.no_products")}</p>
          </SectionCard>

          <SectionCard title={t(locale, "manage.customer_stats")}>
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
          </SectionCard>
        </div>
      </Container>
    </ManageLayout>
  )
}
