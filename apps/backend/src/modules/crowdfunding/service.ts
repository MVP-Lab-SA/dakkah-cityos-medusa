import { MedusaService } from "@medusajs/framework/utils"
import CrowdfundCampaign from "./models/campaign"
import Pledge from "./models/pledge"
import RewardTier from "./models/reward-tier"
import CampaignUpdate from "./models/campaign-update"
import Backer from "./models/backer"

class CrowdfundingModuleService extends MedusaService({
  CrowdfundCampaign,
  Pledge,
  RewardTier,
  CampaignUpdate,
  Backer,
}) {
  /** Create a pledge for a campaign */
  async pledge(campaignId: string, backerId: string, amount: number, rewardTierId?: string): Promise<any> {
    if (amount <= 0) {
      throw new Error("Pledge amount must be greater than zero")
    }

    const campaign = await this.retrieveCrowdfundCampaign(campaignId) as any
    if (campaign.status !== "active") {
      throw new Error("Campaign is not accepting pledges")
    }

    if (rewardTierId) {
      const tier = await this.retrieveRewardTier(rewardTierId) as any
      if (amount < Number(tier.minimum_amount || 0)) {
        throw new Error(`Minimum pledge for this reward is ${tier.minimum_amount}`)
      }
    }

    const pledge = await (this as any).createPledges({
      campaign_id: campaignId,
      backer_id: backerId,
      amount,
      reward_tier_id: rewardTierId || null,
      status: "active",
      pledged_at: new Date(),
    })

    const currentAmount = Number(campaign.current_amount || 0)
    await (this as any).updateCrowdfundCampaigns({
      id: campaignId,
      current_amount: currentAmount + amount,
      backer_count: Number(campaign.backer_count || 0) + 1,
    })

    return pledge
  }

  /** Get campaign status including funding progress */
  async getCampaignStatus(campaignId: string): Promise<{
    campaign: any
    funded: boolean
    percentage: number
    remaining: number
    daysLeft: number | null
  }> {
    const campaign = await this.retrieveCrowdfundCampaign(campaignId) as any
    const goal = Number(campaign.goal_amount || 0)
    const current = Number(campaign.current_amount || 0)
    const percentage = goal > 0 ? Math.round((current / goal) * 10000) / 100 : 0

    let daysLeft: number | null = null
    if (campaign.end_date) {
      const diff = new Date(campaign.end_date).getTime() - Date.now()
      daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    }

    return {
      campaign,
      funded: current >= goal,
      percentage,
      remaining: Math.max(0, goal - current),
      daysLeft,
    }
  }

  /** Process refunds for a failed campaign */
  async processRefunds(campaignId: string): Promise<{ refunded: number; count: number }> {
    const campaign = await this.retrieveCrowdfundCampaign(campaignId) as any

    if (campaign.status !== "failed" && campaign.status !== "cancelled") {
      throw new Error("Refunds can only be processed for failed or cancelled campaigns")
    }

    const pledges = await this.listPledges({ campaign_id: campaignId, status: "active" }) as any
    const pledgeList = Array.isArray(pledges) ? pledges : [pledges].filter(Boolean)

    let totalRefunded = 0
    for (const p of pledgeList) {
      await (this as any).updatePledges({ id: p.id, status: "refunded", refunded_at: new Date() })
      totalRefunded += Number(p.amount)
    }

    return { refunded: totalRefunded, count: pledgeList.length }
  }

  /** Check if campaign has met its funding goal */
  async checkFundingGoal(campaignId: string): Promise<boolean> {
    const campaign = await this.retrieveCrowdfundCampaign(campaignId) as any
    const goal = Number(campaign.goal_amount || 0)
    const current = Number(campaign.current_amount || 0)
    return goal > 0 && current >= goal
  }
}

export default CrowdfundingModuleService
