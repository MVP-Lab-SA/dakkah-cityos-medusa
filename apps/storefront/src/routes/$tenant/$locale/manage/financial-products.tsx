import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/financial-products")({
  component: ManageFinancialProductsPage,
})

const STATUS_FILTERS = ["all", "active", "pending", "closed"] as const

function ManageFinancialProductsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "financial-products"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/financial-products", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allProducts = ((data as any)?.products || (data as any)?.financial_products || []).map((item: any) => ({
    id: item.id,
    name: item.name || item.title || "—",
    type: item.type || "—",
    rate: item.rate || "—",
    term: item.term || "—",
    status: item.status || "active",
    applications: item.applications ?? 0,
  }))

  const products = statusFilter === "all"
    ? allProducts
    : allProducts.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "name",
      header: t(locale, "manage.name"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "type",
      header: t(locale, "manage.type"),
    },
    {
      key: "rate",
      header: t(locale, "manage.rate"),
    },
    {
      key: "term",
      header: t(locale, "manage.term"),
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "applications",
      header: t(locale, "manage.applications"),
      align: "end" as const,
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
        <PageHeader title={t(locale, "manage.financial_products")} subtitle="Manage financial product offerings" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={products} emptyTitle="No financial products found" countLabel="financial products" />
      </Container>
    </ManageLayout>
  )
}
