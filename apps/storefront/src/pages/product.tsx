import ProductActions from "@/components/product-actions"
import { ImageGallery } from "@/components/ui/image-gallery"
import { retrieveProduct } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import { useQuery } from "@tanstack/react-query"
import { useLoaderData, useParams } from "@tanstack/react-router"

const LOCALE_TO_COUNTRY: Record<string, string> = {
  en: "us",
  fr: "fr",
  ar: "sa",
}

const ProductDetails = () => {
  const loaderData = useLoaderData({ strict: false }) as any
  const params = useParams({ strict: false }) as any
  const handle = params?.handle
  const locale = params?.locale || "en"
  const countryCode = LOCALE_TO_COUNTRY[locale?.toLowerCase()] || locale?.toLowerCase() || "us"

  const { data: region } = useQuery({
    queryKey: ["region", locale],
    queryFn: () => getRegion({ country_code: countryCode }),
    initialData: loaderData?.region || undefined,
    staleTime: Infinity,
  })

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", handle, region?.id],
    queryFn: () =>
      retrieveProduct({
        handle,
        region_id: region!.id,
      }),
    initialData: loaderData?.product || undefined,
    enabled: !!handle && !!region?.id,
    staleTime: 30000,
  })

  if (!product || isLoading) {
    return (
      <div className="content-container py-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-zinc-100 rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-zinc-100 rounded w-2/3" />
              <div className="h-4 bg-zinc-100 rounded w-full" />
              <div className="h-4 bg-zinc-100 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="content-container py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ImageGallery images={product.images || []} />
        </div>
        <div>
          <h1 className="text-2xl font-medium mb-2">{product.title}</h1>
          {product.description && (
            <p className="text-secondary-text mb-6">{product.description}</p>
          )}
          {region && <ProductActions product={product} region={region} />}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
