import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/healthcare")({
  component: ManageHealthcarePage,
})

const STATUS_FILTERS = ["all", "active", "inactive"] as const

function ManageHealthcarePage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "healthcare"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/healthcare", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allItems = ((data as any)?.services || (data as any)?.healthcare || []).map((item: any) => ({
    id: item.id,
    service_name: item.service_name || item.name || "—",
    provider: item.provider || "—",
    category: item.category || "—",
    price: item.price ? `$${(item.price / 100).toFixed(2)}` : "$0.00",
    status: item.status || "active",
    appointments: item.appointments ?? 0,
  }))

  const items = statusFilter === "all"
    ? allItems
    : allItems.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "service_name",
      header: t(locale, "manage.service_name"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "provider",
      header: t(locale, "manage.provider"),
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
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "appointments",
      header: t(locale, "manage.appointments"),
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
        <PageHeader title={t(locale, "manage.healthcare")} subtitle="Manage healthcare services" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={items} emptyTitle="No healthcare services found" countLabel="services" />
      </Container>
    </ManageLayout>
  )
}
