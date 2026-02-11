import { createFileRoute } from "@tanstack/react-router"
import { ManageLayout, ManageOrderList } from "@/components/manage"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

export const Route = createFileRoute("/$tenant/$locale/manage/orders")({
  component: ManageOrdersPage,
})

function ManageOrdersPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"

  return (
    <ManageLayout locale={locale}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-ds-text">{t(locale, "manage.orders")}</h2>
          <p className="text-sm text-ds-muted mt-1">{t(locale, "manage.orders_today")}</p>
        </div>
        <ManageOrderList locale={locale} orders={[]} />
      </div>
    </ManageLayout>
  )
}
