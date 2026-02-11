import { createFileRoute } from "@tanstack/react-router"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, SkeletonTable } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/customers")({
  component: ManageCustomersPage,
})

function ManageCustomersPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "customers"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/store/customers", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const customers = ((data as any)?.customers || []).map((c: any) => ({
    id: c.id,
    name: [c.first_name, c.last_name].filter(Boolean).join(" ") || "—",
    email: c.email || "—",
    phone: c.phone || "—",
    orders_count: c.orders_count ?? 0,
    created_at: c.created_at ? new Date(c.created_at).toLocaleDateString() : "—",
  }))

  const columns = [
    {
      key: "name",
      header: t(locale, "manage.customer_name"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "email",
      header: t(locale, "manage.email"),
    },
    {
      key: "phone",
      header: t(locale, "manage.phone"),
    },
    {
      key: "orders_count",
      header: t(locale, "manage.orders_count"),
      align: "end" as const,
    },
    {
      key: "created_at",
      header: t(locale, "manage.date"),
    },
  ]

  if (isLoading) {
    return (
      <ManageLayout locale={locale}>
        <Container>
          <SkeletonTable rows={8} cols={5} />
        </Container>
      </ManageLayout>
    )
  }

  return (
    <ManageLayout locale={locale}>
      <Container>
        <PageHeader
          title={t(locale, "manage.customers")}
          subtitle={t(locale, "manage.manage_customers")}
        />
        <DataTable
          columns={columns}
          data={customers}
          searchable
          searchPlaceholder={t(locale, "manage.search_by_email")}
          searchKey="email"
          emptyTitle={t(locale, "manage.no_customers")}
          countLabel={t(locale, "manage.customers").toLowerCase()}
        />
      </Container>
    </ManageLayout>
  )
}
