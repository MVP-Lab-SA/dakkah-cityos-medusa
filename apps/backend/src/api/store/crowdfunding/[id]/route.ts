import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("crowdfunding") as any
  const { id } = req.params
  const [item] = await mod.listCrowdfundCampaigns({ id }, { take: 1 })
  if (!item) return res.status(404).json({ message: "Not found" })
  const reward_tiers = await mod.listRewardTiers({ campaign_id: id }, { take: 100 })
  return res.json({ item: { ...item, reward_tiers } })
}
