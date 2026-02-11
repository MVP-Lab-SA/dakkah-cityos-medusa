import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/companies")({
  component: ManageCompaniesPage,
})

const STATUS_FILTERS = ["all", "active", "pending", "suspended"] as const

function ManageCompaniesPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [search, setSearch] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "companies"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/companies", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allCompanies = ((data as any)?.companies || []).map((item: any) => ({
    id: item.id,
    name: item.name || "—",
    industry: item.industry || "—",
    contact_email: item.contact_email || item.email || "—",
    credit_limit: item.credit_limit ? `$${(item.credit_limit / 100).toFixed(2)}` : "$0.00",
    status: item.status || "active",
    team_size: item.team_size ?? 0,
  }))

  const companies = allCompanies
    .filter((i: any) => statusFilter === "all" || i.status === statusFilter)
    .filter((i: any) => !search || i.name.toLowerCase().includes(search.toLowerCase()))

  const columns = [
    {
      key: "name",
      header: t(locale, "manage.name"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "industry",
      header: t(locale, "manage.industry"),
    },
    {
      key: "contact_email",
      header: t(locale, "manage.contact_email"),
    },
    {
      key: "credit_limit",
      header: t(locale, "manage.credit_limit"),
      align: "end" as const,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "team_size",
      header: t(locale, "manage.team_size"),
      align: "end" as const,
    },
    {
      key: "actions",
      header: t(locale, "manage.actions"),
      align: "end" as const,
      render: (_val: unknown, row: any) => (
        <DropdownMenu
          items={[
            { label: t(locale, "manage.view"), onClick: () => {} },
            ...(row.status === "pending" ? [{ label: t(locale, "manage.approve"), onClick: () => {} }] : []),
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
        <PageHeader title={t(locale, "manage.companies")} subtitle="Manage company accounts" />

        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 w-64"
          />
        </div>

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={companies} emptyTitle="No companies found" countLabel="companies" />
      </Container>
    </ManageLayout>
  )
}
