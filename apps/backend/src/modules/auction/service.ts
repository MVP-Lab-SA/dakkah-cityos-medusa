import { MedusaService } from "@medusajs/framework/utils"
import AuctionListing from "./models/auction-listing"
import Bid from "./models/bid"
import AutoBidRule from "./models/auto-bid-rule"
import AuctionResult from "./models/auction-result"
import AuctionEscrow from "./models/auction-escrow"

class AuctionModuleService extends MedusaService({
  AuctionListing,
  Bid,
  AutoBidRule,
  AuctionResult,
  AuctionEscrow,
}) {}

export default AuctionModuleService
