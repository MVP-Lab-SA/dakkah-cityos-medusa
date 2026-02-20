import { model } from "@medusajs/framework/utils";

const DisputeMessage = model.define("dispute_message", {
  id: model.id().primaryKey(),
  dispute_id: model.text(),
  sender_type: model.text(),
  sender_id: model.text(),
  content: model.text(),
  attachments: model.json().nullable(),
  is_internal: model.boolean().default(false),
  metadata: model.json().nullable(),
});

export default DisputeMessage;
