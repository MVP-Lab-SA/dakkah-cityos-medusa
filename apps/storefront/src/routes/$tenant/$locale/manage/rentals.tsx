import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/rentals")({
  component: ManageRentalsPage,
})

const STATUS_FILTERS = ["all", "available", "rented", "maintenance"] as const

function ManageRentalsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "rentals"],
    queryFn: async () => {
      try {
        const response = await sdk.client.fetch("/admin/rentals", { method: "GET" })
        return response
      } catch {
        const response = await sdk.client.fetch("/store/rentals", { method: "GET" })
        return response
      }
    },
    enabled: typeof window !== "undefined",
  })

  const allRentals = ((data as any)?.rentals || []).map((item: any) => ({
    id: item.id,
    item: item.item || item.name || item.title || "—",
    category: item.category || "—",
    daily_rate: item.daily_rate ? `$${(item.daily_rate / 100).toFixed(2)}` : "$0.00",
    status: item.status || "available",
    current_renter: item.current_renter?.name || item.current_renter || "—",
    return_date: item.return_date ? new Date(item.return_date).toLocaleDateString() : "—",
  }))

  const rentals = statusFilter === "all"
    ? allRentals
    : allRentals.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "item",
      header: t(locale, "manage.item"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "category",
      header: t(locale, "manage.category"),
    },
    {
      key: "daily_rate",
      header: t(locale, "manage.daily_rate"),
      align: "end" as const,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "current_renter",
      header: t(locale, "manage.current_renter"),
    },
    {
      key: "return_date",
      header: t(locale, "manage.return_date"),
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
        <PageHeader title={t(locale, "manage.rentals")} subtitle="Manage rental inventory" />

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

        <DataTable columns={columns} data={rentals} emptyTitle="No rentals found" countLabel="rentals" />
      </Container>
    </ManageLayout>
  )
}
