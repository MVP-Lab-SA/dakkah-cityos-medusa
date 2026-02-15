import React, { useState, useEffect } from "react"

interface CompareItem {
  productId: string
  productTitle: string
  addedAt: number
  thumbnail?: string
  price?: number
  rating?: number
  description?: string
  availability?: string
}

const COMPARE_KEY = "dakkah_compare"
const MAX_PRODUCTS = 4

function getCompareList(): CompareItem[] {
  try {
    const raw = localStorage.getItem(COMPARE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCompareList(items: CompareItem[]) {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(items))
  window.dispatchEvent(new CustomEvent("compare-updated", { detail: items }))
}

const comparisonRows = [
  { key: "image", label: "Image" },
  { key: "title", label: "Title" },
  { key: "price", label: "Price" },
  { key: "rating", label: "Rating" },
  { key: "description", label: "Description" },
  { key: "availability", label: "Availability" },
  { key: "actions", label: "" },
] as const

export function ComparePageContent() {
  const [products, setProducts] = useState<CompareItem[]>([])

  useEffect(() => {
    setProducts(getCompareList())
    const handler = () => setProducts(getCompareList())
    window.addEventListener("compare-updated", handler)
    return () => window.removeEventListener("compare-updated", handler)
  }, [])

  const removeProduct = (productId: string) => {
    const updated = products.filter((p) => p.productId !== productId)
    saveCompareList(updated)
    setProducts(updated)
  }

  const handleAddToCart = (_product: CompareItem) => {
  }

  const getValuesDiffer = (key: string): boolean => {
    if (products.length < 2) return false
    const values = products.map((p) => {
      switch (key) {
        case "price":
          return p.price
        case "rating":
          return p.rating
        case "availability":
          return p.availability
        default:
          return null
      }
    })
    return new Set(values.map(String)).size > 1
  }

  if (products.length === 0) {
    return (
      <div className="bg-ds-card rounded-lg border border-ds-border p-12 text-center">
        <span className="text-4xl block mb-4">⚖️</span>
        <h3 className="text-lg font-semibold text-ds-foreground mb-2">
          No products to compare
        </h3>
        <p className="text-sm text-ds-muted-foreground mb-6">
          Add products from the product pages to start comparing
        </p>
        <button
          type="button"
          className="px-6 py-2.5 rounded-lg bg-ds-primary text-ds-primary-foreground text-sm font-semibold hover:bg-ds-primary/90 transition-colors"
        >
          Browse Products
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ds-muted-foreground">
          Comparing {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => {
            saveCompareList([])
            setProducts([])
          }}
          className="text-sm text-ds-destructive hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full min-w-[600px] border-collapse">
          <tbody>
            {comparisonRows.map((row) => {
              const isDifferent = getValuesDiffer(row.key)
              return (
                <tr
                  key={row.key}
                  className={`border-b border-ds-border ${
                    isDifferent ? "bg-ds-primary/5" : ""
                  }`}
                >
                  <td className="p-4 text-sm font-medium text-ds-muted-foreground w-32 align-top">
                    {row.label}
                  </td>
                  {products.map((product) => (
                    <td
                      key={product.productId}
                      className="p-4 text-center align-top"
                    >
                      {row.key === "image" && (
                        <div className="relative inline-block">
                          <div className="w-32 h-32 mx-auto bg-ds-muted rounded-lg overflow-hidden flex items-center justify-center">
                            {product.thumbnail ? (
                              <img
                                src={product.thumbnail}
                                alt={product.productTitle}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <svg className="w-10 h-10 text-ds-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <button
                            onClick={() => removeProduct(product.productId)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-ds-destructive text-white text-xs flex items-center justify-center hover:opacity-80"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                      {row.key === "title" && (
                        <span className="text-sm font-semibold text-ds-foreground">
                          {product.productTitle}
                        </span>
                      )}
                      {row.key === "price" && (
                        <span
                          className={`text-sm font-medium ${
                            isDifferent
                              ? "text-ds-primary font-bold"
                              : "text-ds-foreground"
                          }`}
                        >
                          {product.price != null
                            ? `$${product.price.toFixed(2)}`
                            : "—"}
                        </span>
                      )}
                      {row.key === "rating" && (
                        <div className="flex items-center justify-center gap-1">
                          {product.rating != null ? (
                            <>
                              <span className="text-sm text-ds-foreground">
                                {product.rating.toFixed(1)}
                              </span>
                              <svg className="w-4 h-4 text-ds-warning" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </>
                          ) : (
                            <span className="text-sm text-ds-muted-foreground">—</span>
                          )}
                        </div>
                      )}
                      {row.key === "description" && (
                        <p className="text-xs text-ds-muted-foreground text-left line-clamp-3">
                          {product.description || "No description available"}
                        </p>
                      )}
                      {row.key === "availability" && (
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            product.availability === "In Stock"
                              ? "bg-ds-success/15 text-ds-success"
                              : product.availability === "Out of Stock"
                              ? "bg-ds-destructive/15 text-ds-destructive"
                              : "bg-ds-muted text-ds-muted-foreground"
                          }`}
                        >
                          {product.availability || "Unknown"}
                        </span>
                      )}
                      {row.key === "actions" && (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="px-4 py-2 text-sm font-medium rounded-lg bg-ds-primary text-ds-primary-foreground hover:bg-ds-primary/90 transition-colors"
                        >
                          Add to Cart
                        </button>
                      )}
                    </td>
                  ))}
                  {products.length < MAX_PRODUCTS && (
                    <td className="p-4 text-center align-middle">
                      {row.key === "image" && (
                        <div className="w-32 h-32 mx-auto border-2 border-dashed border-ds-border rounded-lg flex items-center justify-center">
                          <svg className="h-8 w-8 text-ds-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
