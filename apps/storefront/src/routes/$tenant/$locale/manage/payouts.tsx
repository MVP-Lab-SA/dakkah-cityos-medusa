import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/payouts")({
  component: ManagePayoutsPage,
})

const STATUS_FILTERS = ["all", "pending", "processing", "completed", "failed", "on_hold"] as const

function ManagePayoutsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const { data, isLoading } = useQuery({
    queryKey: ["manage", "payouts"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/payouts", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const allPayouts = ((data as any)?.payouts || []).map((p: any) => ({
    id: p.id,
    vendor: p.vendor?.company_name || p.vendor_name || "—",
    amount: p.amount ? `$${(p.amount / 100).toFixed(2)}` : "$0.00",
    status: p.status || "pending",
    method: p.method || p.payout_method || "—",
    date: p.created_at ? new Date(p.created_at).toLocaleDateString() : "—",
  }))

  const payouts = statusFilter === "all"
    ? allPayouts
    : allPayouts.filter((p: any) => p.status === statusFilter)

  const columns = [
    {
      key: "vendor",
      header: t(locale, "manage.vendor"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "amount",
      header: t(locale, "manage.amount"),
      align: "end" as const,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "method",
      header: t(locale, "manage.method"),
    },
    {
      key: "date",
      header: t(locale, "manage.date"),
    },
    {
      key: "actions",
      header: t(locale, "manage.actions"),
      align: "end" as const,
      render: (_val: unknown, row: any) => (
        <div className="flex items-center justify-end gap-1">
          {row.status === "pending" && (
            <button type="button" className="px-3 py-1.5 text-sm text-ds-primary hover:text-ds-primary/80 hover:bg-ds-background rounded-lg transition-colors">
              {t(locale, "manage.process")}
            </button>
          )}
          {(row.status === "pending" || row.status === "processing") && (
            <button type="button" className="px-3 py-1.5 text-sm text-ds-muted hover:text-ds-text hover:bg-ds-background rounded-lg transition-colors">
              {t(locale, "manage.hold")}
            </button>
          )}
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
        <PageHeader
          title={t(locale, "manage.payouts")}
          subtitle={t(locale, "manage.payouts_subtitle")}
        />

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
              {s === "all" ? t(locale, "manage.all_statuses") : t(locale, `manage.${s}`)}
            </button>
          ))}
        </div>

        <DataTable
          columns={columns}
          data={payouts}
          emptyTitle={t(locale, "manage.no_payouts")}
          countLabel={t(locale, "manage.payouts").toLowerCase()}
        />
      </Container>
    </ManageLayout>
  )
}
