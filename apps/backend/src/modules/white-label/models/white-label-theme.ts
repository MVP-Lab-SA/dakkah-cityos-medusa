import { model } from "@medusajs/framework/utils";

const WhiteLabelTheme = model.define("white_label_theme", {
  id: model.id().primaryKey(),
  white_label_id: model.text(),
  theme_data: model.json().nullable(),
  font_family: model.text().nullable(),
  favicon_url: model.text().nullable(),
  is_published: model.boolean().default(false),
  metadata: model.json().nullable(),
});

export default WhiteLabelTheme;
