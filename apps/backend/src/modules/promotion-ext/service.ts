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
  async calculateStackedDiscounts(cartData: { items: any[]; promotionIds: string[] }) {
    let totalDiscount = 0
    const appliedPromotions: any[] = []

    for (const promotionId of cartData.promotionIds) {
      try {
        const promotion = await this.retrieveGiftCardExt(promotionId)

        if (!promotion.is_active) continue
        if (promotion.expires_at && new Date(promotion.expires_at) < new Date()) continue

        const remainingValue = Number(promotion.remaining_value)
        if (remainingValue <= 0) continue

        let promotionDiscount = 0
        for (const item of cartData.items) {
          const itemTotal = (item.quantity || 1) * (item.price || 0)
          const availableDiscount = Math.min(itemTotal, remainingValue - promotionDiscount)

          if (availableDiscount > 0) {
            promotionDiscount += availableDiscount
          }

          if (promotionDiscount >= remainingValue) break
        }

        if (promotionDiscount > 0) {
          totalDiscount += promotionDiscount
          appliedPromotions.push({
            promotionId,
            discountAmount: promotionDiscount,
            remainingBudget: remainingValue - promotionDiscount,
          })
        }
      } catch {
        continue
      }
    }

    return {
      totalDiscount,
      appliedPromotions,
      promotionCount: appliedPromotions.length,
    }
  }

  async getCustomerEligiblePromotions(customerId: string, tenantId: string) {
    const now = new Date()

    const activePromotions = await this.listGiftCardExts({
      tenant_id: tenantId,
      is_active: true,
    })

    const promotionList = Array.isArray(activePromotions) ? activePromotions : [activePromotions].filter(Boolean)

    const eligible = promotionList.filter((promo: any) => {
      if (promo.expires_at && new Date(promo.expires_at) < now) return false

      const remainingValue = Number(promo.remaining_value)
      if (remainingValue <= 0) return false

      if (promo.metadata?.restricted_customers) {
        const restricted = promo.metadata.restricted_customers as string[]
        if (!restricted.includes(customerId)) return false
      }

      if (promo.metadata?.excluded_customers) {
        const excluded = promo.metadata.excluded_customers as string[]
        if (excluded.includes(customerId)) return false
      }

      return true
    })

    return {
      customerId,
      tenantId,
      promotions: eligible,
      count: eligible.length,
    }
  }

  async trackRedemption(promotionId: string, orderId: string, customerId: string) {
    const promotion = await this.retrieveGiftCardExt(promotionId)

    if (!promotion.is_active) {
      throw new Error("Promotion is not active")
    }

    const existingMetadata = promotion.metadata || {}
    const redemptions = (existingMetadata.redemptions as any[]) || []

    redemptions.push({
      orderId,
      customerId,
      redeemedAt: new Date().toISOString(),
    })

    await (this as any).updateGiftCardExts({
      id: promotionId,
      metadata: {
        ...existingMetadata,
        redemptions,
        total_redemptions: redemptions.length,
        last_redeemed_at: new Date().toISOString(),
      },
    })

    return {
      promotionId,
      orderId,
      customerId,
      redemptionCount: redemptions.length,
      trackedAt: new Date().toISOString(),
    }
  }
}

export default PromotionExtModuleService
