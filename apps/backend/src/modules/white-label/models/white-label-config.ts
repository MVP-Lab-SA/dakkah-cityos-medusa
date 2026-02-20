import { model } from "@medusajs/framework/utils";

const WhiteLabelConfig = model.define("white_label_config", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  brand_name: model.text(),
  logo_url: model.text().nullable(),
  primary_color: model.text().nullable(),
  secondary_color: model.text().nullable(),
  custom_domain: model.text().nullable(),
  status: model.enum(["active", "inactive", "pending"]).default("pending"),
  metadata: model.json().nullable(),
});

export default WhiteLabelConfig;
