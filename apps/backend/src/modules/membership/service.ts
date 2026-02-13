import { MedusaService } from "@medusajs/framework/utils"
import MembershipTier from "./models/membership-tier.js"
import Membership from "./models/membership.js"
import PointsLedger from "./models/points-ledger.js"
import Reward from "./models/reward.js"
import Redemption from "./models/redemption.js"

class MembershipModuleService extends MedusaService({
  MembershipTier,
  Membership,
  PointsLedger,
  Reward,
  Redemption,
}) {}

export default MembershipModuleService
