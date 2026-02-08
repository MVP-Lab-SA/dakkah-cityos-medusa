import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208150016 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "batch_tracking" ("id" text not null, "tenant_id" text not null, "product_id" text not null, "batch_number" text not null, "supplier" text null, "received_date" timestamptz not null, "expiry_date" timestamptz not null, "quantity_received" integer not null, "quantity_remaining" integer not null, "unit_cost" numeric null, "currency_code" text null, "status" text check ("status" in ('active', 'low_stock', 'expiring_soon', 'expired', 'recalled')) not null default 'active', "storage_location" text null, "temperature_log" jsonb null, "metadata" jsonb null, "raw_unit_cost" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "batch_tracking_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_batch_tracking_deleted_at" ON "batch_tracking" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "delivery_slot" ("id" text not null, "tenant_id" text not null, "slot_date" timestamptz not null, "start_time" text not null, "end_time" text not null, "slot_type" text check ("slot_type" in ('standard', 'express', 'scheduled')) not null, "max_orders" integer not null, "current_orders" integer not null default 0, "delivery_fee" numeric null, "currency_code" text null, "is_available" boolean not null default true, "cutoff_time" text null, "metadata" jsonb null, "raw_delivery_fee" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "delivery_slot_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_delivery_slot_deleted_at" ON "delivery_slot" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "fresh_product" ("id" text not null, "tenant_id" text not null, "product_id" text not null, "storage_type" text check ("storage_type" in ('ambient', 'chilled', 'frozen', 'live')) not null, "shelf_life_days" integer not null, "optimal_temp_min" integer null, "optimal_temp_max" integer null, "origin_country" text null, "organic" boolean not null default false, "unit_type" text check ("unit_type" in ('piece', 'kg', 'gram', 'liter', 'bunch', 'pack')) not null, "min_order_quantity" integer not null default 1, "is_seasonal" boolean not null default false, "season_start" text null, "season_end" text null, "nutrition_info" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fresh_product_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_fresh_product_deleted_at" ON "fresh_product" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "substitution_rule" ("id" text not null, "tenant_id" text not null, "original_product_id" text not null, "substitute_product_id" text not null, "priority" integer not null default 0, "is_auto_substitute" boolean not null default false, "price_match" boolean not null default true, "max_price_difference_pct" integer null, "customer_approval_required" boolean not null default true, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "substitution_rule_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_substitution_rule_deleted_at" ON "substitution_rule" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "batch_tracking" cascade;`);

    this.addSql(`drop table if exists "delivery_slot" cascade;`);

    this.addSql(`drop table if exists "fresh_product" cascade;`);

    this.addSql(`drop table if exists "substitution_rule" cascade;`);
  }

}
