import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { VendorProductForm } from "@/components/vendor/vendor-product-form"

export const Route = createFileRoute("/$tenant/$locale/vendor/products/$productId")({
  component: EditProductRoute,
})

function EditProductRoute() {
  const { productId } = Route.useParams()

  const { data, isLoading } = useQuery({
    queryKey: ["vendor-product", productId],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ product: Record<string, unknown> }>(
        `/vendor/products/${productId}`,
        { credentials: "include" }
      )
      return response.product
    },
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
          <div className="border rounded-lg p-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <VendorProductForm
        mode="edit"
        initialData={data as Parameters<typeof VendorProductForm>[0]["initialData"]}
      />
    </div>
  )
}
