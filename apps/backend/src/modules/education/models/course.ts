import { model } from "@medusajs/framework/utils"

const Course = model.define("course", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  instructor_id: model.text().nullable(),
  title: model.text(),
  description: model.text().nullable(),
  short_description: model.text().nullable(),
  category: model.text().nullable(),
  subcategory: model.text().nullable(),
  level: model.enum(["beginner", "intermediate", "advanced", "all_levels"]).default("all_levels"),
  format: model.enum(["self_paced", "live", "hybrid", "in_person"]),
  language: model.text().default("en"),
  price: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  duration_hours: model.number().nullable(),
  total_lessons: model.number().default(0),
  total_enrollments: model.number().default(0),
  avg_rating: model.number().nullable(),
  total_reviews: model.number().default(0),
  thumbnail_url: model.text().nullable(),
  preview_video_url: model.text().nullable(),
  syllabus: model.json().nullable(),
  prerequisites: model.json().nullable(),
  tags: model.json().nullable(),
  status: model.enum(["draft", "published", "archived"]).default("draft"),
  is_free: model.boolean().default(false),
  certificate_offered: model.boolean().default(false),
  metadata: model.json().nullable(),
})

export default Course
