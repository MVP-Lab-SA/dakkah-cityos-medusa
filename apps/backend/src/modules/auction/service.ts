import { MedusaService } from "@medusajs/framework/utils"
import AuctionListing from "./models/auction-listing.js"
import Bid from "./models/bid.js"
import AutoBidRule from "./models/auto-bid-rule.js"
import AuctionResult from "./models/auction-result.js"
import AuctionEscrow from "./models/auction-escrow.js"

class AuctionModuleService extends MedusaService({
  AuctionListing,
  Bid,
  AutoBidRule,
  AuctionResult,
  AuctionEscrow,
}) {}

export default AuctionModuleService
