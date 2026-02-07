import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260207115807 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "quote" ("id" text not null, "quote_number" text not null, "company_id" text not null, "customer_id" text not null, "cart_id" text null, "draft_order_id" text null, "tenant_id" text not null, "store_id" text null, "region_id" text null, "status" text check ("status" in ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'accepted', 'declined', 'expired')) not null default 'draft', "subtotal" numeric not null default '0', "discount_total" numeric not null default '0', "tax_total" numeric not null default '0', "shipping_total" numeric not null default '0', "total" numeric not null default '0', "currency_code" text not null default 'usd', "custom_discount_percentage" integer null, "custom_discount_amount" numeric null, "discount_reason" text null, "valid_from" timestamptz null, "valid_until" timestamptz null, "reviewed_by" text null, "reviewed_at" timestamptz null, "rejection_reason" text null, "accepted_at" timestamptz null, "declined_at" timestamptz null, "declined_reason" text null, "customer_notes" text null, "internal_notes" text null, "metadata" jsonb null, "raw_subtotal" jsonb not null default '{"value":"0","precision":20}', "raw_discount_total" jsonb not null default '{"value":"0","precision":20}', "raw_tax_total" jsonb not null default '{"value":"0","precision":20}', "raw_shipping_total" jsonb not null default '{"value":"0","precision":20}', "raw_total" jsonb not null default '{"value":"0","precision":20}', "raw_custom_discount_amount" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "quote_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_quote_deleted_at" ON "quote" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "quote_item" ("id" text not null, "quote_id" text not null, "product_id" text not null, "variant_id" text not null, "title" text not null, "description" text null, "sku" text null, "thumbnail" text null, "quantity" integer not null, "unit_price" numeric not null, "custom_unit_price" numeric null, "subtotal" numeric not null, "discount_total" numeric not null default '0', "tax_total" numeric not null default '0', "total" numeric not null, "discount_percentage" integer null, "discount_reason" text null, "metadata" jsonb null, "raw_unit_price" jsonb not null, "raw_custom_unit_price" jsonb null, "raw_subtotal" jsonb not null, "raw_discount_total" jsonb not null default '{"value":"0","precision":20}', "raw_tax_total" jsonb not null default '{"value":"0","precision":20}', "raw_total" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "quote_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_quote_item_deleted_at" ON "quote_item" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "quote" cascade;`);

    this.addSql(`drop table if exists "quote_item" cascade;`);
  }

}
