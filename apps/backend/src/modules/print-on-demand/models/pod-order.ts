import { model } from "@medusajs/framework/utils";

const PodOrder = model.define("pod_order", {
  id: model.id().primaryKey(),
  order_id: model.text(),
  pod_product_id: model.text(),
  customization_data: model.json().nullable(),
  print_status: model
    .enum(["queued", "printing", "printed", "shipped", "cancelled"])
    .default("queued"),
  tracking_number: model.text().nullable(),
  quantity: model.number().default(1),
  unit_cost: model.number().nullable(),
  metadata: model.json().nullable(),
});

export default PodOrder;
