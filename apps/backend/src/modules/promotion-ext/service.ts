// @ts-nocheck
import { MedusaService } from "@medusajs/framework/utils"
import GiftCardExt from "./models/gift-card-ext"
import Referral from "./models/referral"
import ProductBundle from "./models/product-bundle"
import CustomerSegment from "./models/customer-segment"

class PromotionExtModuleService extends MedusaService({
  GiftCardExt,
  Referral,
  ProductBundle,
  CustomerSegment,
}) {
  async getActivePromotions(tenantId: string, options?: { includeExpired?: boolean }) {
    const filters: Record<string, any> = {
      tenant_id: tenantId,
      is_active: true,
    }

    if (!options?.includeExpired) {
      const now = new Date()
      filters.expires_at = { $gte: now }
    }

    const promotions = await this.listGiftCardExts(filters, {
      order: { created_at: "DESC" },
    })

    return Array.isArray(promotions) ? promotions : [promotions].filter(Boolean)
  }

  async validatePromotionRules(
    promotionId: string,
    cartData: {
      customerId?: string
      totalAmount?: number
      items?: Array<{ sku?: string; category?: string }>
    }
  ) {
    const promotion = await this.retrieveGiftCardExt(promotionId)

    if (!promotion.is_active) {
      return { isValid: false, reason: "Promotion is not active" }
    }

    if (promotion.expires_at && new Date(promotion.expires_at) < new Date()) {
      return { isValid: false, reason: "Promotion has expired" }
    }

    const remainingValue = Number(promotion.remaining_value)
    if (remainingValue <= 0) {
      return { isValid: false, reason: "Promotion budget exhausted" }
    }

    if (cartData.totalAmount && remainingValue < cartData.totalAmount) {
      return {
        isValid: true,
        partialApply: true,
        availableDiscount: remainingValue,
      }
    }

    return { isValid: true }
  }

  async calculateDiscount(
    promotionId: string,
    lineItems: Array<{ productId: string; quantity: number; price: number }>
  ) {
    const promotion = await this.retrieveGiftCardExt(promotionId)

    if (!promotion.is_active) {
      return { discountAmount: 0, items: [] }
    }

    const remainingValue = Number(promotion.remaining_value)
    let totalDiscount = 0
    const discountedItems = []

    for (const item of lineItems) {
      const itemTotal = item.quantity * item.price
      const discount = Math.min(itemTotal, remainingValue - totalDiscount)

      if (discount > 0) {
        discountedItems.push({
          productId: item.productId,
          discount,
          originalPrice: itemTotal,
          discountedPrice: itemTotal - discount,
        })
        totalDiscount += discount
      }

      if (totalDiscount >= remainingValue) {
        break
      }
    }

    return {
      discountAmount: totalDiscount,
      items: discountedItems,
      promotionId,
    }
  }

  async getPromotionUsageStats(promotionId: string) {
    const promotion = await this.retrieveGiftCardExt(promotionId)
    const initialValue = Number(promotion.initial_value)
    const remainingValue = Number(promotion.remaining_value)
    const usedAmount = initialValue - remainingValue
    const usagePercentage = initialValue > 0 ? (usedAmount / initialValue) * 100 : 0

    return {
      promotionId,
      initialBudget: initialValue,
      remainingBudget: remainingValue,
      usedAmount,
      usagePercentage: Math.round(usagePercentage * 100) / 100,
      isActive: promotion.is_active,
      expiresAt: promotion.expires_at,
      deliveredAt: promotion.delivered_at,
    }
  }

  async deactivateExpiredPromotions(tenantId: string) {
    const now = new Date()

    const expiredPromotions = await this.listGiftCardExts({
      tenant_id: tenantId,
      is_active: true,
      expires_at: { $lt: now },
    })

    const promotions = Array.isArray(expiredPromotions)
      ? expiredPromotions
      : [expiredPromotions].filter(Boolean)

    const deactivated = []

    for (const promotion of promotions) {
      const updated = await (this as any).updateGiftCardExts({
        id: promotion.id,
        is_active: false,
      })
      deactivated.push(updated)
    }

    return {
      deactivatedCount: deactivated.length,
      promotions: deactivated,
    }
  }
}

export default PromotionExtModuleService
