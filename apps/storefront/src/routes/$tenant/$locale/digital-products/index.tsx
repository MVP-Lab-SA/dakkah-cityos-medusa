import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/digital-products/")({
  component: DigitalProductsPage,
})

function DigitalProductsPage() {
  const { tenant, locale } = Route.useParams()
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/digital-products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.digital_products || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Digital Products</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Discover premium digital assets including ebooks, online courses, software, templates, and more. Instant download after purchase.
          </p>
        </div>
      </section>

      <div className="content-container py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-zinc-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <p className="text-zinc-500">No digital products available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <DigitalProductCard key={product.id} product={product} tenant={tenant} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function DigitalProductCard({ product, tenant, locale }: { product: any; tenant: string; locale: string }) {
  const typeColors: Record<string, string> = {
    ebook: "bg-blue-100 text-blue-700",
    course: "bg-purple-100 text-purple-700",
    software: "bg-green-100 text-green-700",
    template: "bg-amber-100 text-amber-700",
  }

  const productType = (product.type || product.product_type || "").toLowerCase()
  const badgeColor = typeColors[productType] || "bg-zinc-100 text-zinc-600"

  return (
    <Link
      to={`/${tenant}/${locale}/digital-products/${product.id}` as any}
      className="bg-white rounded-lg border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-48 bg-zinc-100 relative">
        {(product.thumbnail || product.image || product.cover) ? (
          <img
            src={product.thumbnail || product.image || product.cover}
            alt={product.title || product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
        )}
        {(product.type || product.product_type) && (
          <span className={`absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded capitalize ${badgeColor}`}>
            {product.type || product.product_type}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-zinc-900 text-lg">{product.title || product.name}</h3>
        {product.file_format && (
          <p className="text-xs text-zinc-400 mt-1 uppercase">{product.file_format}</p>
        )}
        {product.price != null && (
          <div className="mt-3">
            <span className="text-lg font-bold text-zinc-900">
              ${Number(product.price).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
