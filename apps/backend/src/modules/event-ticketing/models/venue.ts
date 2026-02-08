import { model } from "@medusajs/framework/utils"

const Venue = model.define("venue", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  address_line1: model.text(),
  address_line2: model.text().nullable(),
  city: model.text(),
  state: model.text().nullable(),
  postal_code: model.text(),
  country_code: model.text(),
  latitude: model.number().nullable(),
  longitude: model.number().nullable(),
  capacity: model.number().nullable(),
  venue_type: model.enum([
    "indoor",
    "outdoor",
    "hybrid",
    "virtual",
  ]),
  amenities: model.json().nullable(),
  contact_phone: model.text().nullable(),
  contact_email: model.text().nullable(),
  image_url: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default Venue
