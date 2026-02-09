import { model } from "@medusajs/framework/utils"

const ServiceChannel = model.define("service_channel", {
  id: model.id().primaryKey(),
  
  tenant_id: model.text(),
  poi_id: model.text().nullable(),
  
  name: model.text(),
  slug: model.text(),
  channel_type: model.enum([
    "in_store", "online", "delivery", "pickup", "drive_through",
    "curbside", "appointment", "telemedicine", "home_service",
    "subscription_box", "wholesale", "auction", "rental"
  ]).default("online"),
  
  is_active: model.boolean().default(true),
  
  capabilities: model.json().nullable(),
  
  operating_hours: model.json().nullable(),
  fulfillment_type: model.enum(["instant", "scheduled", "on_demand", "standard", "custom"]).default("standard"),
  
  min_order_amount: model.bigNumber().nullable(),
  max_order_amount: model.bigNumber().nullable(),
  delivery_fee: model.bigNumber().nullable(),
  
  supported_payment_methods: model.json().nullable(),
  
  priority: model.number().default(0),
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["poi_id"] },
  { on: ["channel_type"] },
])

export default ServiceChannel
