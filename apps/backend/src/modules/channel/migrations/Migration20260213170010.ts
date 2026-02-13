import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260213170010 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "service_channel" ("id" text not null, "tenant_id" text not null, "name" text not null, "type" text check ("type" in ('marketplace', 'service', 'booking', 'subscription', 'rental', 'auction')) not null, "description" text null, "sales_channel_id" text null, "config" jsonb null, "vertical" text null, "node_id" text null, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "service_channel_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_channel_deleted_at" ON "service_channel" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_channel_tenant_id" ON "service_channel" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_channel_type" ON "service_channel" ("type") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_channel_sales_channel_id" ON "service_channel" ("sales_channel_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_channel_vertical" ON "service_channel" ("vertical") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_channel_node_id" ON "service_channel" ("node_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_channel_is_active" ON "service_channel" ("is_active") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "service_channel" cascade;`);
  }

}
