import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/i18n")({
  component: ManageI18nPage,
})

const STATUS_FILTERS = ["all", "active", "draft"] as const

function ManageI18nPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "i18n"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/i18n", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allLocales = ((data as any)?.locales || (data as any)?.translations || []).map((item: any) => ({
    id: item.id,
    locale_code: item.locale_code || item.code || "—",
    name: item.name || item.label || "—",
    direction: item.direction || item.dir || "LTR",
    status: item.status || "active",
    completeness: item.completeness != null ? `${item.completeness}%` : "—",
    last_updated: item.last_updated || item.updated_at ? new Date(item.last_updated || item.updated_at).toLocaleDateString() : "—",
  }))

  const locales = statusFilter === "all"
    ? allLocales
    : allLocales.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "locale_code",
      header: t(locale, "manage.locale_code"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "name",
      header: t(locale, "manage.name"),
    },
    {
      key: "direction",
      header: t(locale, "manage.direction"),
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "completeness",
      header: t(locale, "manage.completeness"),
      align: "end" as const,
    },
    {
      key: "last_updated",
      header: t(locale, "manage.last_updated"),
    },
    {
      key: "actions",
      header: t(locale, "manage.actions"),
      align: "end" as const,
      render: () => (
        <DropdownMenu
          items={[
            { label: t(locale, "manage.view"), onClick: () => {} },
          ]}
        />
      ),
    },
  ]

  if (isLoading) {
    return (
      <ManageLayout locale={locale}>
        <Container>
          <SkeletonTable rows={8} cols={7} />
        </Container>
      </ManageLayout>
    )
  }

  return (
    <ManageLayout locale={locale}>
      <Container>
        <PageHeader title={t(locale, "manage.i18n")} subtitle="Manage locales and translations" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={locales} emptyTitle="No locales found" countLabel="locales" />
      </Container>
    </ManageLayout>
  )
}
