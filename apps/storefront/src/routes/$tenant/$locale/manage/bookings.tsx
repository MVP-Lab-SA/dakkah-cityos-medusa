import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/bookings")({
  component: ManageBookingsPage,
})

const STATUS_FILTERS = ["all", "pending", "confirmed", "completed", "cancelled"] as const

function ManageBookingsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "bookings"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/bookings", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allBookings = ((data as any)?.bookings || []).map((item: any) => ({
    id: item.id,
    service: item.service?.name || item.service_name || item.service || "—",
    customer: item.customer?.first_name
      ? `${item.customer.first_name} ${item.customer.last_name || ""}`.trim()
      : item.customer_name || "—",
    date_time: item.date_time || item.start_time
      ? new Date(item.date_time || item.start_time).toLocaleString()
      : "—",
    duration: item.duration ? `${item.duration} min` : "—",
    status: item.status || "pending",
    provider: item.provider?.name || item.provider_name || item.provider || "—",
  }))

  const bookings = statusFilter === "all"
    ? allBookings
    : allBookings.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "service",
      header: t(locale, "manage.service"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "customer",
      header: t(locale, "manage.customer"),
    },
    {
      key: "date_time",
      header: t(locale, "manage.date_time"),
    },
    {
      key: "duration",
      header: t(locale, "manage.duration"),
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "provider",
      header: t(locale, "manage.provider"),
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
        <PageHeader title={t(locale, "manage.bookings")} subtitle="Manage booking appointments" />

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

        <DataTable columns={columns} data={bookings} emptyTitle="No bookings found" countLabel="bookings" />
      </Container>
    </ManageLayout>
  )
}
