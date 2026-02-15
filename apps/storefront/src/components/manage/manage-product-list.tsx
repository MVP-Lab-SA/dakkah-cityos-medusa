import { useState } from "react"
import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"
import { clsx } from "clsx"

interface Product {
  id: string
  title: string
  thumbnail?: string
  status: "active" | "draft" | "archived"
  price: number
  currency?: string
  inventory: number
}

interface ManageProductListProps {
  products?: Product[]
  locale?: string
}

const statusStyles: Record<string, string> = {
  active: "bg-ds-success/10 text-ds-success",
  draft: "bg-ds-warning/10 text-ds-warning",
  archived: "bg-ds-muted text-ds-muted",
}

export function ManageProductList({ products = [], locale: localeProp }: ManageProductListProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map((p) => p.id)))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(locale, "manage.search_products")}
            className="w-full px-3 py-2 bg-ds-background border border-ds-border rounded-lg text-sm text-ds-text placeholder:text-ds-muted focus:outline-none focus:ring-2 focus:ring-ds-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-ds-background border border-ds-border rounded-lg text-sm text-ds-text focus:outline-none focus:ring-2 focus:ring-ds-primary"
        >
          <option value="all">{t(locale, "manage.all_statuses")}</option>
          <option value="active">{t(locale, "manage.active")}</option>
          <option value="draft">{t(locale, "manage.draft")}</option>
          <option value="archived">{t(locale, "manage.archived")}</option>
        </select>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 bg-ds-primary/10 rounded-lg">
          <span className="text-sm text-ds-primary font-medium">
            {selected.size} {t(locale, "manage.selected")}
          </span>
          <button
            type="button"
            className="text-xs text-ds-primary hover:underline"
            onClick={() => setSelected(new Set())}
          >
            {t(locale, "common.cancel")}
          </button>
        </div>
      )}

      <div className="bg-ds-card border border-ds-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ds-border bg-ds-background">
                <th className="px-4 py-3 text-start">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="rounded border-ds-border"
                  />
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-ds-muted uppercase">{t(locale, "manage.product_name")}</th>
                <th className="px-4 py-3 text-start text-xs font-medium text-ds-muted uppercase">{t(locale, "manage.status")}</th>
                <th className="px-4 py-3 text-start text-xs font-medium text-ds-muted uppercase">{t(locale, "manage.price")}</th>
                <th className="px-4 py-3 text-start text-xs font-medium text-ds-muted uppercase">{t(locale, "manage.inventory")}</th>
                <th className="px-4 py-3 text-end text-xs font-medium text-ds-muted uppercase">{t(locale, "manage.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ds-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-ds-muted">
                    {t(locale, "manage.no_products")}
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-ds-accent/50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="rounded border-ds-border"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-ds-accent rounded-lg flex-shrink-0 overflow-hidden">
                          {product.thumbnail ? (
                            <img src={product.thumbnail} alt={product.title || "Product"} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-ds-muted text-xs">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-ds-text truncate">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={clsx("px-2 py-1 text-xs font-medium rounded-full", statusStyles[product.status])}>
                        {t(locale, `manage.${product.status}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ds-text">
                      {new Intl.NumberFormat(locale, { style: "currency", currency: product.currency || "USD" }).format(product.price / 100)}
                    </td>
                    <td className="px-4 py-3 text-sm text-ds-text">{product.inventory}</td>
                    <td className="px-4 py-3 text-end">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" className="p-1.5 text-ds-muted hover:text-ds-text hover:bg-ds-accent rounded transition-colors" title={t(locale, "manage.edit")}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button type="button" className="p-1.5 text-ds-muted hover:text-ds-destructive hover:bg-ds-destructive/10 rounded transition-colors" title={t(locale, "manage.delete")}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-ds-border text-xs text-ds-muted">
          {filtered.length} {t(locale, "manage.products").toLowerCase()}
        </div>
      </div>
    </div>
  )
}
