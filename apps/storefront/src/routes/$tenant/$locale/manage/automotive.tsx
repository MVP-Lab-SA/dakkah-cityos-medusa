import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/automotive")({
  component: ManageAutomotivePage,
})

const STATUS_FILTERS = ["all", "available", "sold", "reserved"] as const

function ManageAutomotivePage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "automotive"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/automotive", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allItems = ((data as any)?.vehicles || (data as any)?.automotive || []).map((item: any) => ({
    id: item.id,
    make_model: item.make_model || `${item.make || ""} ${item.model || ""}`.trim() || "—",
    year: item.year || "—",
    price: item.price ? `$${(item.price / 100).toFixed(2)}` : "$0.00",
    mileage: item.mileage ?? "—",
    status: item.status || "available",
    condition: item.condition || "—",
  }))

  const items = statusFilter === "all"
    ? allItems
    : allItems.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "make_model",
      header: t(locale, "manage.make_model"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "year",
      header: t(locale, "manage.year"),
    },
    {
      key: "price",
      header: t(locale, "manage.price"),
      align: "end" as const,
    },
    {
      key: "mileage",
      header: t(locale, "manage.mileage"),
      align: "end" as const,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "condition",
      header: t(locale, "manage.condition"),
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
        <PageHeader title={t(locale, "manage.automotive")} subtitle="Manage vehicle listings" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={items} emptyTitle="No vehicles found" countLabel="vehicles" />
      </Container>
    </ManageLayout>
  )
}
