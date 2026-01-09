import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const context = (req as any).cityosContext

  if (!context?.vendorId) {
    return res.status(403).json({ message: "Vendor context required" })
  }

  const { limit = 20, offset = 0, status } = req.query

  // Query orders that contain items from this vendor
  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "status",
      "created_at",
      "total",
      "currency_code",
      "customer_id",
      "email",
      "items.*",
      "items.variant.*",
      "items.variant.product.*",
      "items.variant.product.metadata",
      "shipping_address.*",
    ],
    filters: status ? { status } : {},
    pagination: {
      skip: Number(offset),
      take: Number(limit),
    },
  })

  // Filter orders that have items from this vendor
  const vendorOrders = orders
    .map((order: any) => {
      const vendorItems = order.items?.filter(
        (item: any) => item.variant?.product?.metadata?.vendor_id === context.vendorId
      )

      if (!vendorItems || vendorItems.length === 0) return null

      return {
        ...order,
        items: vendorItems,
        vendor_total: vendorItems.reduce((sum: number, item: any) => sum + (item.subtotal || 0), 0),
      }
    })
    .filter(Boolean)

  return res.json({
    orders: vendorOrders,
    count: vendorOrders.length,
    limit: Number(limit),
    offset: Number(offset),
  })
}
