import { model } from "@medusajs/framework/utils";

const PointTransaction = model.define("point_transaction", {
  id: model.id().primaryKey(),
  account_id: model.text(),
  tenant_id: model.text(),
  type: model.text(),
  points: model.bigNumber(),
  balance_after: model.bigNumber(),
  reference_type: model.text().nullable(),
  reference_id: model.text().nullable(),
  description: model.text().nullable(),
  expires_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
});

export default PointTransaction;
