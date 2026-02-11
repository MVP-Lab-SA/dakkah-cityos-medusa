import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/advertising")({
  component: ManageAdvertisingPage,
})

const STATUS_FILTERS = ["all", "active", "paused", "completed", "draft"] as const

function ManageAdvertisingPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "advertising"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/advertising", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allCampaigns = ((data as any)?.campaigns || (data as any)?.advertising || []).map((item: any) => ({
    id: item.id,
    name: item.name || item.title || "—",
    type: item.type || "banner",
    budget: item.budget ? `$${(item.budget / 100).toFixed(2)}` : "$0.00",
    spent: item.spent ? `$${(item.spent / 100).toFixed(2)}` : "$0.00",
    impressions: item.impressions ?? 0,
    clicks: item.clicks ?? 0,
    status: item.status || "draft",
  }))

  const campaigns = statusFilter === "all"
    ? allCampaigns
    : allCampaigns.filter((i: any) => i.status === statusFilter)

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
      key: "budget",
      header: t(locale, "manage.budget"),
      align: "end" as const,
    },
    {
      key: "spent",
      header: t(locale, "manage.spent"),
      align: "end" as const,
    },
    {
      key: "impressions",
      header: t(locale, "manage.impressions"),
      align: "end" as const,
    },
    {
      key: "clicks",
      header: t(locale, "manage.clicks"),
      align: "end" as const,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
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
          <SkeletonTable rows={8} cols={8} />
        </Container>
      </ManageLayout>
    )
  }

  return (
    <ManageLayout locale={locale}>
      <Container>
        <PageHeader title={t(locale, "manage.advertising")} subtitle="Manage advertising campaigns" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={campaigns} emptyTitle="No advertising campaigns found" countLabel="campaigns" />
      </Container>
    </ManageLayout>
  )
}
