import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useManageOrders } from "@/lib/hooks/use-manage-data"

export const Route = createFileRoute("/$tenant/$locale/manage/orders")({
  component: ManageOrdersPage,
})

const STATUS_FILTERS = ["all", "pending", "processing", "shipped", "delivered", "cancelled"] as const

function ManageOrdersPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const { data, isLoading } = useManageOrders()
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const allOrders = ((data as any)?.orders || []).map((o: any) => ({
    id: o.id,
    display_id: o.display_id ? `#${o.display_id}` : o.id?.slice(0, 8),
    customer: o.customer?.first_name
      ? `${o.customer.first_name} ${o.customer.last_name || ""}`.trim()
      : o.email || "—",
    total: o.total ? `$${(o.total / 100).toFixed(2)}` : "$0.00",
    status: o.fulfillment_status || o.status || "pending",
    date: o.created_at ? new Date(o.created_at).toLocaleDateString() : "—",
  }))

  const orders = statusFilter === "all"
    ? allOrders
    : allOrders.filter((o: any) => o.status === statusFilter)

  const columns = [
    {
      key: "display_id",
      header: t(locale, "manage.order_number"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "customer",
      header: t(locale, "manage.customer"),
    },
    {
      key: "total",
      header: t(locale, "manage.revenue"),
      align: "end" as const,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "date",
      header: t(locale, "manage.date"),
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
        <PageHeader
          title={t(locale, "manage.orders")}
          subtitle={t(locale, "manage.orders_today")}
        />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable
          columns={columns}
          data={orders}
          emptyTitle={t(locale, "manage.no_orders")}
          countLabel={t(locale, "manage.orders").toLowerCase()}
        />
      </Container>
    </ManageLayout>
  )
}
