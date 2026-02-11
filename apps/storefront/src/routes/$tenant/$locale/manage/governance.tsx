import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/governance")({
  component: ManageGovernancePage,
})

const STATUS_FILTERS = ["all", "active", "draft", "disabled"] as const

function ManageGovernancePage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "governance"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/governance", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allPolicies = ((data as any)?.policies || (data as any)?.governance || []).map((item: any) => ({
    id: item.id,
    name: item.name || item.title || "—",
    scope: item.scope || "global",
    priority: item.priority ?? 0,
    status: item.status || "active",
    affected_nodes: item.affected_nodes ?? item.affected_nodes_count ?? 0,
    last_updated: item.last_updated || item.updated_at ? new Date(item.last_updated || item.updated_at).toLocaleDateString() : "—",
  }))

  const policies = statusFilter === "all"
    ? allPolicies
    : allPolicies.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "name",
      header: t(locale, "manage.name"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "scope",
      header: t(locale, "manage.scope"),
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
      key: "affected_nodes",
      header: t(locale, "manage.affected_nodes"),
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
        <PageHeader title={t(locale, "manage.governance")} subtitle="Manage governance policies" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={policies} emptyTitle="No policies found" countLabel="policies" />
      </Container>
    </ManageLayout>
  )
}
