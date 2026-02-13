import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("charity") as any
    const { limit = "20", offset = "0", tenant_id, category } = req.query as Record<string, string | undefined>
    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (category) filters.category = category
    const charities = await mod.listCharityOrgs(filters, { skip: Number(offset), take: Number(limit) })
    const campaigns = await mod.listDonationCampaigns(filters, { skip: Number(offset), take: Number(limit) })
    return res.json({ charities, campaigns, limit: Number(limit), offset: Number(offset) })
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch charity data", error: error.message })
  }
}
