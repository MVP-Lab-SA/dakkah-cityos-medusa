import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"

export interface VolumePricingTier {
  id: string
  volume_pricing_id?: string
  min_quantity: number
  max_quantity?: number | null
  discount_percentage?: number
  fixed_price?: number
  discount_amount?: number
  metadata?: Record<string, unknown>
}

export interface VolumePricingRule {
  id: string
  tenant_id?: string
  store_id?: string
  region_id?: string
  name: string
  description?: string
  applies_to: "product" | "variant" | "collection" | "category" | "all"
  target_id?: string
  product_id?: string
  pricing_type: "percentage" | "fixed" | "fixed_price"
  company_id?: string
  company_tier?: string
  priority: number
  status: "active" | "inactive" | "scheduled"
  starts_at?: string
  ends_at?: string
  is_active?: boolean
  tiers: VolumePricingTier[]
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useVolumePricing(productId: string) {
  return useQuery({
    queryKey: queryKeys.volumePricing.forProduct(productId),
    queryFn: async () => {
      const response = await sdk.client.fetch<{ rules: VolumePricingRule[] }>(
        `/store/volume-pricing/${productId}`
      )
      return response
    },
    enabled: !!productId,
  })
}

export function getActiveTier(tiers: VolumePricingTier[], quantity: number): VolumePricingTier | undefined {
  return tiers.find((tier) => {
    const inRange = tier.min_quantity <= quantity
    const noMax = tier.max_quantity === null || tier.max_quantity === undefined
    const belowMax = tier.max_quantity ? quantity <= tier.max_quantity : false
    return inRange && (noMax || belowMax)
  })
}

export function getTierDiscount(tier: VolumePricingTier): string {
  if (tier.discount_percentage) return `${tier.discount_percentage}% off`
  if (tier.fixed_price) return `$${Number(tier.fixed_price).toFixed(2)} each`
  if (tier.discount_amount) return `$${Number(tier.discount_amount).toFixed(2)} off`
  return ""
}
