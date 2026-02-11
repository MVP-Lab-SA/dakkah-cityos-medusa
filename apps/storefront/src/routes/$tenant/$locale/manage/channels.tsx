import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/channels")({
  component: ManageChannelsPage,
})

const STATUS_FILTERS = ["all", "active", "inactive"] as const

function ManageChannelsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "channels"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/channels", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allChannels = ((data as any)?.channels || (data as any)?.sales_channels || []).map((item: any) => ({
    id: item.id,
    name: item.name || item.title || "—",
    type: item.type || "web",
    status: item.status || "active",
    products_count: item.products_count ?? 0,
    orders_count: item.orders_count ?? 0,
  }))

  const channels = statusFilter === "all"
    ? allChannels
    : allChannels.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "name",
      header: t(locale, "manage.name"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "type",
      header: t(locale, "manage.type"),
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
        <PageHeader title={t(locale, "manage.channels")} subtitle="Manage sales channels" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={channels} emptyTitle="No channels found" countLabel="channels" />
      </Container>
    </ManageLayout>
  )
}
