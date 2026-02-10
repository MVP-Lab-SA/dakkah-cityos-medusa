import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/lib/hooks/use-products"
import { useRegion } from "@/lib/hooks/use-regions"
import { useLoaderData, useParams } from "@tanstack/react-router"

const LOCALE_TO_COUNTRY: Record<string, string> = {
  en: "us",
  fr: "fr",
  ar: "sa",
}

const Store = () => {
  const loaderData = useLoaderData({ strict: false }) as any
  const { locale } = useParams({ strict: false }) as { locale: string }

  const countryCode = LOCALE_TO_COUNTRY[locale?.toLowerCase()] || locale?.toLowerCase() || "us"
  const { data: fetchedRegion } = useRegion({ country_code: countryCode })
  const region = loaderData?.region || fetchedRegion

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useProducts({
    region_id: region?.id,
    query_params: { limit: 12 },
  })

  const products = data?.pages.flatMap((page) => page.products) || []

  if (!region) {
    return (
      <div className="content-container py-6">
        <h1 className="text-xl mb-6">All Products</h1>
        <div className="text-zinc-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="content-container py-6">
      <h1 className="text-xl mb-6">All Products</h1>

      {isFetching && products.length === 0 ? (
        <div className="text-zinc-600">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-zinc-600">No products found</div>
      ) : (
        <>
          {/* Product grid - minimal styling, AI agent will customize */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load more pattern */}
          {hasNextPage && (
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant="secondary"
              className="mt-6"
            >
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </Button>
          )}
        </>
      )}
    </div>
  )
}

export default Store
