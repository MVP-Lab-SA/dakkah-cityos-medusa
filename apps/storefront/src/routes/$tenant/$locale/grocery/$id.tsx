import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/grocery/$id")({
  component: GroceryDetailPage,
})

function GroceryDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/grocery/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.grocery || data.product || data.item || data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [id])

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Product not found</p>
          <Link to={`/${tenant}/${locale}/grocery` as any} className="text-sm font-medium text-zinc-900 hover:underline">
            Back to grocery
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-zinc-900 text-white py-12">
        <div className="content-container">
          <Link to={`/${tenant}/${locale}/grocery` as any} className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6">
            ← Back to grocery
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{product.name || product.title}</h1>
            {(product.organic || product.is_organic) && (
              <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">Organic</span>
            )}
          </div>
          {product.category && <p className="text-zinc-300 mt-2">{product.category}</p>}
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {(product.photo || product.thumbnail || product.image) && (
              <div className="rounded-lg overflow-hidden bg-zinc-100 h-96">
                <img src={product.photo || product.thumbnail || product.image} alt={product.name || product.title} className="w-full h-full object-cover" />
              </div>
            )}
            {product.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Description</h2>
                <p className="text-zinc-600 leading-relaxed">{product.description}</p>
              </div>
            )}
            {product.nutrition && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Nutrition Info</h2>
                <p className="text-zinc-600 leading-relaxed">{product.nutrition}</p>
              </div>
            )}
          </div>
          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              <h3 className="font-semibold text-zinc-900 mb-4">Product Details</h3>
              <dl className="space-y-3">
                {product.price != null && (
                  <div>
                    <dt className="text-sm text-zinc-400">Price</dt>
                    <dd className="text-2xl font-bold text-zinc-900">${Number(product.price).toFixed(2)}</dd>
                  </div>
                )}
                {product.category && (
                  <div>
                    <dt className="text-sm text-zinc-400">Category</dt>
                    <dd className="text-zinc-900 font-medium">{product.category}</dd>
                  </div>
                )}
                {product.unit && (
                  <div>
                    <dt className="text-sm text-zinc-400">Unit</dt>
                    <dd className="text-zinc-900 font-medium">{product.unit}</dd>
                  </div>
                )}
                {product.origin && (
                  <div>
                    <dt className="text-sm text-zinc-400">Origin</dt>
                    <dd className="text-zinc-900 font-medium">{product.origin}</dd>
                  </div>
                )}
              </dl>
              <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors mt-6">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
