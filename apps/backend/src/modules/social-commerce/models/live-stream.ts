import { model } from "@medusajs/framework/utils"

const LiveStream = model.define("live_stream", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  host_id: model.text(),
  title: model.text(),
  description: model.text().nullable(),
  status: model.enum([
    "scheduled",
    "live",
    "ended",
    "cancelled",
  ]).default("scheduled"),
  stream_url: model.text().nullable(),
  platform: model.enum([
    "internal",
    "instagram",
    "tiktok",
    "youtube",
    "facebook",
  ]).default("internal"),
  scheduled_at: model.dateTime().nullable(),
  started_at: model.dateTime().nullable(),
  ended_at: model.dateTime().nullable(),
  viewer_count: model.number().default(0),
  peak_viewers: model.number().default(0),
  total_sales: model.bigNumber().default(0),
  total_orders: model.number().default(0),
  thumbnail_url: model.text().nullable(),
  recording_url: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default LiveStream
