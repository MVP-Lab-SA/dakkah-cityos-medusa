import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
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
          <SkeletonTable rows={8} cols={9} />
        </Container>
      </ManageLayout>
    )
  }

  return (
    <ManageLayout locale={locale}>
      <Container>
        <PageHeader title={t(locale, "manage.promotions")} subtitle="Manage promotions and discount codes" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={promotions} emptyTitle="No promotions found" countLabel="promotions" />
      </Container>
    </ManageLayout>
  )
}
