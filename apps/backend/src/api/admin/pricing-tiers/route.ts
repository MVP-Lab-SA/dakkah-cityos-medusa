// @ts-nocheck
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../lib/api-error-handler"

// GET - List B2B pricing tiers
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const query = req.scope.resolve("query")

    const { data: tiers } = await query.graph({
      entity: "pricing_tier",
      fields: [
        "id",
        "name",
        "description",
        "discount_percentage",
        "price_list_id",
        "min_order_value",
        "priority",
        "created_at"
      ],
      filters: {}
    })

    // Get company counts per tier
    const tiersWithCounts = await Promise.all(
      tiers.map(async (tier: any) => {
        const { data: companies } = await query.graph({
          entity: "company",
          fields: ["id"],
          filters: { pricing_tier_id: tier.id }
        })
        return {
          ...tier,
          company_count: companies.length
        }
      })
    )

    res.json({ 
      tiers: tiersWithCounts.sort((a, b) => (a.priority || 0) - (b.priority || 0))
    })

  } catch (error) {
    handleApiError(res, error, "GET admin pricing-tiers")
  }
}

// POST - Create B2B pricing tier
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const {
      name,
      description,
      discount_percentage,
      min_order_value,
      priority
    } = req.body as {
      name: string
      description?: string
      discount_percentage: number
      min_order_value?: number
      priority?: number
    }

    const pricingService = req.scope.resolve("pricingModuleService")

    // Create a price list for this tier
    const priceList = await pricingService.createPriceLists({
      title: `B2B Tier: ${name}`,
      type: "override",
      status: "active"
    })

    // Create the tier
    const companyService = req.scope.resolve("companyModuleService")
    const tier = await companyService.createPricingTiers({
      name,
      description,
      discount_percentage,
      price_list_id: priceList.id,
      min_order_value,
      priority: priority || 0
    })

    res.status(201).json({ tier })

  } catch (error) {
    handleApiError(res, error, "POST admin pricing-tiers")
  }
}
