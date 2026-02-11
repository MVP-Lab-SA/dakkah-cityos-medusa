import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/grocery")({
  component: ManageGroceryPage,
})

const STATUS_FILTERS = ["all", "in_stock", "low_stock", "out_of_stock"] as const

function ManageGroceryPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "grocery"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/grocery", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allItems = ((data as any)?.items || []).map((item: any) => ({
    id: item.id,
    name: item.name || item.title || "—",
    category: item.category || "—",
    price: item.price ? `$${(item.price / 100).toFixed(2)}` : "$0.00",
    stock: item.stock ?? item.quantity ?? 0,
    status: item.status || "in_stock",
  }))

  const items = statusFilter === "all"
    ? allItems
    : allItems.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "name",
      header: t(locale, "manage.name"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "category",
      header: t(locale, "manage.category"),
    },
    {
      key: "price",
      header: t(locale, "manage.price"),
      align: "end" as const,
    },
    {
      key: "stock",
      header: t(locale, "manage.stock"),
      align: "end" as const,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
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
        <PageHeader title={t(locale, "manage.grocery")} subtitle="Manage grocery inventory" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={items} emptyTitle="No grocery items found" countLabel="items" />
      </Container>
    </ManageLayout>
  )
}
