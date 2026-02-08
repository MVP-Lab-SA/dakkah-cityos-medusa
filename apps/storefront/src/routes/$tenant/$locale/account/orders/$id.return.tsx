import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { ReturnForm } from "@/components/orders/return-form"
import { ArrowLeft, Spinner } from "@medusajs/icons"
import { useOrder } from "@/lib/hooks/use-orders"
import { sdk } from "@/lib/utils/sdk"
import { useMutation } from "@tanstack/react-query"

export const Route = createFileRoute("/$tenant/$locale/account/orders/$id/return")({
  component: ReturnRequestPage,
})

function ReturnRequestPage() {
  const { tenant, locale, id } = Route.useParams()
  const navigate = useNavigate()

  // Fetch real order data
  const { data: orderData, isLoading } = useOrder({ 
    order_id: id, 
    fields: "+items,+items.variant,+items.variant.product" 
  })

  const order = (orderData as any)?.order || orderData

  // Transform order items for the return form
  const orderItems = (order?.items || []).map((item: any) => ({
    id: item.id,
    title: item.title || item.variant?.product?.title || "Unknown Product",
    thumbnail: item.thumbnail || item.variant?.product?.thumbnail,
    quantity: item.quantity,
    maxQuantity: item.quantity, // Can return up to what was purchased
  }))

  // Return request mutation
  const submitReturnMutation = useMutation({
    mutationFn: async (data: { items: Array<{ id: string; quantity: number; reason: string }> }) => {
      const response = await sdk.client.fetch(`/store/orders/${id}/returns`, {
        method: "POST",
        body: {
          items: data.items.map(item => ({
            item_id: item.id,
            quantity: item.quantity,
            reason: item.reason,
          })),
        },
      })
      return response
    },
    onSuccess: () => {
      alert("Return request submitted successfully")
      navigate({ to: `/${tenant}/${locale}/account/orders/${id}` as any })
    },
    onError: (error: any) => {
      alert(error.message || "Failed to submit return request")
    },
  })

  const handleSubmit = async (data: { items: Array<{ id: string; quantity: number; reason: string }> }) => {
    await submitReturnMutation.mutateAsync(data)
  }

  if (isLoading) {
    return (
      <AccountLayout>
        <div className="flex items-center justify-center py-12">
          <Spinner className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      </AccountLayout>
    )
  }

  if (!order) {
    return (
      <AccountLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Order not found</h1>
          <Link to={`/${tenant}/${locale}/account/orders` as any} className="text-blue-600 hover:underline">
            View all orders
          </Link>
        </div>
      </AccountLayout>
    )
  }

  const handleCancel = () => {
    navigate({ to: `/${tenant}/${locale}/account/orders/${id}` })
  }

  return (
    <AccountLayout>
      <div className="max-w-2xl">
        {/* Back Link */}
        <Link
          to={`/${tenant}/${locale}/account/orders/${id}` as any}
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
