import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { ReturnForm } from "@/components/orders/return-form"
import { ArrowLeft } from "@medusajs/icons"

export const Route = createFileRoute("/$countryCode/account/orders/$id/return")({
  component: ReturnRequestPage,
})

function ReturnRequestPage() {
  const { countryCode, id } = Route.useParams()
  const navigate = useNavigate()

  // Mock order items - would come from API
  const orderItems = [
    {
      id: "item_1",
      title: "Premium Cotton T-Shirt",
      thumbnail: undefined,
      quantity: 2,
      maxQuantity: 2,
    },
    {
      id: "item_2",
      title: "Classic Denim Jeans",
      thumbnail: undefined,
      quantity: 1,
      maxQuantity: 1,
    },
    {
      id: "item_3",
      title: "Leather Belt",
      thumbnail: undefined,
      quantity: 1,
      maxQuantity: 1,
    },
  ]

  const handleSubmit = async (data: { items: Array<{ id: string; quantity: number; reason: string }> }) => {
    console.log("Return request submitted:", data)
    // Would call API to submit return request
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const handleCancel = () => {
    navigate({ to: `/${countryCode}/account/orders/${id}` })
  }

  return (
    <AccountLayout>
      <div className="max-w-2xl">
        {/* Back Link */}
        <Link
          to={`/${countryCode}/account/orders/${id}` as any}
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Order Details
        </Link>

        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Request a Return</h1>
        <p className="text-zinc-600 mb-6">
          Select the items you'd like to return and tell us why.
        </p>

        <ReturnForm
          orderId={id}
          items={orderItems}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />

        {/* Return Policy */}
        <div className="mt-6 bg-zinc-50 rounded-xl p-6">
          <h3 className="font-semibold text-zinc-900 mb-2">Return Policy</h3>
          <ul className="text-sm text-zinc-600 space-y-2">
            <li>Items must be returned within 30 days of delivery</li>
            <li>Items must be unworn, unwashed, and in original condition</li>
            <li>Original tags must be attached</li>
            <li>Refunds are processed within 5-7 business days after we receive your return</li>
          </ul>
        </div>
      </div>
    </AccountLayout>
  )
}
