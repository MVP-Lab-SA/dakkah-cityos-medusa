import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208150004 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "damage_claim" ("id" text not null, "tenant_id" text not null, "agreement_id" text not null, "return_id" text null, "description" text not null, "evidence_urls" jsonb null, "estimated_cost" numeric null, "actual_cost" numeric null, "currency_code" text not null, "status" text check ("status" in ('filed', 'reviewing', 'approved', 'denied', 'resolved')) not null default 'filed', "resolution_notes" text null, "resolved_at" timestamptz null, "metadata" jsonb null, "raw_estimated_cost" jsonb null, "raw_actual_cost" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "damage_claim_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_damage_claim_deleted_at" ON "damage_claim" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "rental_agreement" ("id" text not null, "tenant_id" text not null, "rental_product_id" text not null, "customer_id" text not null, "order_id" text null, "status" text check ("status" in ('pending', 'active', 'overdue', 'returned', 'cancelled')) not null default 'pending', "start_date" timestamptz not null, "end_date" timestamptz not null, "actual_return_date" timestamptz null, "total_price" numeric not null, "deposit_paid" numeric null, "deposit_refunded" numeric null, "late_fees" numeric null, "currency_code" text not null, "terms_accepted" boolean not null default false, "notes" text null, "metadata" jsonb null, "raw_total_price" jsonb not null, "raw_deposit_paid" jsonb null, "raw_deposit_refunded" jsonb null, "raw_late_fees" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rental_agreement_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rental_agreement_deleted_at" ON "rental_agreement" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "rental_period" ("id" text not null, "tenant_id" text not null, "rental_product_id" text not null, "period_type" text check ("period_type" in ('peak', 'off_peak', 'holiday', 'custom')) not null, "start_date" timestamptz not null, "end_date" timestamptz not null, "price_multiplier" integer not null default 1, "is_blocked" boolean not null default false, "reason" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rental_period_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rental_period_deleted_at" ON "rental_period" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "rental_product" ("id" text not null, "tenant_id" text not null, "product_id" text not null, "rental_type" text check ("rental_type" in ('daily', 'weekly', 'monthly', 'hourly', 'custom')) not null, "base_price" numeric not null, "currency_code" text not null, "deposit_amount" numeric null, "late_fee_per_day" numeric null, "min_duration" integer not null default 1, "max_duration" integer null, "is_available" boolean not null default true, "condition_on_listing" text check ("condition_on_listing" in ('new', 'like_new', 'good', 'fair')) not null default 'new', "total_rentals" integer not null default 0, "metadata" jsonb null, "raw_base_price" jsonb not null, "raw_deposit_amount" jsonb null, "raw_late_fee_per_day" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rental_product_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rental_product_deleted_at" ON "rental_product" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "rental_return" ("id" text not null, "tenant_id" text not null, "agreement_id" text not null, "inspected_by" text null, "condition_on_return" text check ("condition_on_return" in ('excellent', 'good', 'fair', 'poor', 'damaged')) not null, "inspection_notes" text null, "damage_description" text null, "damage_fee" numeric null, "deposit_deduction" numeric null, "deposit_refund" numeric null, "returned_at" timestamptz not null, "metadata" jsonb null, "raw_damage_fee" jsonb null, "raw_deposit_deduction" jsonb null, "raw_deposit_refund" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rental_return_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rental_return_deleted_at" ON "rental_return" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "damage_claim" cascade;`);

    this.addSql(`drop table if exists "rental_agreement" cascade;`);

    this.addSql(`drop table if exists "rental_period" cascade;`);

    this.addSql(`drop table if exists "rental_product" cascade;`);

    this.addSql(`drop table if exists "rental_return" cascade;`);
  }

}
