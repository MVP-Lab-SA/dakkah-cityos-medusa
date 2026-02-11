import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
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
        <PageHeader title={t(locale, "manage.rentals")} subtitle="Manage rental inventory" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={rentals} emptyTitle="No rentals found" countLabel="rentals" />
      </Container>
    </ManageLayout>
  )
}
