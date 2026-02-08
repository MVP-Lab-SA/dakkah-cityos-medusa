import { model } from "@medusajs/framework/utils"

const TravelProperty = model.define("travel_property", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  vendor_id: model.text().nullable(),
  name: model.text(),
  description: model.text().nullable(),
  property_type: model.enum(["hotel", "resort", "hostel", "apartment", "villa", "guesthouse", "motel", "boutique"]),
  star_rating: model.number().nullable(),
  address_line1: model.text(),
  address_line2: model.text().nullable(),
  city: model.text(),
  state: model.text().nullable(),
  country_code: model.text(),
  postal_code: model.text().nullable(),
  latitude: model.number().nullable(),
  longitude: model.number().nullable(),
  check_in_time: model.text().default("15:00"),
  check_out_time: model.text().default("11:00"),
  phone: model.text().nullable(),
  email: model.text().nullable(),
  website: model.text().nullable(),
  amenities: model.json().nullable(),
  policies: model.json().nullable(),
  images: model.json().nullable(),
  is_active: model.boolean().default(true),
  avg_rating: model.number().nullable(),
  total_reviews: model.number().default(0),
  metadata: model.json().nullable(),
})

export default TravelProperty
