import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260220000020 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "pod_product" (
        "id"                    TEXT NOT NULL PRIMARY KEY,
        "title"                 TEXT NOT NULL,
        "description"           TEXT,
        "product_id"            TEXT,
        "template_url"          TEXT NOT NULL,
        "print_provider"        TEXT,
        "customization_options" JSONB,
        "base_cost"             NUMERIC NOT NULL DEFAULT 0,
        "retail_price"          NUMERIC NOT NULL DEFAULT 0,
        "status"                TEXT NOT NULL DEFAULT 'active',
        "tenant_id"             TEXT,
        "metadata"              JSONB,
        "created_at"            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at"            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at"            TIMESTAMPTZ
      );
    `);

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_pod_product_tenant_id" ON "pod_product" ("tenant_id");`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_pod_product_status" ON "pod_product" ("status");`,
    );

    this.addSql(`
      CREATE TABLE IF NOT EXISTS "pod_order" (
        "id"                 TEXT NOT NULL PRIMARY KEY,
        "order_id"           TEXT NOT NULL,
        "pod_product_id"     TEXT NOT NULL,
        "customization_data" JSONB,
        "print_status"       TEXT NOT NULL DEFAULT 'queued',
        "tracking_number"    TEXT,
        "quantity"           INTEGER NOT NULL DEFAULT 1,
        "unit_cost"          NUMERIC,
        "metadata"           JSONB,
        "created_at"         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at"         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at"         TIMESTAMPTZ
      );
    `);

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_pod_order_order_id" ON "pod_order" ("order_id");`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_pod_order_print_status" ON "pod_order" ("print_status");`,
    );
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "pod_order";`);
    this.addSql(`DROP TABLE IF EXISTS "pod_product";`);
  }
}
