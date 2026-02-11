import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge } from "@/components/manage/ui"
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
        <PageHeader title={t(locale, "manage.auctions")} subtitle="Manage auction listings" />

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

        <DataTable columns={columns} data={auctions} emptyTitle="No auctions found" countLabel="auctions" />
      </Container>
    </ManageLayout>
  )
}
