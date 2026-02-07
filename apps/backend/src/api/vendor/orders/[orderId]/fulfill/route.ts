import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// POST /vendor/orders/:orderId/fulfill - Mark order as fulfilled/shipped
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const vendorId = (req as any).vendor_id
  if (!vendorId) {
    return res.status(401).json({ message: "Vendor authentication required" })
  }

  const { orderId } = req.params
  const { tracking_number, carrier, items } = req.body as any

  const vendorModule = req.scope.resolve("vendor")
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  // Verify ownership
  const { data: vendorOrders } = await query.graph({
    entity: "vendor_order",
    fields: ["id", "vendor_id", "status", "order_id"],
    filters: {
      id: orderId,
      vendor_id: vendorId,
    },
  })

  if (!vendorOrders.length) {
    return res.status(404).json({ message: "Order not found" })
  }

  const vo = vendorOrders[0]

  if (vo.status === "shipped" || vo.status === "delivered") {
    return res.status(400).json({ message: "Order already fulfilled" })
  }

  try {
    // Update vendor order status
    await vendorModule.updateVendorOrders(orderId, {
      status: "shipped",
      shipped_at: new Date(),
      tracking_number,
      carrier,
    })

    // Emit event for notifications
    const eventBus = req.scope.resolve("event_bus")
    await eventBus.emit("vendor_order.shipped", {
      vendor_order_id: orderId,
      order_id: vo.order_id,
      tracking_number,
      carrier,
    })

    res.json({ 
      success: true,
      message: "Order marked as shipped",
    })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
