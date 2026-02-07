import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260207115810 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "commission_rule" ("id" text not null, "tenant_id" text not null, "store_id" text null, "vendor_id" text null, "priority" integer not null default 0, "name" text not null, "description" text null, "commission_type" text check ("commission_type" in ('percentage', 'flat', 'tiered_percentage', 'tiered_flat', 'hybrid')) not null, "commission_percentage" integer null, "commission_flat_amount" numeric null, "tiers" jsonb null, "conditions" jsonb null, "valid_from" timestamptz null, "valid_to" timestamptz null, "status" text check ("status" in ('active', 'inactive', 'scheduled')) not null default 'active', "applies_to" text check ("applies_to" in ('all_products', 'specific_categories', 'specific_products', 'specific_collections')) not null default 'all_products', "metadata" jsonb null, "raw_commission_flat_amount" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "commission_rule_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_commission_rule_deleted_at" ON "commission_rule" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "commission_transaction" ("id" text not null, "tenant_id" text not null, "store_id" text null, "vendor_id" text not null, "order_id" text not null, "line_item_id" text null, "commission_rule_id" text null, "payout_id" text null, "transaction_type" text check ("transaction_type" in ('sale', 'refund', 'adjustment', 'reversal')) not null default 'sale', "order_subtotal" numeric not null, "order_tax" numeric not null default 0, "order_shipping" numeric not null default 0, "order_total" numeric not null, "commission_rate" integer not null, "commission_flat" numeric null, "commission_amount" numeric not null, "platform_fee_rate" integer null, "platform_fee_amount" numeric null, "net_amount" numeric not null, "status" text check ("status" in ('pending', 'approved', 'paid', 'reversed', 'disputed')) not null default 'pending', "payout_status" text check ("payout_status" in ('unpaid', 'pending_payout', 'paid', 'failed')) not null default 'unpaid', "transaction_date" timestamptz not null, "approved_at" timestamptz null, "paid_at" timestamptz null, "notes" text null, "metadata" jsonb null, "raw_order_subtotal" jsonb not null, "raw_order_tax" jsonb not null default '{"value":"0","precision":20}', "raw_order_shipping" jsonb not null default '{"value":"0","precision":20}', "raw_order_total" jsonb not null, "raw_commission_flat" jsonb null, "raw_commission_amount" jsonb not null, "raw_platform_fee_amount" jsonb null, "raw_net_amount" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "commission_transaction_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_commission_transaction_deleted_at" ON "commission_transaction" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "commission_rule" cascade;`);

    this.addSql(`drop table if exists "commission_transaction" cascade;`);
  }

}
