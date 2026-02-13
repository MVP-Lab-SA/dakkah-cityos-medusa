import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260213170004 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "cart_metadata" ("id" text not null, "cart_id" text not null, "tenant_id" text not null, "gift_wrap" boolean not null default false, "gift_message" text null, "delivery_instructions" text null, "preferred_delivery_date" timestamptz null, "special_handling" text null, "source_channel" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cart_metadata_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cart_metadata_deleted_at" ON "cart_metadata" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cart_metadata_tenant_id" ON "cart_metadata" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cart_metadata_cart_id_unique" ON "cart_metadata" ("cart_id") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "cart_metadata" cascade;`);
  }

}
