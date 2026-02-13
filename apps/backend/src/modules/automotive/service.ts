import { MedusaService } from "@medusajs/framework/utils"
import VehicleListing from "./models/vehicle-listing"
import TestDrive from "./models/test-drive"
import VehicleService from "./models/vehicle-service"
import PartCatalog from "./models/part-catalog"
import TradeIn from "./models/trade-in"

class AutomotiveModuleService extends MedusaService({
  VehicleListing,
  TestDrive,
  VehicleService,
  PartCatalog,
  TradeIn,
}) {}

export default AutomotiveModuleService
