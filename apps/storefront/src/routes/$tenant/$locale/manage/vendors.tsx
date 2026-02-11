import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
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
        <DropdownMenu
          items={[
            { label: t(locale, "manage.view"), onClick: () => {} },
            ...(row.status === "pending" ? [{ label: t(locale, "manage.approve"), onClick: () => {} }] : []),
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
        <PageHeader
          title={t(locale, "manage.vendors")}
          subtitle={t(locale, "manage.vendors_subtitle")}
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
