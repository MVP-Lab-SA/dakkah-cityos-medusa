import { MedusaService } from "@medusajs/framework/utils"
import CharityOrg from "./models/charity-org"
import DonationCampaign from "./models/donation-campaign"
import Donation from "./models/donation"
import ImpactReport from "./models/impact-report"

class CharityModuleService extends MedusaService({
  CharityOrg,
  DonationCampaign,
  Donation,
  ImpactReport,
}) {
  /** Process a donation to a campaign */
  async processDonation(campaignId: string, donorId: string, amount: number, metadata?: Record<string, unknown>): Promise<any> {
    if (amount <= 0) {
      throw new Error("Donation amount must be greater than zero")
    }

    const campaign = await this.retrieveDonationCampaign(campaignId)

    if ((campaign as any).status !== "active") {
      throw new Error("Campaign is not accepting donations")
    }

    if ((campaign as any).end_date && new Date((campaign as any).end_date) < new Date()) {
      throw new Error("Campaign has ended")
    }

    const donation = await (this as any).createDonations({
      campaign_id: campaignId,
      donor_id: donorId,
      amount,
      status: "completed",
      donated_at: new Date(),
      metadata: metadata || null,
    })

    const currentRaised = Number((campaign as any).raised_amount || 0)
    await (this as any).updateDonationCampaigns({
      id: campaignId,
      raised_amount: currentRaised + amount,
      donor_count: Number((campaign as any).donor_count || 0) + 1,
    })

    return donation
  }

  /** Get campaign progress including percentage funded */
  async getCampaignProgress(campaignId: string): Promise<{
    raised: number
    goal: number
    percentage: number
    donorCount: number
    daysRemaining: number | null
  }> {
    const campaign = await this.retrieveDonationCampaign(campaignId) as any

    const raised = Number(campaign.raised_amount || 0)
    const goal = Number(campaign.goal_amount || 0)
    const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0
    const donorCount = Number(campaign.donor_count || 0)

    let daysRemaining: number | null = null
    if (campaign.end_date) {
      const diff = new Date(campaign.end_date).getTime() - new Date().getTime()
      daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    }

    return { raised, goal, percentage: Math.round(percentage * 100) / 100, donorCount, daysRemaining }
  }

  /** Generate an impact report for a campaign */
  async generateImpactReport(campaignId: string): Promise<any> {
    const campaign = await this.retrieveDonationCampaign(campaignId) as any
    const progress = await this.getCampaignProgress(campaignId)

    const donations = await this.listDonations({ campaign_id: campaignId }) as any
    const donationList = Array.isArray(donations) ? donations : [donations].filter(Boolean)

    const totalAmount = donationList.reduce((sum: number, d: any) => sum + Number(d.amount || 0), 0)
    const avgDonation = donationList.length > 0 ? totalAmount / donationList.length : 0

    const report = await (this as any).createImpactReports({
      campaign_id: campaignId,
      title: `Impact Report - ${campaign.title || campaign.id}`,
      total_raised: totalAmount,
      donor_count: donationList.length,
      average_donation: Math.round(avgDonation * 100) / 100,
      goal_percentage: progress.percentage,
      generated_at: new Date(),
      status: "draft",
    })

    return report
  }
}

export default CharityModuleService
