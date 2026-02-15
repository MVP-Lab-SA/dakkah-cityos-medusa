import { createFileRoute, notFound } from "@tanstack/react-router"
import OrderConfirmationPage from "@/pages/order-confirmation"
import { retrieveOrder } from "@/lib/data/order"
import { queryKeys } from "@/lib/utils/query-keys"

export const Route = createFileRoute("/$tenant/$locale/order/$orderId/confirmed")({
  loader: async ({ params, context }) => {
    const { locale, orderId } = params
    if (typeof window === "undefined") return { locale, order: null }
    try {
      const { queryClient } = context

      const order = await queryClient.ensureQueryData({
        queryKey: queryKeys.orders.detail(orderId),
        queryFn: () => retrieveOrder({ 
          order_id: orderId,
          fields: "id, display_id, created_at, currency_code, status, email, *items, *shipping_address, *billing_address, *shipping_methods, *payment_collections.payment_sessions, subtotal, shipping_total, discount_total, tax_total, total"
        }),
      })

      if (!order) {
        throw notFound()
      }

      return {
        locale,
        order,
      }
    } catch {
      return { locale, order: null }
    }
  },
  component: OrderConfirmationPage,
  head: () => ({
    meta: [
      { title: "Order Confirmed | Dakkah CityOS" },
      { name: "description", content: "Your order has been confirmed on Dakkah CityOS" },
    ],
  }),
})