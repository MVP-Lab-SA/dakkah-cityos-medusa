import { model } from "@medusajs/framework/utils"

const SocialPost = model.define("social_post", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  author_id: model.text(),
  content: model.text().nullable(),
  post_type: model.enum([
    "product_review",
    "outfit",
    "unboxing",
    "tutorial",
    "recommendation",
  ]),
  product_ids: model.json().nullable(),
  images: model.json().nullable(),
  video_url: model.text().nullable(),
  status: model.enum([
    "draft",
    "published",
    "hidden",
    "flagged",
  ]).default("draft"),
  like_count: model.number().default(0),
  comment_count: model.number().default(0),
  share_count: model.number().default(0),
  is_shoppable: model.boolean().default(false),
  metadata: model.json().nullable(),
})

export default SocialPost
