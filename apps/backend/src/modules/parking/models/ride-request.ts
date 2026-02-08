import { model } from "@medusajs/framework/utils"

const RideRequest = model.define("ride_request", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  customer_id: model.text(),
  pickup_location: model.json(),
  dropoff_location: model.json(),
  ride_type: model.enum([
    "standard",
    "premium",
    "shared",
    "accessible",
  ]),
  status: model.enum([
    "requested",
    "matched",
    "driver_en_route",
    "in_progress",
    "completed",
    "cancelled",
  ]).default("requested"),
  driver_id: model.text().nullable(),
  vehicle_id: model.text().nullable(),
  estimated_fare: model.bigNumber().nullable(),
  actual_fare: model.bigNumber().nullable(),
  currency_code: model.text(),
  distance_km: model.number().nullable(),
  duration_minutes: model.number().nullable(),
  requested_at: model.dateTime(),
  picked_up_at: model.dateTime().nullable(),
  dropped_off_at: model.dateTime().nullable(),
  rating: model.number().nullable(),
  metadata: model.json().nullable(),
})

export default RideRequest
