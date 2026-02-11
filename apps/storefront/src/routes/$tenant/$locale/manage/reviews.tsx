import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
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
    <span className="text-amber-500" title={`${rating}/5`}>
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
            pending: "bg-amber-500",
            approved: "bg-green-600",
            rejected: "bg-red-600",
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
        <DropdownMenu
          items={[
            ...(row.status !== "approved" ? [{ label: t(locale, "manage.approve"), onClick: () => {} }] : []),
            ...(row.status !== "rejected" ? [{ type: "separator" as const }, { label: t(locale, "manage.reject"), onClick: () => {}, variant: "danger" as const }] : []),
          ]}
        />
      ),
    },
  ]

  if (isLoading) {
    return (
      <ManageLayout locale={locale}>
        <Container>
          <SkeletonTable rows={8} cols={6} />
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

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

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
