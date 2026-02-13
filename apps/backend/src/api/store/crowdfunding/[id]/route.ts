import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("crowdfunding") as any
    const { id } = req.params
    const item = await mod.retrieveCrowdfundCampaign(id)
    if (!item) return res.status(404).json({ message: "Not found" })
    const reward_tiers = await mod.listRewardTiers({ campaign_id: id }, { take: 100 })
    return res.json({ item: { ...item, reward_tiers } })
  } catch (error: any) {
    if (error.type === "not_found" || error.message?.includes("not found")) {
      return res.status(404).json({ message: "Crowdfunding campaign not found" })
    }
    res.status(500).json({ message: "Failed to fetch crowdfunding campaign", error: error.message })
  }
}
