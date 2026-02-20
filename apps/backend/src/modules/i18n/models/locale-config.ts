import { model } from "@medusajs/framework/utils";

const LocaleConfig = model.define("locale_config", {
  id: model.id().primaryKey(),
  locale: model.text(),
  name: model.text(),
  is_default: model.boolean().default(false),
  is_active: model.boolean().default(true),
  direction: model.enum(["ltr", "rtl"]).default("ltr"),
  currency: model.text().default("usd"),
  date_format: model.text().nullable(),
  metadata: model.json().nullable(),
});

export default LocaleConfig;
