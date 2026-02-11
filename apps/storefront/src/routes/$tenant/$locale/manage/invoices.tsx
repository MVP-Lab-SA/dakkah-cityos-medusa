import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/invoices")({
  component: ManageInvoicesPage,
})

const STATUS_FILTERS = ["all", "draft", "sent", "paid", "overdue", "void"] as const

function ManageInvoicesPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "invoices"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/invoices", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allInvoices = ((data as any)?.invoices || []).map((inv: any) => ({
    id: inv.id,
    display_id: inv.id?.slice(0, 8) || "—",
    customer: inv.customer?.first_name
      ? `${inv.customer.first_name} ${inv.customer.last_name || ""}`.trim()
      : inv.customer_email || "—",
    amount: inv.amount ? `$${(inv.amount / 100).toFixed(2)}` : "$0.00",
    status: inv.status || "draft",
    due_date: inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "—",
  }))

  const invoices = statusFilter === "all"
    ? allInvoices
    : allInvoices.filter((inv: any) => inv.status === statusFilter)

  const columns = [
    {
      key: "display_id",
      header: t(locale, "manage.invoice_id"),
      render: (val: unknown) => <span className="font-medium font-mono">{val as string}</span>,
    },
    {
      key: "customer",
      header: t(locale, "manage.customer"),
    },
    {
      key: "amount",
      header: t(locale, "manage.amount"),
      align: "end" as const,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => (
        <StatusBadge
          status={val as string}
          variants={{
            draft: "bg-amber-500",
            sent: "bg-violet-600",
            paid: "bg-green-600",
            overdue: "bg-red-600",
            void: "bg-gray-400",
          }}
        />
      ),
    },
    {
      key: "due_date",
      header: t(locale, "manage.due_date"),
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
        <PageHeader
          title={t(locale, "manage.invoices")}
          subtitle={t(locale, "manage.manage_invoices")}
        />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable
          columns={columns}
          data={invoices}
          emptyTitle={t(locale, "manage.no_invoices")}
          countLabel={t(locale, "manage.invoices").toLowerCase()}
        />
      </Container>
    </ManageLayout>
  )
}
