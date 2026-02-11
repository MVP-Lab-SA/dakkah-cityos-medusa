import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/charity")({
  component: ManageCharityPage,
})

const STATUS_FILTERS = ["all", "active", "completed", "paused"] as const

function ManageCharityPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "charities"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/charities", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allCampaigns = ((data as any)?.campaigns || (data as any)?.charities || []).map((item: any) => ({
    id: item.id,
    name: item.name || item.title || "—",
    cause: item.cause || "—",
    goal: item.goal ? `$${(item.goal / 100).toFixed(2)}` : "$0.00",
    raised: item.raised ? `$${(item.raised / 100).toFixed(2)}` : "$0.00",
    donors: item.donors ?? item.donors_count ?? 0,
    status: item.status || "active",
  }))

  const campaigns = statusFilter === "all"
    ? allCampaigns
    : allCampaigns.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "name",
      header: t(locale, "manage.name"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "cause",
      header: t(locale, "manage.cause"),
    },
    {
      key: "goal",
      header: t(locale, "manage.goal"),
      align: "end" as const,
    },
    {
      key: "raised",
      header: t(locale, "manage.raised"),
      align: "end" as const,
    },
    {
      key: "donors",
      header: t(locale, "manage.donors"),
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
        <PageHeader title={t(locale, "manage.charity")} subtitle="Manage charity campaigns" />

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

        <DataTable columns={columns} data={campaigns} emptyTitle="No charity campaigns found" countLabel="campaigns" />
      </Container>
    </ManageLayout>
  )
}
