import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/financial-products/$id")({
  component: FinancialProductDetailPage,
})

function FinancialProductDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/financial-products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.financial_product || data.product || data.item || data)
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
          <p className="text-zinc-500 mb-4">Financial product not found</p>
          <Link to={`/${tenant}/${locale}/financial-products` as any} className="text-sm font-medium text-zinc-900 hover:underline">
            Back to financial products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-zinc-900 text-white py-12">
        <div className="content-container">
          <Link to={`/${tenant}/${locale}/financial-products` as any} className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6">
            ← Back to financial products
          </Link>
          <h1 className="text-3xl font-bold">{product.name || product.title}</h1>
          {product.type && <span className="inline-block mt-3 text-sm bg-white/10 px-3 py-1 rounded">{product.type}</span>}
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {product.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Overview</h2>
                <p className="text-zinc-600 leading-relaxed">{product.description}</p>
              </div>
            )}
            {product.features && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Features</h2>
                <p className="text-zinc-600 leading-relaxed">{product.features}</p>
              </div>
            )}
          </div>
          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              <h3 className="font-semibold text-zinc-900 mb-4">Product Details</h3>
              <dl className="space-y-3">
                {product.type && (
                  <div>
                    <dt className="text-sm text-zinc-400">Type</dt>
                    <dd className="text-zinc-900 font-medium">{product.type}</dd>
                  </div>
                )}
                {(product.rate != null || product.interest_rate != null) && (
                  <div>
                    <dt className="text-sm text-zinc-400">Interest Rate</dt>
                    <dd className="text-2xl font-bold text-zinc-900">{Number(product.rate || product.interest_rate).toFixed(2)}%</dd>
                  </div>
                )}
                {product.terms && (
                  <div>
                    <dt className="text-sm text-zinc-400">Terms</dt>
                    <dd className="text-zinc-900 font-medium">{product.terms}</dd>
                  </div>
                )}
                {product.min_amount != null && (
                  <div>
                    <dt className="text-sm text-zinc-400">Minimum Amount</dt>
                    <dd className="text-zinc-900 font-medium">${Number(product.min_amount).toLocaleString()}</dd>
                  </div>
                )}
                {product.max_amount != null && (
                  <div>
                    <dt className="text-sm text-zinc-400">Maximum Amount</dt>
                    <dd className="text-zinc-900 font-medium">${Number(product.max_amount).toLocaleString()}</dd>
                  </div>
                )}
              </dl>
              <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors mt-6">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
