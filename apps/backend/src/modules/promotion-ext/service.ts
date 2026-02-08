import { MedusaService } from "@medusajs/framework/utils"
import LoyaltyProgram from "./models/loyalty-program"
import LoyaltyPointsLedger from "./models/loyalty-points-ledger"
import Wishlist from "./models/wishlist"
import WishlistItem from "./models/wishlist-item"
import GiftCardExt from "./models/gift-card-ext"
import Referral from "./models/referral"
import ProductBundle from "./models/product-bundle"
import CustomerSegment from "./models/customer-segment"

class PromotionExtModuleService extends MedusaService({
  LoyaltyProgram,
  LoyaltyPointsLedger,
  Wishlist,
  WishlistItem,
  GiftCardExt,
  Referral,
  ProductBundle,
  CustomerSegment,
}) {}

export default PromotionExtModuleService
