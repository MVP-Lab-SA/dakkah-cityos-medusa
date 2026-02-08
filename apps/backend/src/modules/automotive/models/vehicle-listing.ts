import { model } from "@medusajs/framework/utils"

const VehicleListing = model.define("vehicle_listing", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  seller_id: model.text(),
  listing_type: model.enum(["sale", "lease", "auction"]),
  title: model.text(),
  make: model.text(),
  model_name: model.text(),
  year: model.number(),
  mileage_km: model.number().nullable(),
  fuel_type: model.enum(["petrol", "diesel", "electric", "hybrid", "hydrogen"]).nullable(),
  transmission: model.enum(["automatic", "manual", "cvt"]).nullable(),
  body_type: model.enum(["sedan", "suv", "hatchback", "truck", "van", "coupe", "convertible", "wagon"]).nullable(),
  color: model.text().nullable(),
  vin: model.text().nullable(),
  condition: model.enum(["new", "certified_pre_owned", "used", "salvage"]).default("used"),
  price: model.bigNumber(),
  currency_code: model.text(),
  description: model.text().nullable(),
  features: model.json().nullable(),
  images: model.json().nullable(),
  location_city: model.text().nullable(),
  location_country: model.text().nullable(),
  status: model.enum(["draft", "active", "reserved", "sold", "withdrawn"]).default("draft"),
  view_count: model.number().default(0),
  metadata: model.json().nullable(),
})

export default VehicleListing
