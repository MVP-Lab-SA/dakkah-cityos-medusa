import { createFileRoute } from "@tanstack/react-router"
import { ManageLayout, ManageTeamList } from "@/components/manage"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

export const Route = createFileRoute("/$tenant/$locale/manage/team")({
  component: ManageTeamPage,
})

function ManageTeamPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"

  return (
    <ManageLayout locale={locale}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-ds-text">{t(locale, "manage.team")}</h2>
          <p className="text-sm text-ds-muted mt-1">{t(locale, "manage.team_members")}</p>
        </div>
        <ManageTeamList locale={locale} members={[]} />
      </div>
    </ManageLayout>
  )
}
