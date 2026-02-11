import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/restaurants")({
  component: ManageRestaurantsPage,
})

const STATUS_FILTERS = ["all", "open", "closed", "temporarily_closed"] as const

function ManageRestaurantsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "restaurants"],
    queryFn: async () => {
      try {
        const response = await sdk.client.fetch("/admin/restaurants", { method: "GET" })
        return response
      } catch {
        const response = await sdk.client.fetch("/store/restaurants", { method: "GET" })
        return response
      }
    },
    enabled: typeof window !== "undefined",
  })

  const allRestaurants = ((data as any)?.restaurants || []).map((item: any) => ({
    id: item.id,
    name: item.name || "—",
    cuisine: item.cuisine || item.cuisine_type || "—",
    location: item.location || item.address || "—",
    rating: item.rating ?? "—",
    status: item.status || "open",
    orders_today: item.orders_today ?? 0,
  }))

  const restaurants = statusFilter === "all"
    ? allRestaurants
    : allRestaurants.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "name",
      header: t(locale, "manage.name"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "cuisine",
      header: t(locale, "manage.cuisine"),
    },
    {
      key: "location",
      header: t(locale, "manage.location"),
    },
    {
      key: "rating",
      header: t(locale, "manage.rating"),
      align: "end" as const,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "orders_today",
      header: t(locale, "manage.orders_today"),
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
        <PageHeader title={t(locale, "manage.restaurants")} subtitle="Manage restaurant listings" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={restaurants} emptyTitle="No restaurants found" countLabel="restaurants" />
      </Container>
    </ManageLayout>
  )
}
