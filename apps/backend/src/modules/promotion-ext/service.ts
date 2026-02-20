import { MedusaService } from "@medusajs/framework/utils";
import GiftCardExt from "./models/gift-card-ext";
import Referral from "./models/referral";
import ProductBundle from "./models/product-bundle";
import CustomerSegment from "./models/customer-segment";

type GiftCardExtRecord = {
  id: string;
  tenant_id: string;
  is_active: boolean;
  expires_at: Date | string | null;
  remaining_value: number | string;
  initial_value: number | string;
  delivered_at: Date | string | null;
  metadata: Record<string, unknown> | null;
};

type DiscountedItem = {
  productId: string;
  discount: number;
  originalPrice: number;
  discountedPrice: number;
};

type AppliedPromotion = {
  promotionId: string;
  discountAmount: number;
  remainingBudget: number;
};

interface PromotionExtServiceBase {
  listGiftCardExts(
    filters: Record<string, unknown>,
    options?: Record<string, unknown>,
  ): Promise<GiftCardExtRecord[]>;
  retrieveGiftCardExt(id: string): Promise<GiftCardExtRecord>;
  updateGiftCardExts(
    data: { id: string } & Record<string, unknown>,
  ): Promise<GiftCardExtRecord>;
}

class PromotionExtModuleService extends MedusaService({
  GiftCardExt,
  Referral,
  ProductBundle,
  CustomerSegment,
}) {
  async getActivePromotions(
    tenantId: string,
    options?: { includeExpired?: boolean },
  ): Promise<GiftCardExtRecord[]> {
    const filters: Record<string, unknown> = {
      tenant_id: tenantId,
      is_active: true,
    };

    if (!options?.includeExpired) {
      filters.expires_at = { $gte: new Date() };
    }

    return (this as unknown as PromotionExtServiceBase).listGiftCardExts(
      filters,
      {
        order: { created_at: "DESC" },
      },
    );
  }

  async validatePromotionRules(
    promotionId: string,
    cartData: {
      customerId?: string;
      totalAmount?: number;
      items?: Array<{ sku?: string; category?: string }>;
    },
  ): Promise<{
    isValid: boolean;
    reason?: string;
    partialApply?: boolean;
    availableDiscount?: number;
  }> {
    const promotion = await (
      this as unknown as PromotionExtServiceBase
    ).retrieveGiftCardExt(promotionId);

    if (!promotion.is_active) {
      return { isValid: false, reason: "Promotion is not active" };
    }

    if (promotion.expires_at && new Date(promotion.expires_at) < new Date()) {
      return { isValid: false, reason: "Promotion has expired" };
    }

    const remainingValue = Number(promotion.remaining_value);
    if (remainingValue <= 0) {
      return { isValid: false, reason: "Promotion budget exhausted" };
    }

    if (cartData.totalAmount && remainingValue < cartData.totalAmount) {
      return {
        isValid: true,
        partialApply: true,
        availableDiscount: remainingValue,
      };
    }

    return { isValid: true };
  }

  async calculateDiscount(
    promotionId: string,
    lineItems: Array<{ productId: string; quantity: number; price: number }>,
  ): Promise<{
    discountAmount: number;
    items: DiscountedItem[];
    promotionId: string;
  }> {
    const promotion = await (
      this as unknown as PromotionExtServiceBase
    ).retrieveGiftCardExt(promotionId);

    if (!promotion.is_active) {
      return { discountAmount: 0, items: [], promotionId };
    }

    const remainingValue = Number(promotion.remaining_value);
    let totalDiscount = 0;
    const discountedItems: DiscountedItem[] = [];

    for (const item of lineItems) {
      const itemTotal = item.quantity * item.price;
      const discount = Math.min(itemTotal, remainingValue - totalDiscount);

      if (discount > 0) {
        discountedItems.push({
          productId: item.productId,
          discount,
          originalPrice: itemTotal,
          discountedPrice: itemTotal - discount,
        });
        totalDiscount += discount;
      }

      if (totalDiscount >= remainingValue) break;
    }

    return {
      discountAmount: totalDiscount,
      items: discountedItems,
      promotionId,
    };
  }

  async getPromotionUsageStats(promotionId: string): Promise<{
    promotionId: string;
    initialBudget: number;
    remainingBudget: number;
    usedAmount: number;
    usagePercentage: number;
    isActive: boolean;
    expiresAt: Date | string | null;
    deliveredAt: Date | string | null;
  }> {
    const promotion = await (
      this as unknown as PromotionExtServiceBase
    ).retrieveGiftCardExt(promotionId);
    const initialValue = Number(promotion.initial_value);
    const remainingValue = Number(promotion.remaining_value);
    const usedAmount = initialValue - remainingValue;
    const usagePercentage =
      initialValue > 0 ? (usedAmount / initialValue) * 100 : 0;

    return {
      promotionId,
      initialBudget: initialValue,
      remainingBudget: remainingValue,
      usedAmount,
      usagePercentage: Math.round(usagePercentage * 100) / 100,
      isActive: promotion.is_active,
      expiresAt: promotion.expires_at,
      deliveredAt: promotion.delivered_at,
    };
  }

  async deactivateExpiredPromotions(
    tenantId: string,
  ): Promise<{ deactivatedCount: number; promotions: GiftCardExtRecord[] }> {
    const svc = this as unknown as PromotionExtServiceBase;
    const expiredPromotions = await svc.listGiftCardExts({
      tenant_id: tenantId,
      is_active: true,
      expires_at: { $lt: new Date() },
    });

    const deactivated: GiftCardExtRecord[] = [];
    for (const promotion of expiredPromotions) {
      const updated = await svc.updateGiftCardExts({
        id: promotion.id,
        is_active: false,
      });
      deactivated.push(updated);
    }

    return { deactivatedCount: deactivated.length, promotions: deactivated };
  }

  async calculateStackedDiscounts(cartData: {
    items: Array<{ quantity?: number; price?: number }>;
    promotionIds: string[];
  }): Promise<{
    totalDiscount: number;
    appliedPromotions: AppliedPromotion[];
    promotionCount: number;
  }> {
    const svc = this as unknown as PromotionExtServiceBase;
    let totalDiscount = 0;
    const appliedPromotions: AppliedPromotion[] = [];

    for (const promotionId of cartData.promotionIds) {
      try {
        const promotion = await svc.retrieveGiftCardExt(promotionId);

        if (!promotion.is_active) continue;
        if (promotion.expires_at && new Date(promotion.expires_at) < new Date())
          continue;

        const remainingValue = Number(promotion.remaining_value);
        if (remainingValue <= 0) continue;

        let promotionDiscount = 0;
        for (const item of cartData.items) {
          const itemTotal = (item.quantity ?? 1) * (item.price ?? 0);
          const availableDiscount = Math.min(
            itemTotal,
            remainingValue - promotionDiscount,
          );

          if (availableDiscount > 0) {
            promotionDiscount += availableDiscount;
          }

          if (promotionDiscount >= remainingValue) break;
        }

        if (promotionDiscount > 0) {
          totalDiscount += promotionDiscount;
          appliedPromotions.push({
            promotionId,
            discountAmount: promotionDiscount,
            remainingBudget: remainingValue - promotionDiscount,
          });
        }
      } catch {
        continue;
      }
    }

    return {
      totalDiscount,
      appliedPromotions,
      promotionCount: appliedPromotions.length,
    };
  }

  async getCustomerEligiblePromotions(
    customerId: string,
    tenantId: string,
  ): Promise<{
    customerId: string;
    tenantId: string;
    promotions: GiftCardExtRecord[];
    count: number;
  }> {
    const now = new Date();
    const svc = this as unknown as PromotionExtServiceBase;
    const activePromotions = await svc.listGiftCardExts({
      tenant_id: tenantId,
      is_active: true,
    });

    const eligible = activePromotions.filter((promo) => {
      if (promo.expires_at && new Date(promo.expires_at) < now) return false;
      if (Number(promo.remaining_value) <= 0) return false;

      const meta = promo.metadata ?? {};
      if (meta.restricted_customers) {
        const restricted = meta.restricted_customers as string[];
        if (!restricted.includes(customerId)) return false;
      }
      if (meta.excluded_customers) {
        const excluded = meta.excluded_customers as string[];
        if (excluded.includes(customerId)) return false;
      }

      return true;
    });

    return {
      customerId,
      tenantId,
      promotions: eligible,
      count: eligible.length,
    };
  }

  async trackRedemption(
    promotionId: string,
    orderId: string,
    customerId: string,
  ): Promise<{
    promotionId: string;
    orderId: string;
    customerId: string;
    redemptionCount: number;
    trackedAt: string;
  }> {
    const svc = this as unknown as PromotionExtServiceBase;
    const promotion = await svc.retrieveGiftCardExt(promotionId);

    if (!promotion.is_active) {
      throw new Error("Promotion is not active");
    }

    const existingMetadata = promotion.metadata ?? {};
    const redemptions =
      (existingMetadata.redemptions as Array<Record<string, string>>) ?? [];

    redemptions.push({
      orderId,
      customerId,
      redeemedAt: new Date().toISOString(),
    });

    await svc.updateGiftCardExts({
      id: promotionId,
      metadata: {
        ...existingMetadata,
        redemptions,
        total_redemptions: redemptions.length,
        last_redeemed_at: new Date().toISOString(),
      },
    });

    return {
      promotionId,
      orderId,
      customerId,
      redemptionCount: redemptions.length,
      trackedAt: new Date().toISOString(),
    };
  }
}

export default PromotionExtModuleService;
