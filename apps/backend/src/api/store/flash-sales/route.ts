import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { limit = "20", offset = "0", tenant_id } = req.query as Record<string, string | undefined>

  try {
    const moduleService = req.scope.resolve("promotionExt") as any
    const now = new Date()

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id

    const promotions = await moduleService.listProductBundles(filters, {
      skip: Number(offset),
      take: Number(limit),
      order: { created_at: "DESC" },
    })

    const promoList = Array.isArray(promotions) ? promotions : [promotions].filter(Boolean)

    const query = req.scope.resolve("query") as any
    let flashSales: any[] = []

    try {
      const { data: promos } = await query.graph({
        entity: "promotion",
        fields: [
          "id",
          "code",
          "is_automatic",
          "type",
          "status",
          "starts_at",
          "ends_at",
          "campaign_id",
          "application_method.type",
          "application_method.value",
          "application_method.target_type",
        ],
        filters: {
          status: "active",
        },
      })

      flashSales = (Array.isArray(promos) ? promos : []).filter((promo: any) => {
        if (promo.starts_at && new Date(promo.starts_at) > now) return false
        if (promo.ends_at && new Date(promo.ends_at) < now) return false
        return true
      })
    } catch {
      flashSales = []
    }

    res.json({
      flash_sales: flashSales,
      count: flashSales.length,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch flash sales", error: error.message })
  }
}
