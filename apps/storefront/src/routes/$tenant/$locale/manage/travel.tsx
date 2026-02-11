import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/travel")({
  component: ManageTravelPage,
})

const STATUS_FILTERS = ["all", "active", "sold_out", "draft"] as const

function ManageTravelPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "travel"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/travel", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allItems = ((data as any)?.travel || (data as any)?.packages || []).map((item: any) => ({
    id: item.id,
    name: item.name || item.title || "—",
    destination: item.destination || "—",
    duration: item.duration || "—",
    price: item.price ? `$${(item.price / 100).toFixed(2)}` : "$0.00",
    status: item.status || "active",
    bookings_count: item.bookings_count ?? 0,
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
      key: "destination",
      header: t(locale, "manage.destination"),
    },
    {
      key: "duration",
      header: t(locale, "manage.duration"),
    },
    {
      key: "price",
      header: t(locale, "manage.price"),
      align: "end" as const,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "bookings_count",
      header: t(locale, "manage.bookings_count"),
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
          <SkeletonTable rows={8} cols={7} />
        </Container>
      </ManageLayout>
    )
  }

  return (
    <ManageLayout locale={locale}>
      <Container>
        <PageHeader title={t(locale, "manage.travel")} subtitle="Manage travel packages" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={items} emptyTitle="No travel packages found" countLabel="packages" />
      </Container>
    </ManageLayout>
  )
}
