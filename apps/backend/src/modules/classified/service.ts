import { MedusaService } from "@medusajs/framework/utils"
import ClassifiedListing from "./models/classified-listing"
import ListingImage from "./models/listing-image"
import ListingOffer from "./models/listing-offer"
import ListingCategory from "./models/listing-category"
import ListingFlag from "./models/listing-flag"

class ClassifiedModuleService extends MedusaService({
  ClassifiedListing,
  ListingImage,
  ListingOffer,
  ListingCategory,
  ListingFlag,
}) {}

export default ClassifiedModuleService
