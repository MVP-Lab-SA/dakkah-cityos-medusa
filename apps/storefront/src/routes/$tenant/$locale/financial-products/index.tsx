import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/financial-products/")({
  component: FinancialProductsPage,
})

function FinancialProductsPage() {
  const { tenant, locale } = Route.useParams()
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/financial-products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.financial_products || data.products || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Financial Products</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Explore loans, savings accounts, investment options, and insurance products tailored to your financial goals.
          </p>
        </div>
      </section>

      <div className="content-container py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-zinc-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
            </div>
            <p className="text-zinc-500">No financial products available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/${tenant}/${locale}/financial-products/${product.id}` as any}
                className="bg-white rounded-lg border border-zinc-200 p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-zinc-900 text-lg mb-2">{product.name || product.title}</h3>
                {product.type && (
                  <span className="inline-block text-xs font-medium bg-zinc-100 text-zinc-600 px-2 py-1 rounded mb-3">
                    {product.type}
                  </span>
                )}
                <div className="mt-3 space-y-2">
                  {(product.rate != null || product.interest_rate != null) && (
                    <div className="flex justify-between">
                      <span className="text-sm text-zinc-400">Rate</span>
                      <span className="font-bold text-zinc-900">{Number(product.rate || product.interest_rate).toFixed(2)}%</span>
                    </div>
                  )}
                  {product.terms && (
                    <div className="flex justify-between">
                      <span className="text-sm text-zinc-400">Terms</span>
                      <span className="text-sm text-zinc-700">{product.terms}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
