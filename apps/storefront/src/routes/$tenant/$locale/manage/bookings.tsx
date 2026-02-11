import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
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
        <PageHeader title={t(locale, "manage.bookings")} subtitle="Manage booking appointments" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={bookings} emptyTitle="No bookings found" countLabel="bookings" />
      </Container>
    </ManageLayout>
  )
}
