import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/event-ticketing")({
  component: ManageEventTicketingPage,
})

const STATUS_FILTERS = ["all", "upcoming", "ongoing", "completed", "cancelled"] as const

function ManageEventTicketingPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "event-ticketing"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/event-ticketing", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allEvents = ((data as any)?.events || []).map((item: any) => ({
    id: item.id,
    name: item.name || item.title || "—",
    venue: item.venue || item.location || "—",
    date: item.date || item.event_date
      ? new Date(item.date || item.event_date).toLocaleDateString()
      : "—",
    tickets_sold: item.tickets_sold ?? 0,
    tickets_available: item.tickets_available ?? 0,
    status: item.status || "upcoming",
  }))

  const events = statusFilter === "all"
    ? allEvents
    : allEvents.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "name",
      header: t(locale, "manage.name"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "venue",
      header: t(locale, "manage.venue"),
    },
    {
      key: "date",
      header: t(locale, "manage.date"),
    },
    {
      key: "tickets_sold",
      header: t(locale, "manage.tickets_sold"),
      align: "end" as const,
    },
    {
      key: "tickets_available",
      header: t(locale, "manage.tickets_available"),
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
        <PageHeader title={t(locale, "manage.event_ticketing")} subtitle="Manage events and ticket sales" />

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

        <DataTable columns={columns} data={events} emptyTitle="No events found" countLabel="events" />
      </Container>
    </ManageLayout>
  )
}
