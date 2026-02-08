import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208150009 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "warranty_claim" drop constraint if exists "warranty_claim_claim_number_unique";`);
    this.addSql(`alter table if exists "spare_part" drop constraint if exists "spare_part_sku_unique";`);
    this.addSql(`create table if not exists "repair_order" ("id" text not null, "tenant_id" text not null, "claim_id" text not null, "service_center_id" text null, "status" text check ("status" in ('created', 'received', 'diagnosing', 'repairing', 'testing', 'ready', 'shipped', 'completed')) not null default 'created', "diagnosis" text null, "repair_notes" text null, "parts_used" jsonb null, "estimated_cost" numeric null, "actual_cost" numeric null, "currency_code" text not null, "estimated_completion" timestamptz null, "completed_at" timestamptz null, "tracking_number" text null, "metadata" jsonb null, "raw_estimated_cost" jsonb null, "raw_actual_cost" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "repair_order_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_repair_order_deleted_at" ON "repair_order" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "service_center" ("id" text not null, "tenant_id" text not null, "name" text not null, "address_line1" text not null, "address_line2" text null, "city" text not null, "state" text null, "postal_code" text not null, "country_code" text not null, "phone" text null, "email" text null, "specializations" jsonb null, "is_active" boolean not null default true, "capacity_per_day" integer null, "current_load" integer not null default 0, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "service_center_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_center_deleted_at" ON "service_center" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "spare_part" ("id" text not null, "tenant_id" text not null, "name" text not null, "sku" text not null, "description" text null, "compatible_products" jsonb null, "price" numeric not null, "currency_code" text not null, "stock_quantity" integer not null default 0, "reorder_level" integer not null default 5, "supplier" text null, "is_active" boolean not null default true, "metadata" jsonb null, "raw_price" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "spare_part_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_spare_part_sku_unique" ON "spare_part" ("sku") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_spare_part_deleted_at" ON "spare_part" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "warranty_claim" ("id" text not null, "tenant_id" text not null, "plan_id" text null, "customer_id" text not null, "order_id" text not null, "product_id" text not null, "claim_number" text not null, "issue_description" text not null, "evidence_urls" jsonb null, "status" text check ("status" in ('submitted', 'reviewing', 'approved', 'in_repair', 'replaced', 'denied', 'closed')) not null default 'submitted', "resolution_type" text check ("resolution_type" in ('repair', 'replace', 'refund', 'credit')) null, "resolution_notes" text null, "approved_at" timestamptz null, "resolved_at" timestamptz null, "denied_reason" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "warranty_claim_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_warranty_claim_claim_number_unique" ON "warranty_claim" ("claim_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_warranty_claim_deleted_at" ON "warranty_claim" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "warranty_plan" ("id" text not null, "tenant_id" text not null, "name" text not null, "description" text null, "plan_type" text check ("plan_type" in ('standard', 'extended', 'premium', 'accidental')) not null, "duration_months" integer not null, "price" numeric null, "currency_code" text not null, "coverage" jsonb not null, "exclusions" jsonb null, "is_active" boolean not null default true, "metadata" jsonb null, "raw_price" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "warranty_plan_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_warranty_plan_deleted_at" ON "warranty_plan" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "repair_order" cascade;`);

    this.addSql(`drop table if exists "service_center" cascade;`);

    this.addSql(`drop table if exists "spare_part" cascade;`);

    this.addSql(`drop table if exists "warranty_claim" cascade;`);

    this.addSql(`drop table if exists "warranty_plan" cascade;`);
  }

}
