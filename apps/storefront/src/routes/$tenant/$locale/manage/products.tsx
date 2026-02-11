import { createFileRoute } from "@tanstack/react-router"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useManageProducts } from "@/lib/hooks/use-manage-data"
import { Plus } from "@medusajs/icons"

export const Route = createFileRoute("/$tenant/$locale/manage/products")({
  component: ManageProductsPage,
})

function ManageProductsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const { data, isLoading } = useManageProducts()

  const products = ((data as any)?.products || []).map((p: any) => ({
    id: p.id,
    title: p.title || "",
    thumbnail: p.thumbnail || "",
    status: p.status || "draft",
    price: p.variants?.[0]?.prices?.[0]?.amount
      ? `$${(p.variants[0].prices[0].amount / 100).toFixed(2)}`
      : "$0.00",
    inventory: p.variants?.reduce((sum: number, v: any) => sum + (v.inventory_quantity || 0), 0) ?? 0,
  }))

  const columns = [
    {
      key: "title",
      header: t(locale, "manage.product_name"),
      render: (_: unknown, row: Record<string, unknown>) => (
        <div className="flex items-center gap-3">
          {row.thumbnail ? (
            <img
              src={row.thumbnail as string}
              alt={row.title as string}
              className="w-10 h-10 rounded-md object-cover border border-ds-border"
            />
          ) : (
            <div className="w-10 h-10 rounded-md bg-ds-accent flex items-center justify-center text-ds-muted-foreground text-xs">
              —
            </div>
          )}
          <span className="font-medium">{row.title as string}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "price",
      header: t(locale, "manage.price"),
      align: "end" as const,
    },
    {
      key: "inventory",
      header: t(locale, "manage.inventory"),
      align: "end" as const,
    },
    {
      key: "actions",
      header: t(locale, "manage.actions"),
      align: "end" as const,
      render: () => (
        <div className="flex items-center justify-end gap-2">
          <button type="button" className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            {t(locale, "manage.edit")}
          </button>
          <button type="button" className="px-3 py-1.5 text-sm text-gray-400 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors">
            {t(locale, "manage.delete")}
          </button>
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <ManageLayout locale={locale}>
        <Container>
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-gray-100 rounded-lg w-48" />
            <div className="h-4 bg-gray-100 rounded-lg w-32" />
            <div className="h-64 bg-gray-100 rounded-lg" />
          </div>
        </Container>
      </ManageLayout>
    )
  }

  return (
    <ManageLayout locale={locale}>
      <Container>
        <PageHeader
          title={t(locale, "manage.products")}
          subtitle={t(locale, "manage.active_products")}
          actions={
            <button
              type="button"
              className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t(locale, "manage.add_product")}
            </button>
          }
        />
        <DataTable
          columns={columns}
          data={products}
          searchable
          searchPlaceholder={t(locale, "manage.search_products")}
          searchKey="title"
          emptyTitle={t(locale, "manage.no_products")}
          countLabel={t(locale, "manage.products").toLowerCase()}
        />
      </Container>
    </ManageLayout>
  )
}
