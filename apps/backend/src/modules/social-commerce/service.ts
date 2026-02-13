import { MedusaService } from "@medusajs/framework/utils"
import LiveStream from "./models/live-stream.js"
import LiveProduct from "./models/live-product.js"
import SocialPost from "./models/social-post.js"
import SocialShare from "./models/social-share.js"
import GroupBuy from "./models/group-buy.js"

class SocialCommerceModuleService extends MedusaService({
  LiveStream,
  LiveProduct,
  SocialPost,
  SocialShare,
  GroupBuy,
}) {}

export default SocialCommerceModuleService
