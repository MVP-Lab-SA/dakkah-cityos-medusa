import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/personas")({
  component: ManagePersonasPage,
})

const STATUS_FILTERS = ["all", "active", "inactive"] as const

function ManagePersonasPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "personas"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/personas", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allPersonas = ((data as any)?.personas || []).map((item: any) => ({
    id: item.id,
    name: item.name || item.title || "—",
    axis: item.axis || "commerce",
    priority: item.priority ?? 0,
    status: item.status || "active",
    tenant: item.tenant?.name || item.tenant_name || item.tenant || "—",
  }))

  const personas = statusFilter === "all"
    ? allPersonas
    : allPersonas.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "name",
      header: t(locale, "manage.name"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "axis",
      header: t(locale, "manage.axis"),
    },
    {
      key: "priority",
      header: t(locale, "manage.priority"),
      align: "end" as const,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "tenant",
      header: t(locale, "manage.tenant"),
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
          <SkeletonTable rows={8} cols={6} />
        </Container>
      </ManageLayout>
    )
  }

  return (
    <ManageLayout locale={locale}>
      <Container>
        <PageHeader title={t(locale, "manage.personas")} subtitle="Manage personas" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={personas} emptyTitle="No personas found" countLabel="personas" />
      </Container>
    </ManageLayout>
  )
}
