import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/reviews")({
  component: ManageReviewsPage,
})

const STATUS_FILTERS = ["all", "pending", "approved", "rejected"] as const

function renderStars(rating: number) {
  const stars = Math.min(Math.max(Math.round(rating), 0), 5)
  return (
    <span className="text-ds-warning" title={`${rating}/5`}>
      {"★".repeat(stars)}
      {"☆".repeat(5 - stars)}
    </span>
  )
}

function ManageReviewsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "reviews"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/reviews", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allReviews = ((data as any)?.reviews || []).map((r: any) => ({
    id: r.id,
    product: r.product?.title || r.product_title || "—",
    customer: r.customer?.first_name
      ? `${r.customer.first_name} ${r.customer.last_name || ""}`.trim()
      : r.customer_name || "—",
    rating: r.rating ?? 0,
    status: r.status || "pending",
    date: r.created_at ? new Date(r.created_at).toLocaleDateString() : "—",
  }))

  const reviews = statusFilter === "all"
    ? allReviews
    : allReviews.filter((r: any) => r.status === statusFilter)

  const columns = [
    {
      key: "product",
      header: t(locale, "manage.product"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "customer",
      header: t(locale, "manage.customer"),
    },
    {
      key: "rating",
      header: t(locale, "manage.rating"),
      render: (val: unknown) => renderStars(val as number),
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => (
        <StatusBadge
          status={val as string}
          variants={{
            pending: "bg-ds-warning",
            approved: "bg-ds-success",
            rejected: "bg-ds-destructive",
          }}
        />
      ),
    },
    {
      key: "date",
      header: t(locale, "manage.date"),
    },
    {
      key: "actions",
      header: t(locale, "manage.actions"),
      align: "end" as const,
      render: (_: unknown, row: Record<string, unknown>) => (
        <div className="flex items-center justify-end gap-2">
          {row.status !== "approved" && (
            <button type="button" className="px-3 py-1.5 text-sm text-ds-success hover:bg-ds-background rounded-lg transition-colors">
              {t(locale, "manage.approve")}
            </button>
          )}
          {row.status !== "rejected" && (
            <button type="button" className="px-3 py-1.5 text-sm text-ds-destructive hover:bg-ds-background rounded-lg transition-colors">
              {t(locale, "manage.reject")}
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
          title={t(locale, "manage.reviews")}
          subtitle={t(locale, "manage.manage_reviews")}
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
          data={reviews}
          emptyTitle={t(locale, "manage.no_reviews")}
          countLabel={t(locale, "manage.reviews").toLowerCase()}
        />
      </Container>
    </ManageLayout>
  )
}
