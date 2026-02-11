import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/charity")({
  component: ManageCharityPage,
})

const STATUS_FILTERS = ["all", "active", "completed", "paused"] as const

function ManageCharityPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "charities"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/charities", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allCampaigns = ((data as any)?.campaigns || (data as any)?.charities || []).map((item: any) => ({
    id: item.id,
    name: item.name || item.title || "—",
    cause: item.cause || "—",
    goal: item.goal ? `$${(item.goal / 100).toFixed(2)}` : "$0.00",
    raised: item.raised ? `$${(item.raised / 100).toFixed(2)}` : "$0.00",
    donors: item.donors ?? item.donors_count ?? 0,
    status: item.status || "active",
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
      key: "cause",
      header: t(locale, "manage.cause"),
    },
    {
      key: "goal",
      header: t(locale, "manage.goal"),
      align: "end" as const,
    },
    {
      key: "raised",
      header: t(locale, "manage.raised"),
      align: "end" as const,
    },
    {
      key: "donors",
      header: t(locale, "manage.donors"),
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
          <SkeletonTable rows={8} cols={7} />
        </Container>
      </ManageLayout>
    )
  }

  return (
    <ManageLayout locale={locale}>
      <Container>
        <PageHeader title={t(locale, "manage.charity")} subtitle="Manage charity campaigns" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={campaigns} emptyTitle="No charity campaigns found" countLabel="campaigns" />
      </Container>
    </ManageLayout>
  )
}
