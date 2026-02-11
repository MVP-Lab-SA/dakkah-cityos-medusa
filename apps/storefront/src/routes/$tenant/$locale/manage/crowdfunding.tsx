import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/crowdfunding")({
  component: ManageCrowdfundingPage,
})

const STATUS_FILTERS = ["all", "active", "funded", "failed", "draft"] as const

function ManageCrowdfundingPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "crowdfunding"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/crowdfunding", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allCampaigns = ((data as any)?.campaigns || (data as any)?.crowdfunding || []).map((item: any) => ({
    id: item.id,
    title: item.title || item.name || "—",
    goal: item.goal ? `$${(item.goal / 100).toFixed(2)}` : "$0.00",
    raised: item.raised ? `$${(item.raised / 100).toFixed(2)}` : "$0.00",
    backers: item.backers ?? item.backers_count ?? 0,
    progress: item.goal && item.raised ? `${Math.round((item.raised / item.goal) * 100)}%` : "0%",
    status: item.status || "draft",
    end_date: item.end_date ? new Date(item.end_date).toLocaleDateString() : "—",
  }))

  const campaigns = statusFilter === "all"
    ? allCampaigns
    : allCampaigns.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "title",
      header: t(locale, "manage.title"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
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
      key: "backers",
      header: t(locale, "manage.backers"),
      align: "end" as const,
    },
    {
      key: "progress",
      header: t(locale, "manage.progress"),
      align: "end" as const,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "end_date",
      header: t(locale, "manage.end_date"),
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
        <PageHeader title={t(locale, "manage.crowdfunding")} subtitle="Manage crowdfunding campaigns" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={campaigns} emptyTitle="No crowdfunding campaigns found" countLabel="campaigns" />
      </Container>
    </ManageLayout>
  )
}
