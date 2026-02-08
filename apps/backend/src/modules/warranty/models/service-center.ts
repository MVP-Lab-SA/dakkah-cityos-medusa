import { model } from "@medusajs/framework/utils"

const ServiceCenter = model.define("service_center", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  address_line1: model.text(),
  address_line2: model.text().nullable(),
  city: model.text(),
  state: model.text().nullable(),
  postal_code: model.text(),
  country_code: model.text(),
  phone: model.text().nullable(),
  email: model.text().nullable(),
  specializations: model.json().nullable(),
  is_active: model.boolean().default(true),
  capacity_per_day: model.number().nullable(),
  current_load: model.number().default(0),
  metadata: model.json().nullable(),
})

export default ServiceCenter
