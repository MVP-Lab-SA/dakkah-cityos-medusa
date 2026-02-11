import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
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
        <PageHeader title={t(locale, "manage.tenants")} subtitle="Manage tenants" />

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200"
          />
        </div>

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={tenants} emptyTitle="No tenants found" countLabel="tenants" />
      </Container>
    </ManageLayout>
  )
}
