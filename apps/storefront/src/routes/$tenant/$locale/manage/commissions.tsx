import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/commissions")({
  component: ManageCommissionsPage,
})

const STATUS_FILTERS = ["all", "pending", "calculated", "paid"] as const

function ManageCommissionsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const { data, isLoading } = useQuery({
    queryKey: ["manage", "commissions"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/commissions/transactions", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const allCommissions = ((data as any)?.transactions || []).map((c: any) => ({
    id: c.id,
    vendor: c.vendor?.company_name || c.vendor_name || "—",
    order_id: c.order_id ? `#${c.order_id}`.slice(0, 12) : "—",
    amount: c.amount ? `$${(c.amount / 100).toFixed(2)}` : "$0.00",
    commission_rate: c.commission_rate ? `${c.commission_rate}%` : "—",
    commission_amount: c.commission_amount ? `$${(c.commission_amount / 100).toFixed(2)}` : "$0.00",
    status: c.status || "pending",
    date: c.created_at ? new Date(c.created_at).toLocaleDateString() : "—",
  }))

  const commissions = statusFilter === "all"
    ? allCommissions
    : allCommissions.filter((c: any) => c.status === statusFilter)

  const columns = [
    {
      key: "vendor",
      header: t(locale, "manage.vendor"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "order_id",
      header: t(locale, "manage.order_number"),
    },
    {
      key: "amount",
      header: t(locale, "manage.amount"),
      align: "end" as const,
    },
    {
      key: "commission_rate",
      header: t(locale, "manage.commission_rate"),
      align: "end" as const,
    },
    {
      key: "commission_amount",
      header: t(locale, "manage.commission_amount"),
      align: "end" as const,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "date",
      header: t(locale, "manage.date"),
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
          title={t(locale, "manage.commissions")}
          subtitle={t(locale, "manage.commissions_subtitle")}
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
          data={commissions}
          emptyTitle={t(locale, "manage.no_commissions")}
          countLabel={t(locale, "manage.commissions").toLowerCase()}
        />
      </Container>
    </ManageLayout>
  )
}
