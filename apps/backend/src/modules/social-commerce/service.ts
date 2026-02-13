import { MedusaService } from "@medusajs/framework/utils"
import LiveStream from "./models/live-stream"
import LiveProduct from "./models/live-product"
import SocialPost from "./models/social-post"
import SocialShare from "./models/social-share"
import GroupBuy from "./models/group-buy"

class SocialCommerceModuleService extends MedusaService({
  LiveStream,
  LiveProduct,
  SocialPost,
  SocialShare,
  GroupBuy,
}) {
  /**
   * Create a social commerce post with associated product listings.
   */
  async createPost(vendorId: string, content: string, products: string[]): Promise<any> {
    const post = await (this as any).createSocialPosts({
      vendor_id: vendorId,
      content,
      product_ids: products,
      status: "published",
      published_at: new Date(),
      engagement_count: 0,
      share_count: 0,
    })
    return post
  }

  /**
   * Track engagement (like, share, comment, click) on a social commerce post.
   */
  async trackEngagement(postId: string, type: "like" | "share" | "comment" | "click"): Promise<any> {
    const post = await this.retrieveSocialPost(postId)
    const updates: Record<string, any> = { id: postId }
    if (type === "share") {
      updates.share_count = (Number((post as any).share_count) || 0) + 1
      await (this as any).createSocialShares({
        post_id: postId,
        shared_at: new Date(),
      })
    }
    updates.engagement_count = (Number((post as any).engagement_count) || 0) + 1
    return await (this as any).updateSocialPosts(updates)
  }

  /**
   * Get performance statistics for an influencer across their social posts.
   */
  async getInfluencerStats(influencerId: string): Promise<any> {
    const posts = await this.listSocialPosts({ vendor_id: influencerId }) as any
    const postList = Array.isArray(posts) ? posts : [posts].filter(Boolean)
    const totalEngagement = postList.reduce((sum: number, p: any) => sum + Number((p as any).engagement_count || 0), 0)
    const totalShares = postList.reduce((sum: number, p: any) => sum + Number((p as any).share_count || 0), 0)
    return {
      influencerId,
      totalPosts: postList.length,
      totalEngagement,
      totalShares,
      avgEngagementPerPost: postList.length > 0 ? Math.round(totalEngagement / postList.length) : 0,
    }
  }

  /**
   * Calculate commission earned from a social commerce post based on engagement and sales.
   */
  async calculateCommission(postId: string): Promise<{ postId: string; engagementScore: number; commission: number }> {
    const post = await this.retrieveSocialPost(postId)
    const engagementScore = Number((post as any).engagement_count || 0)
    const baseRate = 0.05
    const commission = engagementScore * baseRate
    return { postId, engagementScore, commission: Math.round(commission * 100) / 100 }
  }
}

export default SocialCommerceModuleService
