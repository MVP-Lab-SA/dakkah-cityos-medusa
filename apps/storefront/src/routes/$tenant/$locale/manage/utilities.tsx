import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/utilities")({
  component: ManageUtilitiesPage,
})

const STATUS_FILTERS = ["all", "active", "inactive"] as const

function ManageUtilitiesPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "utilities"],
    queryFn: async () => {
      try {
        const response = await sdk.client.fetch("/admin/utilities", { method: "GET" })
        return response
      } catch {
        const response = await sdk.client.fetch("/store/utilities", { method: "GET" })
        return response
      }
    },
    enabled: typeof window !== "undefined",
  })

  const allUtilities = ((data as any)?.services || (data as any)?.utilities || []).map((item: any) => ({
    id: item.id,
    name: item.name || item.title || "—",
    type: item.type || "—",
    provider: item.provider || "—",
    price: item.price ? `$${(item.price / 100).toFixed(2)}` : "$0.00",
    status: item.status || "active",
    subscribers: item.subscribers ?? item.subscribers_count ?? 0,
  }))

  const utilities = statusFilter === "all"
    ? allUtilities
    : allUtilities.filter((i: any) => i.status === statusFilter)

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
      key: "provider",
      header: t(locale, "manage.provider"),
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
      key: "subscribers",
      header: t(locale, "manage.subscribers"),
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
        <PageHeader title={t(locale, "manage.utilities")} subtitle="Manage utility services" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={utilities} emptyTitle="No utility services found" countLabel="services" />
      </Container>
    </ManageLayout>
  )
}
