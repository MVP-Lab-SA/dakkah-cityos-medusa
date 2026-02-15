import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context?.actor_id

  if (!customerId) {
    return res.json({
      trade_ins: [],
      count: 0,
      limit: 20,
      offset: 0,
      public_info: {
        eligible_categories: [
          { name: "Electronics", description: "Smartphones, laptops, tablets and more", estimated_value_range: "$50 - $800" },
          { name: "Automotive", description: "Vehicles, parts, and accessories", estimated_value_range: "$100 - $25000" },
          { name: "Furniture", description: "Home and office furniture", estimated_value_range: "$25 - $500" },
          { name: "Appliances", description: "Home appliances in working condition", estimated_value_range: "$30 - $400" },
        ],
        how_it_works: [
          "Submit your item details and photos",
          "Receive a trade-in value estimate",
          "Ship your item or drop it off",
          "Get credit applied to your account",
        ],
      },
    })
  }

  const { limit = "20", offset = "0", tenant_id, status } = req.query as Record<string, string | undefined>

  try {
    const automotiveService = req.scope.resolve("automotive") as any

    const filters: Record<string, any> = { customer_id: customerId }
    if (tenant_id) filters.tenant_id = tenant_id
    if (status) filters.status = status

    const items = await automotiveService.listTradeIns(filters, {
      skip: Number(offset),
      take: Number(limit),
      order: { created_at: "DESC" },
    })

    const tradeIns = Array.isArray(items) ? items : [items].filter(Boolean)

    res.json({
      trade_ins: tradeIns,
      count: tradeIns.length,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    handleApiError(res, error, "STORE-TRADE-IN")}
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context?.actor_id

  if (!customerId) {
    return res.status(401).json({ message: "Authentication required" })
  }

  const {
    tenant_id,
    listing_id,
    make,
    model_name,
    year,
    mileage_km,
    condition,
    vin,
    description,
    photos,
    currency_code = "usd",
    metadata,
  } = req.body as {
    tenant_id: string
    listing_id?: string
    make: string
    model_name: string
    year: number
    mileage_km: number
    condition: string
    vin?: string
    description?: string
    photos?: string[]
    currency_code?: string
    metadata?: Record<string, unknown>
  }

  if (!tenant_id || !make || !model_name || !year || !mileage_km || !condition) {
    return res.status(400).json({
      message: "tenant_id, make, model_name, year, mileage_km, and condition are required",
    })
  }

  try {
    const automotiveService = req.scope.resolve("automotive") as any

    const tradeIn = await (automotiveService as any).createTradeIns({
      tenant_id,
      customer_id: customerId,
      listing_id: listing_id || null,
      make,
      model_name,
      year,
      mileage_km,
      condition,
      vin: vin || null,
      description: description || null,
      photos: photos || null,
      currency_code,
      status: "submitted",
      metadata: metadata || null,
    })

    res.status(201).json({ trade_in: tradeIn })
  } catch (error: any) {
    handleApiError(res, error, "STORE-TRADE-IN")}
}

