import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/subscriptions")({
  component: ManageSubscriptionsPage,
})

const STATUS_FILTERS = ["all", "active", "paused", "cancelled", "expired"] as const

function ManageSubscriptionsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "subscriptions"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/subscriptions", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allSubscriptions = ((data as any)?.subscriptions || []).map((sub: any) => ({
    id: sub.id?.slice(0, 8) || "—",
    customer: sub.customer?.first_name
      ? `${sub.customer.first_name} ${sub.customer.last_name || ""}`.trim()
      : sub.customer_email || "—",
    plan: sub.plan?.name || sub.plan_name || "—",
    status: sub.status || "active",
    next_billing_date: sub.next_billing_date
      ? new Date(sub.next_billing_date).toLocaleDateString()
      : "—",
    amount: sub.amount ? `$${(sub.amount / 100).toFixed(2)}` : "$0.00",
  }))

  const subscriptions = statusFilter === "all"
    ? allSubscriptions
    : allSubscriptions.filter((sub: any) => sub.status === statusFilter)

  const columns = [
    {
      key: "id",
      header: t(locale, "manage.subscription_id"),
      render: (val: unknown) => <span className="font-medium font-mono">{val as string}</span>,
    },
    {
      key: "customer",
      header: t(locale, "manage.customer"),
    },
    {
      key: "plan",
      header: t(locale, "manage.plan"),
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => (
        <StatusBadge
          status={val as string}
          variants={{
            active: "bg-green-600",
            paused: "bg-amber-500",
            cancelled: "bg-red-600",
            expired: "bg-gray-400",
          }}
        />
      ),
    },
    {
      key: "next_billing_date",
      header: t(locale, "manage.next_billing_date"),
    },
    {
      key: "amount",
      header: t(locale, "manage.amount"),
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
        <PageHeader
          title={t(locale, "manage.subscriptions")}
          subtitle={t(locale, "manage.manage_subscriptions")}
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
          data={subscriptions}
          emptyTitle={t(locale, "manage.no_subscriptions")}
          countLabel={t(locale, "manage.subscriptions").toLowerCase()}
        />
      </Container>
    </ManageLayout>
  )
}
