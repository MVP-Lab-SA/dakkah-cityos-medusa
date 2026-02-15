import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { t } from "@/lib/i18n"
import { Thumbnail } from "@/components/ui/thumbnail"

export const Route = createFileRoute("/$tenant/$locale/compare")({
  component: ComparePage,
  head: () => ({
    meta: [
      { title: "Compare Products | Dakkah CityOS" },
      { name: "description", content: "Compare products on Dakkah CityOS" },
    ],
  }),
})

interface CompareProduct {
  id: string
  title: string
  thumbnail?: string
  price?: string
  features: Record<string, string | boolean>
}

const MAX_PRODUCTS = 4

function ComparePage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [products, setProducts] = useState<CompareProduct[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const allFeatureKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.features)))
  )

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-ds-muted flex items-center justify-center">
        <p className="text-sm text-ds-muted-foreground">{t(locale, "common.loading")}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ds-muted">
      <div className="bg-ds-background border-b border-ds-border">
        <div className="content-container py-8">
          <h1 className="text-3xl font-bold text-ds-foreground">
            {t(locale, "blocks.compare")}
          </h1>
          <p className="text-ds-muted-foreground mt-1">
            Compare up to {MAX_PRODUCTS} products side by side
          </p>
        </div>
      </div>

      <div className="content-container py-8">
        {products.length === 0 ? (
          <div className="bg-ds-background rounded-lg border border-ds-border p-12 text-center">
            <span className="text-4xl block mb-4">⚖️</span>
            <p className="text-ds-muted-foreground mb-2">
              No products to compare yet
            </p>
            <p className="text-sm text-ds-muted-foreground">
              Add products from the product pages to start comparing
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-start text-sm font-medium text-ds-muted-foreground bg-ds-muted rounded-tl-lg w-48">
                    {t(locale, "blocks.feature")}
                  </th>
                  {products.map((product) => (
                    <th
                      key={product.id}
                      className="p-4 bg-ds-muted text-center"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 bg-ds-background rounded-lg overflow-hidden">
                          <Thumbnail
                            thumbnail={product.thumbnail || null}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-sm font-semibold text-ds-foreground line-clamp-2">
                          {product.title}
                        </h3>
                        {product.price && (
                          <p className="text-sm font-medium text-ds-primary">
                            {product.price}
                          </p>
                        )}
                        <button
                          onClick={() => removeProduct(product.id)}
                          className="text-xs text-ds-destructive hover:underline"
                        >
                          {t(locale, "cart.remove")}
                        </button>
                      </div>
                    </th>
                  ))}
                  {products.length < MAX_PRODUCTS && (
                    <th className="p-4 bg-ds-muted rounded-tr-lg">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 border-2 border-dashed border-ds-border rounded-lg flex items-center justify-center">
                          <svg className="h-8 w-8 text-ds-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <span className="text-xs text-ds-muted-foreground">
                          Add Product
                        </span>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {allFeatureKeys.map((key, idx) => (
                  <tr
                    key={key}
                    className={idx % 2 === 0 ? "bg-ds-background" : "bg-ds-muted/50"}
                  >
                    <td className="p-4 text-sm font-medium text-ds-foreground border-e border-ds-border">
                      {key}
                    </td>
                    {products.map((product) => {
                      const value = product.features[key]
                      return (
                        <td key={product.id} className="p-4 text-center text-sm text-ds-foreground">
                          {typeof value === "boolean" ? (
                            value ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 bg-ds-success/20 text-ds-success rounded-full">
                                ✓
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-6 h-6 bg-ds-destructive/20 text-ds-destructive rounded-full">
                                ✕
                              </span>
                            )
                          ) : (
                            value || "—"
                          )}
                        </td>
                      )
                    })}
                    {products.length < MAX_PRODUCTS && <td className="p-4" />}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
