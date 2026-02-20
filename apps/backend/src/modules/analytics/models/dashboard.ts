import { model } from "@medusajs/framework/utils";

const Dashboard = model.define("dashboard", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  slug: model.text(),
  widgets: model.json().nullable(),
  layout: model.json().nullable(),
  is_default: model.boolean().default(false),
  role_access: model.json().nullable(),
  metadata: model.json().nullable(),
});

export default Dashboard;
