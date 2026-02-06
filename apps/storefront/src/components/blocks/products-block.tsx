import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/utils/query-keys'
import { getUnifiedClient } from '@/lib/api/unified-client'
import { ProductCard } from '../product-card'

interface ProductsBlockProps {
  title?: string
  description?: string
  productSelection?: 'latest' | 'featured' | 'specific'
  products?: string[]
  limit?: number
  category?: string
  vendor?: string
}

export const ProductsBlock: React.FC<ProductsBlockProps> = ({
  title,
  description,
  productSelection = 'latest',
  products: productIds,
  limit = 8,
  category,
  vendor,
}) => {
  const { data: productsData, isLoading } = useQuery({
    queryKey: queryKeys.products.list(
      productSelection,
      productIds,
      limit,
      category,
      vendor
    ),
    queryFn: async () => {
      const filters: any = {}

      if (productSelection === 'specific' && productIds) {
        filters.id = productIds
      }

      if (category) {
        filters.category_id = category
      }

      if (vendor) {
        filters['metadata.vendor_id'] = vendor
      }

      const client = getUnifiedClient()
      return client.getMedusaProducts({
        ...filters,
        limit,
      })
    },
  })

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {productsData?.products?.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
