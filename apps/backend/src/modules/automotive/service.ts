import { MedusaService } from "@medusajs/framework/utils"
import VehicleListing from "./models/vehicle-listing.js"
import TestDrive from "./models/test-drive.js"
import VehicleService from "./models/vehicle-service.js"
import PartCatalog from "./models/part-catalog.js"
import TradeIn from "./models/trade-in.js"

class AutomotiveModuleService extends MedusaService({
  VehicleListing,
  TestDrive,
  VehicleService,
  PartCatalog,
  TradeIn,
}) {}

export default AutomotiveModuleService
