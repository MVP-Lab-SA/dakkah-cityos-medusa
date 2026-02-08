import { model } from "@medusajs/framework/utils"

const ShuttleRoute = model.define("shuttle_route", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  route_type: model.enum([
    "airport",
    "hotel",
    "campus",
    "event",
    "city",
  ]),
  stops: model.json(),
  schedule: model.json().nullable(),
  vehicle_type: model.text().nullable(),
  capacity: model.number().nullable(),
  price: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default ShuttleRoute
