import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/promotions")({
  component: ManagePromotionsPage,
})

const STATUS_FILTERS = ["all", "active", "expired", "draft"] as const

function ManagePromotionsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "promotions"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/promotions", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allPromotions = ((data as any)?.promotions || []).map((item: any) => ({
    id: item.id,
    name: item.name || item.title || "—",
    code: item.code || "—",
    type: item.type || "percentage",
    discount_value: item.discount_value ?? item.value ?? "—",
    usage_count: item.usage_count ?? 0,
    usage_limit: item.usage_limit ?? "—",
    status: item.status || "draft",
    valid_until: item.valid_until ? new Date(item.valid_until).toLocaleDateString() : "—",
  }))

  const promotions = statusFilter === "all"
    ? allPromotions
    : allPromotions.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "name",
      header: t(locale, "manage.name"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "code",
      header: t(locale, "manage.code"),
    },
    {
      key: "type",
      header: t(locale, "manage.type"),
    },
    {
      key: "discount_value",
      header: t(locale, "manage.discount_value"),
      align: "end" as const,
    },
    {
      key: "usage_count",
      header: t(locale, "manage.usage_count"),
      align: "end" as const,
    },
    {
      key: "usage_limit",
      header: t(locale, "manage.usage_limit"),
      align: "end" as const,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "valid_until",
      header: t(locale, "manage.valid_until"),
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
        <PageHeader title={t(locale, "manage.promotions")} subtitle="Manage promotions and discount codes" />

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

        <DataTable columns={columns} data={promotions} emptyTitle="No promotions found" countLabel="promotions" />
      </Container>
    </ManageLayout>
  )
}
