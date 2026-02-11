import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/auctions")({
  component: ManageAuctionsPage,
})

const STATUS_FILTERS = ["all", "active", "ended", "cancelled"] as const

function ManageAuctionsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "auctions"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/auctions", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allAuctions = ((data as any)?.auctions || []).map((item: any) => ({
    id: item.id,
    title: item.title || item.name || "—",
    current_bid: item.current_bid ? `$${(item.current_bid / 100).toFixed(2)}` : "$0.00",
    bids_count: item.bids_count ?? 0,
    status: item.status || "active",
    start_date: item.start_date ? new Date(item.start_date).toLocaleDateString() : "—",
    end_date: item.end_date ? new Date(item.end_date).toLocaleDateString() : "—",
  }))

  const auctions = statusFilter === "all"
    ? allAuctions
    : allAuctions.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "title",
      header: t(locale, "manage.title"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "current_bid",
      header: t(locale, "manage.current_bid"),
      align: "end" as const,
    },
    {
      key: "bids_count",
      header: t(locale, "manage.bids_count"),
      align: "end" as const,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "start_date",
      header: t(locale, "manage.start_date"),
    },
    {
      key: "end_date",
      header: t(locale, "manage.end_date"),
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
        <PageHeader title={t(locale, "manage.auctions")} subtitle="Manage auction listings" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={auctions} emptyTitle="No auctions found" countLabel="auctions" />
      </Container>
    </ManageLayout>
  )
}
