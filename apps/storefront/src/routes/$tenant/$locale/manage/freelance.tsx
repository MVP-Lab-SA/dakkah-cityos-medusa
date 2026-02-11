import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/freelance")({
  component: ManageFreelancePage,
})

const STATUS_FILTERS = ["all", "open", "in_progress", "completed", "cancelled"] as const

function ManageFreelancePage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "freelance"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/freelance", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allGigs = ((data as any)?.gigs || (data as any)?.freelance || []).map((item: any) => ({
    id: item.id,
    title: item.title || item.name || "—",
    category: item.category || "—",
    freelancer: item.freelancer || item.freelancer_name || "—",
    budget: item.budget ? `$${(item.budget / 100).toFixed(2)}` : "$0.00",
    status: item.status || "open",
    proposals: item.proposals ?? item.proposals_count ?? 0,
  }))

  const gigs = statusFilter === "all"
    ? allGigs
    : allGigs.filter((i: any) => i.status === statusFilter)

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
      key: "freelancer",
      header: t(locale, "manage.freelancer"),
    },
    {
      key: "budget",
      header: t(locale, "manage.budget"),
      align: "end" as const,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "proposals",
      header: t(locale, "manage.proposals"),
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
        <PageHeader title={t(locale, "manage.freelance")} subtitle="Manage freelance gigs" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={gigs} emptyTitle="No freelance gigs found" countLabel="gigs" />
      </Container>
    </ManageLayout>
  )
}
