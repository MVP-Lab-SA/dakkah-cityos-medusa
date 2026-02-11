import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/memberships")({
  component: ManageMembershipsPage,
})

const STATUS_FILTERS = ["all", "active", "inactive", "full"] as const

function ManageMembershipsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "memberships"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/memberships", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allMemberships = ((data as any)?.memberships || (data as any)?.plans || []).map((item: any) => ({
    id: item.id,
    name: item.name || item.title || "—",
    tier: item.tier || "—",
    price: item.price ? `$${(item.price / 100).toFixed(2)}` : "$0.00",
    duration: item.duration || "—",
    members_count: item.members_count ?? 0,
    status: item.status || "active",
  }))

  const memberships = statusFilter === "all"
    ? allMemberships
    : allMemberships.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "name",
      header: t(locale, "manage.name"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "tier",
      header: t(locale, "manage.tier"),
    },
    {
      key: "price",
      header: t(locale, "manage.price"),
      align: "end" as const,
    },
    {
      key: "duration",
      header: t(locale, "manage.duration"),
    },
    {
      key: "members_count",
      header: t(locale, "manage.members_count"),
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
        <PageHeader title={t(locale, "manage.memberships")} subtitle="Manage membership plans" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={memberships} emptyTitle="No memberships found" countLabel="memberships" />
      </Container>
    </ManageLayout>
  )
}
