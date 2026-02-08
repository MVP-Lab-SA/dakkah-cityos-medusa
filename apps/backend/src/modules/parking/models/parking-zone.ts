import { model } from "@medusajs/framework/utils"

const ParkingZone = model.define("parking_zone", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  zone_type: model.enum([
    "street",
    "garage",
    "lot",
    "valet",
    "airport",
    "reserved",
  ]),
  address: model.json().nullable(),
  latitude: model.number().nullable(),
  longitude: model.number().nullable(),
  total_spots: model.number(),
  available_spots: model.number(),
  hourly_rate: model.bigNumber().nullable(),
  daily_rate: model.bigNumber().nullable(),
  monthly_rate: model.bigNumber().nullable(),
  currency_code: model.text(),
  operating_hours: model.json().nullable(),
  is_active: model.boolean().default(true),
  has_ev_charging: model.boolean().default(false),
  has_disabled_spots: model.boolean().default(false),
  metadata: model.json().nullable(),
})

export default ParkingZone
