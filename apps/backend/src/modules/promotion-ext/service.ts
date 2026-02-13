import { MedusaService } from "@medusajs/framework/utils"
import GiftCardExt from "./models/gift-card-ext.js"
import Referral from "./models/referral.js"
import ProductBundle from "./models/product-bundle.js"
import CustomerSegment from "./models/customer-segment.js"

class PromotionExtModuleService extends MedusaService({
  GiftCardExt,
  Referral,
  ProductBundle,
  CustomerSegment,
}) {}

export default PromotionExtModuleService
