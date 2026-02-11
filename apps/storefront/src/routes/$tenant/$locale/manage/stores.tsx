import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/stores")({
  component: ManageStoresPage,
})

const STATUS_FILTERS = ["all", "active", "inactive"] as const

function ManageStoresPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "stores"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/tenant/stores", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allStores = ((data as any)?.stores || []).map((item: any) => ({
    id: item.id,
    name: item.name || "—",
    domain: item.domain || "—",
    status: item.status || "active",
    products_count: item.products_count ?? 0,
    orders_count: item.orders_count ?? 0,
    currency: item.currency || "—",
  }))

  const stores = statusFilter === "all"
    ? allStores
    : allStores.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "name",
      header: t(locale, "manage.name"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
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
      key: "products_count",
      header: t(locale, "manage.products_count"),
      align: "end" as const,
    },
    {
      key: "orders_count",
      header: t(locale, "manage.orders_count"),
      align: "end" as const,
    },
    {
      key: "currency",
      header: t(locale, "manage.currency"),
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
        <PageHeader title={t(locale, "manage.stores")} subtitle="Manage tenant stores" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={stores} emptyTitle="No stores found" countLabel="stores" />
      </Container>
    </ManageLayout>
  )
}
