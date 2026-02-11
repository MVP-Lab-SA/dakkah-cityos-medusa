import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, SectionCard, DataTable, StatusBadge } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { Plus } from "@medusajs/icons"

export const Route = createFileRoute("/$tenant/$locale/manage/team")({
  component: ManageTeamPage,
})

function ManageTeamPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"

  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")

  const members: Record<string, unknown>[] = []

  const columns = [
    {
      key: "name",
      header: t(locale, "manage.member_name"),
      render: (_: unknown, row: Record<string, unknown>) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-ds-primary/10 flex items-center justify-center text-ds-primary text-xs font-medium">
            {((row.name as string) || "?").charAt(0).toUpperCase()}
          </div>
          <span className="font-medium">{row.name as string}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: t(locale, "manage.email"),
    },
    {
      key: "role",
      header: t(locale, "manage.role"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "lastActive",
      header: t(locale, "manage.last_active"),
    },
  ]

  return (
    <ManageLayout locale={locale}>
      <Container>
        <PageHeader
          title={t(locale, "manage.team")}
          subtitle={t(locale, "manage.manage_team")}
          actions={
            <button
              type="button"
              className="px-4 py-2 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t(locale, "manage.invite_member")}
            </button>
          }
        />

        <SectionCard title={t(locale, "manage.invite_member")}>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder={t(locale, "manage.invite_email_placeholder")}
              className="flex-1 px-3 py-2 bg-ds-background border border-ds-border rounded-lg text-sm text-ds-text placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="px-3 py-2 bg-ds-background border border-ds-border rounded-lg text-sm text-ds-text focus:outline-none focus:ring-2 focus:ring-ds-primary"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
            <button
              type="button"
              className="px-4 py-2 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              {t(locale, "manage.send_invite")}
            </button>
          </div>
        </SectionCard>

        <DataTable
          columns={columns}
          data={members}
          emptyTitle={t(locale, "manage.no_team_members")}
          countLabel={t(locale, "manage.team_members").toLowerCase()}
        />
      </Container>
    </ManageLayout>
  )
}
