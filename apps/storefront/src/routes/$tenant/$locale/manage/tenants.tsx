import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/tenants")({
  component: ManageTenantsPage,
})

const STATUS_FILTERS = ["all", "active", "pending", "suspended"] as const

function ManageTenantsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [search, setSearch] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "tenants"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/tenants", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allTenants = ((data as any)?.tenants || []).map((item: any) => ({
    id: item.id,
    name: item.name || item.title || "—",
    slug: item.slug || item.handle || "—",
    domain: item.domain || "—",
    status: item.status || "active",
    plan: item.plan || item.subscription_plan || "—",
    created_at: item.created_at ? new Date(item.created_at).toLocaleDateString() : "—",
  }))

  let tenants = statusFilter === "all"
    ? allTenants
    : allTenants.filter((i: any) => i.status === statusFilter)

  if (search.trim()) {
    const q = search.trim().toLowerCase()
    tenants = tenants.filter((i: any) => i.name.toLowerCase().includes(q))
  }

  const columns = [
    {
      key: "name",
      header: t(locale, "manage.name"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "slug",
      header: t(locale, "manage.slug"),
    },
    {
      key: "domain",
      header: t(locale, "manage.domain"),
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "plan",
      header: t(locale, "manage.plan"),
    },
    {
      key: "created_at",
      header: t(locale, "manage.created_at"),
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
        <PageHeader title={t(locale, "manage.tenants")} subtitle="Manage tenants" />

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm px-3 py-2 text-sm bg-ds-background border border-ds-border rounded-lg text-ds-text placeholder:text-ds-muted focus:outline-none focus:ring-1 focus:ring-ds-border"
          />
        </div>

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

        <DataTable columns={columns} data={tenants} emptyTitle="No tenants found" countLabel="tenants" />
      </Container>
    </ManageLayout>
  )
}
