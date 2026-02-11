import { createFileRoute } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import { ManageLayout, StatsCard, ManageActivityFeed } from "@/components/manage"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

export const Route = createFileRoute("/$tenant/$locale/manage/")({
  component: ManageDashboard,
})

function ManageDashboard() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale, tenantSlug } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const baseHref = `/${tenantSlug}/${locale}/manage`

  return (
    <ManageLayout locale={locale}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-ds-text">{t(locale, "manage.dashboard")}</h2>
          <p className="text-sm text-ds-muted mt-1">{t(locale, "manage.store_management")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            label={t(locale, "manage.orders_today")}
            value="0"
            trend={{ value: 0, positive: true }}
            locale={locale}
          />
          <StatsCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label={t(locale, "manage.revenue")}
            value="$0.00"
            trend={{ value: 0, positive: true }}
            locale={locale}
          />
          <StatsCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            label={t(locale, "manage.active_products")}
            value="0"
            locale={locale}
          />
          <StatsCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            label={t(locale, "manage.team_members")}
            value="0"
            locale={locale}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ManageActivityFeed locale={locale} activities={[]} />
          </div>

          <div className="bg-ds-card border border-ds-border rounded-lg p-6">
            <h3 className="text-sm font-semibold text-ds-text mb-4">{t(locale, "manage.quick_actions")}</h3>
            <div className="space-y-2">
              <Link
                to={`${baseHref}/products` as any}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ds-text hover:bg-ds-accent transition-colors"
              >
                <svg className="w-4 h-4 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t(locale, "manage.add_product")}
              </Link>
              <Link
                to={`${baseHref}/orders` as any}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ds-text hover:bg-ds-accent transition-colors"
              >
                <svg className="w-4 h-4 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                </svg>
                {t(locale, "manage.view_orders")}
              </Link>
              <Link
                to={`${baseHref}/team` as any}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ds-text hover:bg-ds-accent transition-colors"
              >
                <svg className="w-4 h-4 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z" />
                </svg>
                {t(locale, "manage.manage_team")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ManageLayout>
  )
}
