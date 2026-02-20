import { model } from "@medusajs/framework/utils";

const PodProduct = model.define("pod_product", {
  id: model.id().primaryKey(),
  title: model.text(),
  description: model.text().nullable(),
  product_id: model.text().nullable(),
  template_url: model.text(),
  print_provider: model.text().nullable(),
  customization_options: model.json().nullable(),
  base_cost: model.number(),
  retail_price: model.number(),
  status: model.enum(["active", "inactive", "discontinued"]).default("active"),
  tenant_id: model.text().nullable(),
  metadata: model.json().nullable(),
});

export default PodProduct;
