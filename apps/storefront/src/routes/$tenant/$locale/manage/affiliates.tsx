import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/affiliates")({
  component: ManageAffiliatesPage,
})

const STATUS_FILTERS = ["all", "active", "inactive"] as const

function ManageAffiliatesPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const { data, isLoading } = useQuery({
    queryKey: ["manage", "affiliates"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/affiliates", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const allAffiliates = ((data as any)?.affiliates || []).map((a: any) => ({
    id: a.id,
    name: a.name || a.first_name ? `${a.first_name || ""} ${a.last_name || ""}`.trim() : "—",
    code: a.code || a.referral_code || "—",
    clicks: a.clicks ?? 0,
    conversions: a.conversions ?? 0,
    earnings: a.earnings ? `$${(a.earnings / 100).toFixed(2)}` : "$0.00",
    status: a.status || "active",
  }))

  const affiliates = statusFilter === "all"
    ? allAffiliates
    : allAffiliates.filter((a: any) => a.status === statusFilter)

  const columns = [
    {
      key: "name",
      header: t(locale, "manage.name"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "code",
      header: t(locale, "manage.code"),
      render: (val: unknown) => <span className="font-mono text-xs">{val as string}</span>,
    },
    {
      key: "clicks",
      header: t(locale, "manage.clicks"),
      align: "end" as const,
    },
    {
      key: "conversions",
      header: t(locale, "manage.conversions"),
      align: "end" as const,
    },
    {
      key: "earnings",
      header: t(locale, "manage.earnings"),
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
        <PageHeader
          title={t(locale, "manage.affiliates")}
          subtitle={t(locale, "manage.affiliates_subtitle")}
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
          data={affiliates}
          emptyTitle={t(locale, "manage.no_affiliates")}
          countLabel={t(locale, "manage.affiliates").toLowerCase()}
        />
      </Container>
    </ManageLayout>
  )
}
