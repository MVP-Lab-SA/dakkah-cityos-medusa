import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/vendors")({
  component: ManageVendorsPage,
})

const STATUS_FILTERS = ["all", "pending", "approved", "suspended"] as const

function ManageVendorsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const { data, isLoading } = useQuery({
    queryKey: ["manage", "vendors"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/vendors", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const allVendors = ((data as any)?.vendors || []).map((v: any) => ({
    id: v.id,
    name: v.company_name || v.name || "—",
    contact: v.email || "—",
    status: v.status || "pending",
    products_count: v.products_count ?? 0,
    rating: v.rating ? Number(v.rating).toFixed(1) : "—",
    joined: v.created_at ? new Date(v.created_at).toLocaleDateString() : "—",
  }))

  const vendors = statusFilter === "all"
    ? allVendors
    : allVendors.filter((v: any) => v.status === statusFilter)

  const columns = [
    {
      key: "name",
      header: t(locale, "manage.name"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "contact",
      header: t(locale, "manage.contact"),
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "products_count",
      header: t(locale, "manage.products"),
      align: "end" as const,
    },
    {
      key: "rating",
      header: t(locale, "manage.rating"),
      align: "end" as const,
    },
    {
      key: "joined",
      header: t(locale, "manage.joined"),
    },
    {
      key: "actions",
      header: t(locale, "manage.actions"),
      align: "end" as const,
      render: (_val: unknown, row: any) => (
        <div className="flex items-center justify-end gap-1">
          <button type="button" className="px-3 py-1.5 text-sm text-ds-muted hover:text-ds-text hover:bg-ds-background rounded-lg transition-colors">
            {t(locale, "manage.view")}
          </button>
          {row.status === "pending" && (
            <button type="button" className="px-3 py-1.5 text-sm text-ds-primary hover:text-ds-primary/80 hover:bg-ds-background rounded-lg transition-colors">
              {t(locale, "manage.approve")}
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
          title={t(locale, "manage.vendors")}
          subtitle={t(locale, "manage.vendors_subtitle")}
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
          data={vendors}
          searchable
          searchKey="name"
          searchPlaceholder={t(locale, "manage.search_vendors")}
          emptyTitle={t(locale, "manage.no_vendors")}
          countLabel={t(locale, "manage.vendors").toLowerCase()}
        />
      </Container>
    </ManageLayout>
  )
}
