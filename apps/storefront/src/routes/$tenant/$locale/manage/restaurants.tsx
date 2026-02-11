import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge } from "@/components/manage/ui"
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
        <PageHeader title={t(locale, "manage.restaurants")} subtitle="Manage restaurant listings" />

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

        <DataTable columns={columns} data={restaurants} emptyTitle="No restaurants found" countLabel="restaurants" />
      </Container>
    </ManageLayout>
  )
}
