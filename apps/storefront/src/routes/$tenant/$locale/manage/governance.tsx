import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge } from "@/components/manage/ui"
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
        <div className="flex items-center justify-end">
          <button type="button" className="px-3 py-1.5 text-sm text-ds-muted hover:text-ds-text hover:bg-ds-background rounded-lg transition-colors">
            {t(locale, "manage.view")}
          </button>
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <ManageLayout locale={locale}>
        <Container>
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-ds-muted/20 rounded-lg w-48" />
            <div className="h-4 bg-ds-muted/20 rounded-lg w-32" />
            <div className="h-64 bg-ds-muted/20 rounded-lg" />
          </div>
        </Container>
      </ManageLayout>
    )
  }

  return (
    <ManageLayout locale={locale}>
      <Container>
        <PageHeader title={t(locale, "manage.governance")} subtitle="Manage governance policies" />

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? "bg-ds-card border border-ds-border text-ds-text font-medium"
                  : "text-ds-muted hover:text-ds-text"
              }`}
            >
              {s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        <DataTable columns={columns} data={policies} emptyTitle="No policies found" countLabel="policies" />
      </Container>
    </ManageLayout>
  )
}
