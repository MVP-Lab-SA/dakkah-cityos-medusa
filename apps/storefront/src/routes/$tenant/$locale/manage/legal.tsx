import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/legal")({
  component: ManageLegalPage,
})

const STATUS_FILTERS = ["all", "published", "draft", "archived"] as const

function ManageLegalPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "legal"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/legal", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allDocuments = ((data as any)?.documents || (data as any)?.legal || []).map((item: any) => ({
    id: item.id,
    title: item.title || item.name || "—",
    type: item.type || "—",
    version: item.version || "—",
    status: item.status || "draft",
    last_updated: item.last_updated || item.updated_at ? new Date(item.last_updated || item.updated_at).toLocaleDateString() : "—",
  }))

  const documents = statusFilter === "all"
    ? allDocuments
    : allDocuments.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "title",
      header: t(locale, "manage.title"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "type",
      header: t(locale, "manage.type"),
    },
    {
      key: "version",
      header: t(locale, "manage.version"),
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "last_updated",
      header: t(locale, "manage.last_updated"),
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
          <SkeletonTable rows={8} cols={6} />
        </Container>
      </ManageLayout>
    )
  }

  return (
    <ManageLayout locale={locale}>
      <Container>
        <PageHeader title={t(locale, "manage.legal")} subtitle="Manage legal documents" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={documents} emptyTitle="No legal documents found" countLabel="documents" />
      </Container>
    </ManageLayout>
  )
}
