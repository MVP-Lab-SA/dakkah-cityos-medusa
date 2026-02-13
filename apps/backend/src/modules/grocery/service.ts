import { MedusaService } from "@medusajs/framework/utils"
import FreshProduct from "./models/fresh-product"
import BatchTracking from "./models/batch-tracking"
import SubstitutionRule from "./models/substitution-rule"
import DeliverySlot from "./models/delivery-slot"

class GroceryModuleService extends MedusaService({
  FreshProduct,
  BatchTracking,
  SubstitutionRule,
  DeliverySlot,
}) {
  /**
   * Check the freshness status of a product by evaluating batch expiry dates.
   */
  async checkFreshness(productId: string): Promise<{ isFresh: boolean; daysUntilExpiry: number; batchId?: string }> {
    const batches = await this.listBatchTrackings({ product_id: productId }) as any
    const batchList = Array.isArray(batches) ? batches : [batches].filter(Boolean)
    const now = new Date()
    const freshBatch = batchList.find((b: any) => new Date(b.expiry_date) > now)
    if (!freshBatch) {
      return { isFresh: false, daysUntilExpiry: 0 }
    }
    const daysUntilExpiry = Math.ceil((new Date(freshBatch.expiry_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return { isFresh: daysUntilExpiry > 0, daysUntilExpiry, batchId: freshBatch.id }
  }

  /**
   * Get available delivery slots for a zone on a given date.
   */
  async getDeliverySlots(zoneId: string, date: Date): Promise<any[]> {
    const slots = await this.listDeliverySlots({ zone_id: zoneId }) as any
    const slotList = Array.isArray(slots) ? slots : [slots].filter(Boolean)
    const targetDate = new Date(date).toDateString()
    return slotList.filter((s: any) =>
      new Date(s.slot_date).toDateString() === targetDate && (s.capacity_remaining || 0) > 0
    )
  }

  /**
   * Create a shopping basket for a customer with the given items. Validates freshness for each item.
   */
  async createBasket(customerId: string, items: Array<{ productId: string; quantity: number }>): Promise<any> {
    const basketItems: any[] = []
    for (const item of items) {
      const product = await this.retrieveFreshProduct(item.productId)
      const freshness = await this.checkFreshness(item.productId)
      if (!freshness.isFresh) {
        const substitutes = await this.suggestSubstitutes(item.productId)
        if (substitutes.length > 0) {
          basketItems.push({ ...item, substituted: true, substituteId: substitutes[0].id })
          continue
        }
      }
      // @ts-expect-error - FreshProduct doesn't have price property
      basketItems.push({ ...item, unitPrice: Number(product.price || 0) })
    }
    return { customerId, items: basketItems, createdAt: new Date() }
  }

  /**
   * Suggest substitute products when a product is unavailable or not fresh.
   */
  async suggestSubstitutes(productId: string): Promise<any[]> {
    const rules = await this.listSubstitutionRules({ original_product_id: productId }) as any
    const ruleList = Array.isArray(rules) ? rules : [rules].filter(Boolean)
    const substitutes: any[] = []
    for (const rule of ruleList) {
      const sub = await this.retrieveFreshProduct(rule.substitute_product_id)
      const freshness = await this.checkFreshness(rule.substitute_product_id)
      if (freshness.isFresh) {
        substitutes.push(sub)
      }
    }
    return substitutes
  }
}

export default GroceryModuleService
