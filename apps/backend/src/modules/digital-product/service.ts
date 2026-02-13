import { MedusaService } from "@medusajs/framework/utils"
import DigitalAsset from "./models/digital-asset"
import DownloadLicense from "./models/download-license"

class DigitalProductModuleService extends MedusaService({
  DigitalAsset,
  DownloadLicense,
}) {}

export default DigitalProductModuleService
