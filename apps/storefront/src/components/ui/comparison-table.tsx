"use client"

import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { clsx } from "clsx"

export interface ComparisonProduct {
  id: string
  title: string
  thumbnail?: string
  price: { amount: number; currencyCode: string }
  features: Record<string, string | boolean>
}

export interface ComparisonTableProps {
  products: ComparisonProduct[]
  featureLabels: { key: string; label: string }[]
  onRemoveProduct?: (id: string) => void
  onAddProduct?: () => void
  maxProducts?: number
  locale: string
}

export function ComparisonTable({
  products,
  featureLabels,
  onRemoveProduct,
  onAddProduct,
  maxProducts = 4,
  locale,
}: ComparisonTableProps) {
  const emptySlots = Math.max(0, maxProducts - products.length)

  const formatPrice = (amount: number, currencyCode: string) =>
    formatCurrency(amount / 100, currencyCode, locale as SupportedLocale)

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse">
        <thead className="sticky top-0 z-10 bg-ds-background">
          <tr>
            <th className="text-start ps-4 pe-4 py-4 border-b border-ds-border w-48">
              <span className="sr-only">{t(locale, "comparison.feature")}</span>
            </th>
            {products.map((product) => (
              <th
                key={product.id}
                className="text-center px-4 py-4 border-b border-ds-border min-w-[160px]"
              >
                <div className="flex flex-col items-center gap-2">
                  {product.thumbnail ? (
                    <div className="w-20 h-20 bg-ds-muted overflow-hidden rounded">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-ds-muted rounded" />
                  )}
                  <span className="text-sm font-semibold text-ds-foreground line-clamp-2">
                    {product.title}
                  </span>
                  <span className="text-sm font-medium text-ds-muted-foreground">
                    {formatPrice(product.price.amount, product.price.currencyCode)}
                  </span>
                  {onRemoveProduct && (
                    <button
                      onClick={() => onRemoveProduct(product.id)}
                      className="text-xs text-ds-muted-foreground hover:text-ds-foreground transition-colors underline"
                      aria-label={`${t(locale, "comparison.remove")} ${product.title}`}
                    >
                      {t(locale, "comparison.remove")}
                    </button>
                  )}
                </div>
              </th>
            ))}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <th
                key={`empty-${i}`}
                className="text-center px-4 py-4 border-b border-ds-border min-w-[160px]"
              >
                {onAddProduct && (
                  <button
                    onClick={onAddProduct}
                    className="flex flex-col items-center gap-2 w-full py-4 text-ds-muted-foreground hover:text-ds-foreground transition-colors"
                  >
                    <div className="w-20 h-20 border-2 border-dashed border-ds-border rounded flex items-center justify-center">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 5V19M5 12H19"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">
                      {t(locale, "comparison.addProduct")}
                    </span>
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {featureLabels.map((feature, index) => (
            <tr
              key={feature.key}
              className={clsx(
                index % 2 === 0 ? "bg-ds-background" : "bg-ds-muted/50"
              )}
            >
              <td className="text-start ps-4 pe-4 py-3 text-sm font-medium text-ds-foreground border-b border-ds-border">
                {feature.label}
              </td>
              {products.map((product) => {
                const value = product.features[feature.key]
                return (
                  <td
                    key={product.id}
                    className="text-center px-4 py-3 text-sm text-ds-muted-foreground border-b border-ds-border"
                  >
                    {typeof value === "boolean" ? (
                      value ? (
                        <svg
                          className="w-5 h-5 mx-auto text-ds-success"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M5 10L8.5 13.5L15 6.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 mx-auto text-ds-muted-foreground"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M6 6L14 14M14 6L6 14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      )
                    ) : (
                      <span>{value ?? "—"}</span>
                    )}
                  </td>
                )
              })}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <td
                  key={`empty-${i}`}
                  className="text-center px-4 py-3 border-b border-ds-border"
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
