import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/region-zones")({
  component: ManageRegionZonesPage,
})

const STATUS_FILTERS = ["all", "active", "inactive"] as const

function ManageRegionZonesPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "region-zones"],
    queryFn: async () => {
      try {
        const response = await sdk.client.fetch("/admin/region-zones", { method: "GET" })
        return response
      } catch {
        const response = await sdk.client.fetch("/admin/i18n", { method: "GET" })
        return response
      }
    },
    enabled: typeof window !== "undefined",
  })

  const allZones = ((data as any)?.zones || (data as any)?.region_zones || []).map((item: any) => ({
    id: item.id,
    name: item.name || item.title || "—",
    code: item.code || "—",
    residency: item.residency || item.region || "GLOBAL",
    countries: Array.isArray(item.countries) ? item.countries.join(", ") : item.countries || "—",
    status: item.status || "active",
    data_center: item.data_center || item.datacenter || "—",
  }))

  const zones = statusFilter === "all"
    ? allZones
    : allZones.filter((i: any) => i.status === statusFilter)

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
      key: "residency",
      header: t(locale, "manage.residency"),
    },
    {
      key: "countries",
      header: t(locale, "manage.countries"),
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "data_center",
      header: t(locale, "manage.data_center"),
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
        <PageHeader title={t(locale, "manage.region_zones")} subtitle="Manage region zones" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={zones} emptyTitle="No region zones found" countLabel="zones" />
      </Container>
    </ManageLayout>
  )
}
