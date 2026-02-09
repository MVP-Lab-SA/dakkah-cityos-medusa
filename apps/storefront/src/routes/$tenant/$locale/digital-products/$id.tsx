import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/digital-products/$id")({
  component: DigitalProductDetailPage,
})

function DigitalProductDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/digital-products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.digital_product || data.item || data)
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
          <p className="text-zinc-500 mb-4">Digital product not found</p>
          <Link
            to={`/${tenant}/${locale}/digital-products` as any}
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            Back to digital products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-zinc-900 text-white py-12">
        <div className="content-container">
          <Link
            to={`/${tenant}/${locale}/digital-products` as any}
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6"
          >
            ← Back to digital products
          </Link>
          <h1 className="text-3xl font-bold">{product.title || product.name}</h1>
          <div className="flex items-center gap-3 mt-3">
            {(product.type || product.product_type) && (
              <span className="text-sm bg-zinc-800 text-zinc-300 px-3 py-1 rounded capitalize">
                {product.type || product.product_type}
              </span>
            )}
            {product.file_format && (
              <span className="text-sm text-zinc-400 uppercase">{product.file_format}</span>
            )}
          </div>
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {(product.thumbnail || product.image || product.cover) && (
              <div className="rounded-lg overflow-hidden bg-zinc-100 h-96">
                <img
                  src={product.thumbnail || product.image || product.cover}
                  alt={product.title || product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {product.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Description</h2>
                <p className="text-zinc-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {product.contents && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">What's Included</h2>
                <ul className="list-disc list-inside text-zinc-600 space-y-1">
                  {(Array.isArray(product.contents) ? product.contents : [product.contents]).map((c: any, i: number) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.requirements && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Requirements</h2>
                <p className="text-zinc-600 leading-relaxed">{product.requirements}</p>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              {product.price != null && (
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-zinc-900">
                    ${Number(product.price).toLocaleString()}
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">One-time purchase</p>
                </div>
              )}

              <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors">
                Buy Now
              </button>

              <div className="mt-6 pt-4 border-t border-zinc-100 space-y-3 text-sm">
                {product.file_format && (
                  <div className="flex justify-between text-zinc-600">
                    <span>Format</span>
                    <span className="font-medium uppercase">{product.file_format}</span>
                  </div>
                )}
                {product.file_size && (
                  <div className="flex justify-between text-zinc-600">
                    <span>File size</span>
                    <span className="font-medium">{product.file_size}</span>
                  </div>
                )}
                {(product.type || product.product_type) && (
                  <div className="flex justify-between text-zinc-600">
                    <span>Type</span>
                    <span className="font-medium capitalize">{product.type || product.product_type}</span>
                  </div>
                )}
              </div>

              {product.author && (
                <div className="mt-4 pt-4 border-t border-zinc-100">
                  <p className="text-sm text-zinc-400">Created by</p>
                  <p className="font-medium text-zinc-900">{product.author.name || product.author}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
