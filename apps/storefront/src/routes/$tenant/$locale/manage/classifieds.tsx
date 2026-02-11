import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/classifieds")({
  component: ManageClassifiedsPage,
})

const STATUS_FILTERS = ["all", "active", "expired", "flagged", "sold"] as const

function ManageClassifiedsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "classifieds"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/classifieds", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allListings = ((data as any)?.listings || (data as any)?.classifieds || []).map((item: any) => ({
    id: item.id,
    title: item.title || item.name || "—",
    category: item.category || "—",
    price: item.price ? `$${(item.price / 100).toFixed(2)}` : "$0.00",
    location: item.location || "—",
    status: item.status || "active",
    posted_date: item.posted_date || item.created_at ? new Date(item.posted_date || item.created_at).toLocaleDateString() : "—",
  }))

  const listings = statusFilter === "all"
    ? allListings
    : allListings.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "title",
      header: t(locale, "manage.title"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "category",
      header: t(locale, "manage.category"),
    },
    {
      key: "price",
      header: t(locale, "manage.price"),
      align: "end" as const,
    },
    {
      key: "location",
      header: t(locale, "manage.location"),
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "posted_date",
      header: t(locale, "manage.posted_date"),
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
        <PageHeader title={t(locale, "manage.classifieds")} subtitle="Manage classified listings" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={listings} emptyTitle="No classifieds found" countLabel="listings" />
      </Container>
    </ManageLayout>
  )
}
