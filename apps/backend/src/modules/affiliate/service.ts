import { MedusaService } from "@medusajs/framework/utils"
import Affiliate from "./models/affiliate"
import ReferralLink from "./models/referral-link"
import ClickTracking from "./models/click-tracking"
import AffiliateCommission from "./models/affiliate-commission"
import InfluencerCampaign from "./models/influencer-campaign"

class AffiliateModuleService extends MedusaService({
  Affiliate,
  ReferralLink,
  ClickTracking,
  AffiliateCommission,
  InfluencerCampaign,
}) {
  /**
   * Generate a unique referral code and link for an affiliate.
   */
  async generateReferralCode(affiliateId: string): Promise<any> {
    const affiliate = await this.retrieveAffiliate(affiliateId)
    const code = `REF-${affiliateId.substring(0, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    const link = await (this as any).createReferralLinks({
      affiliate_id: affiliateId,
      code,
      status: "active",
      created_at: new Date(),
      click_count: 0,
      conversion_count: 0,
    })
    return link
  }

  /**
   * Track a referral conversion when an order is placed using a referral code.
   */
  async trackReferral(code: string, orderId: string): Promise<any> {
    const links = await this.listReferralLinks({ code }) as any
    const linkList = Array.isArray(links) ? links : [links].filter(Boolean)
    if (linkList.length === 0) {
      throw new Error("Invalid referral code")
    }
    const link = linkList[0]
    await (this as any).updateReferralLinks({
      id: link.id,
      conversion_count: (Number(link.conversion_count) || 0) + 1,
    })
    const tracking = await (this as any).createClickTrackings({
      referral_link_id: link.id,
      order_id: orderId,
      tracked_at: new Date(),
      type: "conversion",
    })
    return tracking
  }

  /**
   * Calculate total commission earned by an affiliate for a given period.
   */
  async calculateCommission(affiliateId: string, period: { start: Date; end: Date }): Promise<{ affiliateId: string; totalCommission: number; transactionCount: number }> {
    const commissions = await this.listAffiliateCommissions({ affiliate_id: affiliateId }) as any
    const list = Array.isArray(commissions) ? commissions : [commissions].filter(Boolean)
    const periodCommissions = list.filter((c: any) => {
      const date = new Date(c.created_at)
      return date >= period.start && date <= period.end
    })
    const totalCommission = periodCommissions.reduce((sum: number, c: any) => sum + Number(c.amount || 0), 0)
    return { affiliateId, totalCommission, transactionCount: periodCommissions.length }
  }

  /**
   * Process commission payouts for all affiliates for a given period.
   */
  async processPayouts(period: { start: Date; end: Date }): Promise<any[]> {
    const affiliates = await this.listAffiliates({ status: "active" }) as any
    const affiliateList = Array.isArray(affiliates) ? affiliates : [affiliates].filter(Boolean)
    const payouts: any[] = []
    for (const affiliate of affiliateList) {
      const { totalCommission, transactionCount } = await this.calculateCommission(affiliate.id, period)
      if (totalCommission > 0) {
        payouts.push({
          affiliateId: affiliate.id,
          amount: totalCommission,
          transactions: transactionCount,
          processedAt: new Date(),
        })
      }
    }
    return payouts
  }
}

export default AffiliateModuleService
