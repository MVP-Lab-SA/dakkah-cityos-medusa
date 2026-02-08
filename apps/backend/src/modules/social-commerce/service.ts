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
}) {}

export default SocialCommerceModuleService
