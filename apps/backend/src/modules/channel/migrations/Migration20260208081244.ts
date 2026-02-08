import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208081244 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "sales_channel_mapping" ("id" text not null, "tenant_id" text not null, "channel_type" text check ("channel_type" in ('web', 'mobile', 'api', 'kiosk', 'internal')) not null, "medusa_sales_channel_id" text null, "name" text not null, "description" text null, "node_id" text null, "config" jsonb null, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "sales_channel_mapping_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_sales_channel_mapping_deleted_at" ON "sales_channel_mapping" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_sales_channel_mapping_tenant_id" ON "sales_channel_mapping" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_sales_channel_mapping_tenant_id_channel_type" ON "sales_channel_mapping" ("tenant_id", "channel_type") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_sales_channel_mapping_medusa_sales_channel_id" ON "sales_channel_mapping" ("medusa_sales_channel_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_sales_channel_mapping_node_id" ON "sales_channel_mapping" ("node_id") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "sales_channel_mapping" cascade;`);
  }

}
