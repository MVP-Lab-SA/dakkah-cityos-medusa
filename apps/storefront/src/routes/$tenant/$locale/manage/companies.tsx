import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge } from "@/components/manage/ui"
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
        <div className="flex items-center justify-end gap-1">
          <button type="button" className="px-3 py-1.5 text-sm text-ds-muted hover:text-ds-text hover:bg-ds-background rounded-lg transition-colors">
            {t(locale, "manage.view")}
          </button>
          {row.status === "pending" && (
            <button type="button" className="px-3 py-1.5 text-sm text-ds-muted hover:text-ds-text hover:bg-ds-background rounded-lg transition-colors">
              {t(locale, "manage.approve")}
            </button>
          )}
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <ManageLayout locale={locale}>
        <Container>
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-ds-muted/20 rounded-lg w-48" />
            <div className="h-4 bg-ds-muted/20 rounded-lg w-32" />
            <div className="h-64 bg-ds-muted/20 rounded-lg" />
          </div>
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
            className="px-3 py-1.5 text-sm rounded-lg border border-ds-border bg-ds-card text-ds-text placeholder:text-ds-muted w-64"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? "bg-ds-card border border-ds-border text-ds-text font-medium"
                  : "text-ds-muted hover:text-ds-text"
              }`}
            >
              {s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        <DataTable columns={columns} data={companies} emptyTitle="No companies found" countLabel="companies" />
      </Container>
    </ManageLayout>
  )
}
