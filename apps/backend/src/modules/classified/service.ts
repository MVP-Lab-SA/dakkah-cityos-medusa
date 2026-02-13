import { MedusaService } from "@medusajs/framework/utils"
import ClassifiedListing from "./models/classified-listing.js"
import ListingImage from "./models/listing-image.js"
import ListingOffer from "./models/listing-offer.js"
import ListingCategory from "./models/listing-category.js"
import ListingFlag from "./models/listing-flag.js"

class ClassifiedModuleService extends MedusaService({
  ClassifiedListing,
  ListingImage,
  ListingOffer,
  ListingCategory,
  ListingFlag,
}) {}

export default ClassifiedModuleService
