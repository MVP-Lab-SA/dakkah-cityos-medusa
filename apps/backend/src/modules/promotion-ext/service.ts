import { MedusaService } from "@medusajs/framework/utils"
import GiftCardExt from "./models/gift-card-ext"
import Referral from "./models/referral"
import ProductBundle from "./models/product-bundle"
import CustomerSegment from "./models/customer-segment"

class PromotionExtModuleService extends MedusaService({
  GiftCardExt,
  Referral,
  ProductBundle,
  CustomerSegment,
}) {}

export default PromotionExtModuleService
