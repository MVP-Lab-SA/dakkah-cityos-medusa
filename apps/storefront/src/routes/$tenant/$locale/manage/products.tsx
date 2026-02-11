import { createFileRoute } from "@tanstack/react-router"
import { ManageLayout, ManageProductList } from "@/components/manage"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

export const Route = createFileRoute("/$tenant/$locale/manage/products")({
  component: ManageProductsPage,
})

function ManageProductsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"

  return (
    <ManageLayout locale={locale}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-ds-text">{t(locale, "manage.products")}</h2>
            <p className="text-sm text-ds-muted mt-1">{t(locale, "manage.active_products")}</p>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t(locale, "manage.add_product")}
          </button>
        </div>
        <ManageProductList locale={locale} products={[]} />
      </div>
    </ManageLayout>
  )
}
