import { createFileRoute } from "@tanstack/react-router"
import { VendorProductForm } from "@/components/vendor/vendor-product-form"

export const Route = createFileRoute("/$tenant/$locale/vendor/products/new")({
  component: NewProductRoute,
})

function NewProductRoute() {
  return (
    <div className="container mx-auto py-12">
      <VendorProductForm mode="create" />
    </div>
  )
}
