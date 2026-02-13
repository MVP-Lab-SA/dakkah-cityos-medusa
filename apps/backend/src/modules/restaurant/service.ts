import { MedusaService } from "@medusajs/framework/utils"
import Restaurant from "./models/restaurant"
import Menu from "./models/menu"
import MenuItem from "./models/menu-item"
import ModifierGroup from "./models/modifier-group"
import Modifier from "./models/modifier"
import TableReservation from "./models/table-reservation"
import KitchenOrder from "./models/kitchen-order"

class RestaurantModuleService extends MedusaService({
  Restaurant,
  Menu,
  MenuItem,
  ModifierGroup,
  Modifier,
  TableReservation,
  KitchenOrder,
}) {
  /**
   * Get menu items for a restaurant, optionally filtered by category.
   */
  async getMenuItems(restaurantId: string, category?: string): Promise<any[]> {
    const filters: any = { restaurant_id: restaurantId, is_available: true }
    if (category) {
      filters.category = category
    }
    const items = await this.listMenuItems(filters) as any
    return Array.isArray(items) ? items : [items].filter(Boolean)
  }

  /**
   * Place a kitchen order for a restaurant with the specified items.
   */
  async placeOrder(restaurantId: string, items: Array<{ menuItemId: string; quantity: number }>): Promise<any> {
    const restaurant = await this.retrieveRestaurant(restaurantId)
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`
    let totalAmount = 0
    for (const item of items) {
      const menuItem = await this.retrieveMenuItem(item.menuItemId)
      totalAmount += Number(menuItem.price || 0) * item.quantity
    }
    const order = await (this as any).createKitchenOrders({
      restaurant_id: restaurantId,
      order_number: orderNumber,
      status: "pending",
      total_amount: totalAmount,
      items: items,
      placed_at: new Date(),
    })
    return order
  }

  /**
   * Update the status of a kitchen order (e.g., preparing, ready, delivered).
   */
  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    const order = await this.retrieveKitchenOrder(orderId)
    const validTransitions: Record<string, string[]> = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["preparing", "cancelled"],
      preparing: ["ready"],
      ready: ["picked_up", "delivered"],
    }
    const allowed = validTransitions[order.status] || []
    if (!allowed.includes(status)) {
      throw new Error(`Cannot transition from ${order.status} to ${status}`)
    }
    return await (this as any).updateKitchenOrders({ id: orderId, status })
  }

  /**
   * Calculate delivery fee based on restaurant location and delivery address.
   */
  async calculateDeliveryFee(restaurantId: string, address: string): Promise<{ fee: number; estimatedMinutes: number }> {
    const restaurant = await this.retrieveRestaurant(restaurantId)
    const baseFee = Number(restaurant.delivery_fee || 5)
    const estimatedMinutes = 30
    return { fee: baseFee, estimatedMinutes }
  }
}

export default RestaurantModuleService
