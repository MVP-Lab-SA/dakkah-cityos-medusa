import { createFileRoute } from "@tanstack/react-router"
import { ManageLayout, ManageSettingsForm } from "@/components/manage"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

export const Route = createFileRoute("/$tenant/$locale/manage/settings")({
  component: ManageSettingsPage,
})

function ManageSettingsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"

  return (
    <ManageLayout locale={locale}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-ds-text">{t(locale, "manage.settings")}</h2>
          <p className="text-sm text-ds-muted mt-1">{t(locale, "manage.store_management")}</p>
        </div>
        <ManageSettingsForm locale={locale} />
      </div>
    </ManageLayout>
  )
}
