import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/parking")({
  component: ManageParkingPage,
})

const STATUS_FILTERS = ["all", "available", "occupied", "reserved", "maintenance"] as const

function ManageParkingPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "parking"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/parking", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allSpots = ((data as any)?.spots || (data as any)?.parking || []).map((item: any) => ({
    id: item.id,
    location: item.location || item.name || "—",
    zone: item.zone || "—",
    type: item.type || "—",
    rate_per_hour: item.rate_per_hour ? `$${(item.rate_per_hour / 100).toFixed(2)}` : "$0.00",
    status: item.status || "available",
    capacity: item.capacity ?? 0,
  }))

  const spots = statusFilter === "all"
    ? allSpots
    : allSpots.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "location",
      header: t(locale, "manage.location"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "zone",
      header: t(locale, "manage.zone"),
    },
    {
      key: "type",
      header: t(locale, "manage.type"),
    },
    {
      key: "rate_per_hour",
      header: t(locale, "manage.rate_per_hour"),
      align: "end" as const,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "capacity",
      header: t(locale, "manage.capacity"),
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
        <PageHeader title={t(locale, "manage.parking")} subtitle="Manage parking spots" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={spots} emptyTitle="No parking spots found" countLabel="spots" />
      </Container>
    </ManageLayout>
  )
}
