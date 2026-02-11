import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, SkeletonTable } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/audit")({
  component: ManageAuditPage,
})

function ManageAuditPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [search, setSearch] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "audit"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/audit", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  let logs = ((data as any)?.logs || (data as any)?.audit || []).map((item: any) => ({
    id: item.id,
    timestamp: item.timestamp || item.created_at ? new Date(item.timestamp || item.created_at).toLocaleString() : "—",
    user: item.user?.name || item.user_name || item.user || "—",
    action: item.action || "—",
    entity: item.entity || item.entity_type || "—",
    entity_id: item.entity_id || "—",
    ip_address: item.ip_address || item.ip || "—",
  }))

  if (search.trim()) {
    const q = search.trim().toLowerCase()
    logs = logs.filter((i: any) => i.action.toLowerCase().includes(q))
  }

  const columns = [
    {
      key: "timestamp",
      header: t(locale, "manage.timestamp"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "user",
      header: t(locale, "manage.user"),
    },
    {
      key: "action",
      header: t(locale, "manage.action"),
    },
    {
      key: "entity",
      header: t(locale, "manage.entity"),
    },
    {
      key: "entity_id",
      header: t(locale, "manage.entity_id"),
    },
    {
      key: "ip_address",
      header: t(locale, "manage.ip_address"),
    },
  ]

  if (isLoading) {
    return (
      <ManageLayout locale={locale}>
        <Container>
          <SkeletonTable rows={8} cols={6} />
        </Container>
      </ManageLayout>
    )
  }

  return (
    <ManageLayout locale={locale}>
      <Container>
        <PageHeader title={t(locale, "manage.audit")} subtitle="View audit logs" />

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200"
          />
        </div>

        <DataTable columns={columns} data={logs} emptyTitle="No audit logs found" countLabel="logs" />
      </Container>
    </ManageLayout>
  )
}
