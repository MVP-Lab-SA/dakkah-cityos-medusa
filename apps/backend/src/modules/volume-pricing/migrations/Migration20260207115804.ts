import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260207115804 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "volume_pricing" ("id" text not null, "name" text not null, "description" text null, "applies_to" text check ("applies_to" in ('product', 'variant', 'collection', 'category', 'all')) not null, "target_id" text null, "pricing_type" text check ("pricing_type" in ('percentage', 'fixed', 'fixed_price')) not null, "company_id" text null, "company_tier" text null, "tenant_id" text not null, "store_id" text null, "region_id" text null, "priority" integer not null default 0, "status" text check ("status" in ('active', 'inactive', 'scheduled')) not null default 'active', "starts_at" timestamptz null, "ends_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "volume_pricing_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_volume_pricing_deleted_at" ON "volume_pricing" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "volume_pricing_tier" ("id" text not null, "volume_pricing_id" text not null, "min_quantity" integer not null, "max_quantity" integer null, "discount_percentage" integer null, "discount_amount" numeric null, "fixed_price" numeric null, "currency_code" text not null default 'usd', "metadata" jsonb null, "raw_discount_amount" jsonb null, "raw_fixed_price" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "volume_pricing_tier_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_volume_pricing_tier_deleted_at" ON "volume_pricing_tier" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "volume_pricing" cascade;`);

    this.addSql(`drop table if exists "volume_pricing_tier" cascade;`);
  }

}
