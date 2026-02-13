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

  async createReservation(restaurantId: string, data: {
    customerId: string
    partySize: number
    date: Date
    time: string
    specialRequests?: string
  }): Promise<any> {
    if (!data.customerId || !data.partySize || !data.date) {
      throw new Error("Customer ID, party size, and date are required")
    }

    if (data.partySize <= 0 || data.partySize > 50) {
      throw new Error("Party size must be between 1 and 50")
    }

    if (new Date(data.date) < new Date()) {
      throw new Error("Reservation date must be in the future")
    }

    const restaurant = await this.retrieveRestaurant(restaurantId) as any
    const existingReservations = await this.listTableReservations({
      restaurant_id: restaurantId,
      status: ["confirmed", "pending"],
    }) as any
    const resList = Array.isArray(existingReservations) ? existingReservations : [existingReservations].filter(Boolean)
    const targetDate = new Date(data.date).toDateString()
    const sameDateReservations = resList.filter((r: any) => new Date(r.reservation_date).toDateString() === targetDate)
    const totalSeats = sameDateReservations.reduce((sum: number, r: any) => sum + Number(r.party_size || 0), 0)
    const maxCapacity = Number(restaurant.seating_capacity || 100)

    if (totalSeats + data.partySize > maxCapacity) {
      throw new Error("Restaurant is at full capacity for this date")
    }

    const reservation = await (this as any).createTableReservations({
      restaurant_id: restaurantId,
      customer_id: data.customerId,
      party_size: data.partySize,
      reservation_date: data.date,
      reservation_time: data.time,
      special_requests: data.specialRequests || null,
      status: "confirmed",
      created_at: new Date(),
    })

    return reservation
  }

  async updateMenuPricing(menuItemId: string, newPrice: number): Promise<any> {
    if (newPrice <= 0) {
      throw new Error("Price must be greater than zero")
    }

    if (newPrice > 10000) {
      throw new Error("Price exceeds maximum allowed value")
    }

    const menuItem = await this.retrieveMenuItem(menuItemId) as any
    const oldPrice = Number(menuItem.price || 0)

    return await (this as any).updateMenuItems({
      id: menuItemId,
      price: newPrice,
      previous_price: oldPrice,
      price_updated_at: new Date(),
    })
  }

  async getRevenueReport(restaurantId: string, periodStart: Date, periodEnd: Date): Promise<{
    restaurantId: string
    totalRevenue: number
    orderCount: number
    averageOrderValue: number
    periodStart: Date
    periodEnd: Date
  }> {
    const restaurant = await this.retrieveRestaurant(restaurantId)
    const orders = await this.listKitchenOrders({ restaurant_id: restaurantId }) as any
    const orderList = Array.isArray(orders) ? orders : [orders].filter(Boolean)

    const periodOrders = orderList.filter((o: any) => {
      const date = new Date(o.placed_at || o.created_at)
      return date >= periodStart && date <= periodEnd && o.status !== "cancelled"
    })

    const totalRevenue = periodOrders.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0)
    const orderCount = periodOrders.length
    const averageOrderValue = orderCount > 0 ? Math.round((totalRevenue / orderCount) * 100) / 100 : 0

    return {
      restaurantId,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      orderCount,
      averageOrderValue,
      periodStart,
      periodEnd,
    }
  }
}

export default RestaurantModuleService
