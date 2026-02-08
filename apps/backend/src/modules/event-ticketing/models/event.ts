import { model } from "@medusajs/framework/utils"

const Event = model.define("event", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  vendor_id: model.text().nullable(),
  title: model.text(),
  description: model.text().nullable(),
  event_type: model.enum([
    "concert",
    "conference",
    "workshop",
    "sports",
    "festival",
    "webinar",
    "meetup",
    "other",
  ]),
  status: model.enum([
    "draft",
    "published",
    "live",
    "completed",
    "cancelled",
  ]).default("draft"),
  venue_id: model.text().nullable(),
  address: model.json().nullable(),
  latitude: model.number().nullable(),
  longitude: model.number().nullable(),
  starts_at: model.dateTime(),
  ends_at: model.dateTime(),
  timezone: model.text().default("UTC"),
  is_online: model.boolean().default(false),
  online_url: model.text().nullable(),
  max_capacity: model.number().nullable(),
  current_attendees: model.number().default(0),
  image_url: model.text().nullable(),
  organizer_name: model.text().nullable(),
  organizer_email: model.text().nullable(),
  tags: model.json().nullable(),
  metadata: model.json().nullable(),
})

export default Event
