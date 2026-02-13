import { MedusaService } from "@medusajs/framework/utils"
import MembershipTier from "./models/membership-tier"
import Membership from "./models/membership"
import PointsLedger from "./models/points-ledger"
import Reward from "./models/reward"
import Redemption from "./models/redemption"

class MembershipModuleService extends MedusaService({
  MembershipTier,
  Membership,
  PointsLedger,
  Reward,
  Redemption,
}) {}

export default MembershipModuleService
