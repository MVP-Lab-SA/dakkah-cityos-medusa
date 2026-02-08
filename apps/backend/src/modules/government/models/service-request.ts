import { model } from "@medusajs/framework/utils"

const ServiceRequest = model.define("service_request", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  citizen_id: model.text(),
  request_type: model.enum([
    "maintenance",
    "complaint",
    "inquiry",
    "permit",
    "license",
    "inspection",
    "emergency",
  ]),
  category: model.text().nullable(),
  title: model.text(),
  description: model.text(),
  location: model.json().nullable(),
  status: model.enum([
    "submitted",
    "acknowledged",
    "in_progress",
    "resolved",
    "closed",
    "rejected",
  ]).default("submitted"),
  priority: model.enum([
    "low",
    "medium",
    "high",
    "urgent",
  ]).default("medium"),
  assigned_to: model.text().nullable(),
  department: model.text().nullable(),
  resolution: model.text().nullable(),
  resolved_at: model.dateTime().nullable(),
  photos: model.json().nullable(),
  reference_number: model.text().unique(),
  metadata: model.json().nullable(),
})

export default ServiceRequest
