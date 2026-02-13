import { MedusaService } from "@medusajs/framework/utils"
import DigitalAsset from "./models/digital-asset.js"
import DownloadLicense from "./models/download-license.js"

class DigitalProductModuleService extends MedusaService({
  DigitalAsset,
  DownloadLicense,
}) {}

export default DigitalProductModuleService
