import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, SectionCard, DataTable, StatusBadge, Input, Select, Label, Button } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

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
          <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 text-xs font-medium">
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
        />

        <SectionCard title={t(locale, "manage.invite_member")}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Label>{t(locale, "manage.email")}</Label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder={t(locale, "manage.invite_email_placeholder")}
              />
            </div>
            <div>
              <Label>{t(locale, "manage.role")}</Label>
              <Select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                options={[
                  { value: "member", label: "Member" },
                  { value: "admin", label: "Admin" },
                  { value: "editor", label: "Editor" },
                ]}
              />
            </div>
            <div className="flex items-end">
              <Button variant="primary" size="base">
                {t(locale, "manage.send_invite")}
              </Button>
            </div>
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
