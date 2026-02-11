import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/warranty")({
  component: ManageWarrantyPage,
})

const STATUS_FILTERS = ["all", "active", "expired", "draft"] as const

function ManageWarrantyPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "warranty"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/warranty", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allWarranties = ((data as any)?.warranties || (data as any)?.warranty || []).map((item: any) => ({
    id: item.id,
    name: item.name || item.title || "—",
    type: item.type || "—",
    duration: item.duration || "—",
    coverage: item.coverage || "—",
    status: item.status || "active",
    claims: item.claims ?? item.claims_count ?? 0,
  }))

  const warranties = statusFilter === "all"
    ? allWarranties
    : allWarranties.filter((i: any) => i.status === statusFilter)

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
      key: "duration",
      header: t(locale, "manage.duration"),
    },
    {
      key: "coverage",
      header: t(locale, "manage.coverage"),
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "claims",
      header: t(locale, "manage.claims"),
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
        <PageHeader title={t(locale, "manage.warranty")} subtitle="Manage warranty policies" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={warranties} emptyTitle="No warranties found" countLabel="warranties" />
      </Container>
    </ManageLayout>
  )
}
