import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const context = (req as any).cityosContext
  const { id: orderId } = req.params
  const { items } = req.body as { items?: Array<{ id: string; quantity: number }> }

  if (!context?.vendorId) {
    return res.status(403).json({ message: "Vendor context required" })
  }

  // Verify vendor owns the items
  const query = req.scope.resolve("query")
  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "items.*",
      "items.variant.*",
      "items.variant.product.*",
      "items.variant.product.metadata",
    ],
    filters: { id: orderId },
  })

  if (!orders || orders.length === 0) {
    return res.status(404).json({ message: "Order not found" })
  }

  const order = orders[0]
  const vendorItems = order.items?.filter(
    (item: any) => item.variant?.product?.metadata?.vendor_id === context.vendorId
  )

  if (!vendorItems || vendorItems.length === 0) {
    return res.status(403).json({ message: "No items from this vendor in order" })
  }

  // Import workflow
  const { createOrderFulfillmentWorkflow } = await import("@medusajs/medusa/core-flows")

  const { result } = await createOrderFulfillmentWorkflow(req.scope).run({
    input: {
      order_id: orderId,
      items: items || vendorItems.map((item: any) => ({ id: item.id, quantity: item.quantity })),
      no_notification: (req.body as any)?.no_notification || false,
    },
  })

  return res.json({ fulfillment: result })
}
