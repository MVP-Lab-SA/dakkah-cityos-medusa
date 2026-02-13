import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const charityService = req.scope.resolve("charity") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      category,
      status,
      is_verified,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (category) filters.category = category
    if (status) filters.status = status
    if (is_verified !== undefined) filters.is_verified = is_verified === "true"
    if (search) filters.name = { $like: `%${search}%` }

    const paginationOpts = {
      skip: Number(offset),
      take: Number(limit),
      order: { created_at: "DESC" },
    }

    const [charities, campaigns] = await Promise.all([
      charityService.listCharityOrgs(filters, paginationOpts),
      charityService.listDonationCampaigns(filters, paginationOpts),
    ])

    const charityList = Array.isArray(charities) ? charities : []
    const campaignList = Array.isArray(campaigns) ? campaigns : []

    return res.json({
      charities: charityList,
      campaigns: campaignList,
      count: charityList.length + campaignList.length,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch charity data",
      error: error.message,
    })
  }
}
