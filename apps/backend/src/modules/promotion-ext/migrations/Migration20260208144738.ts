import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208144738 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "referral" drop constraint if exists "referral_referral_code_unique";`);
    this.addSql(`alter table if exists "product_bundle" drop constraint if exists "product_bundle_handle_unique";`);
    this.addSql(`alter table if exists "gift_card_ext" drop constraint if exists "gift_card_ext_code_unique";`);
    this.addSql(`create table if not exists "customer_segment" ("id" text not null, "tenant_id" text not null, "name" text not null, "description" text null, "segment_type" text check ("segment_type" in ('manual', 'dynamic')) not null, "rules" jsonb null, "customer_count" integer not null default 0, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_segment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_segment_deleted_at" ON "customer_segment" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "gift_card_ext" ("id" text not null, "tenant_id" text not null, "code" text not null, "initial_value" numeric not null, "remaining_value" numeric not null, "currency_code" text not null, "sender_name" text null, "sender_email" text null, "recipient_name" text null, "recipient_email" text null, "message" text null, "delivered_at" timestamptz null, "expires_at" timestamptz null, "is_active" boolean not null default true, "metadata" jsonb null, "raw_initial_value" jsonb not null, "raw_remaining_value" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "gift_card_ext_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_gift_card_ext_code_unique" ON "gift_card_ext" ("code") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_gift_card_ext_deleted_at" ON "gift_card_ext" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "loyalty_points_ledger" ("id" text not null, "tenant_id" text not null, "customer_id" text not null, "program_id" text not null, "transaction_type" text check ("transaction_type" in ('earn', 'redeem', 'expire', 'adjust', 'bonus')) not null, "points" integer not null, "balance_after" integer not null, "reference_type" text null, "reference_id" text null, "description" text null, "expires_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "loyalty_points_ledger_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_loyalty_points_ledger_deleted_at" ON "loyalty_points_ledger" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "loyalty_program" ("id" text not null, "tenant_id" text not null, "name" text not null, "description" text not null, "points_per_currency" integer not null default 1, "currency_code" text not null, "tier_config" jsonb not null, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "loyalty_program_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_loyalty_program_deleted_at" ON "loyalty_program" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "product_bundle" ("id" text not null, "tenant_id" text not null, "title" text not null, "handle" text not null, "description" text null, "bundle_type" text check ("bundle_type" in ('fixed', 'mix_and_match', 'bogo')) not null, "discount_type" text check ("discount_type" in ('percentage', 'flat', 'special_price')) not null, "discount_value" integer not null, "min_items" integer not null default 1, "max_items" integer null, "is_active" boolean not null default true, "starts_at" timestamptz null, "ends_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_bundle_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_bundle_handle_unique" ON "product_bundle" ("handle") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_bundle_deleted_at" ON "product_bundle" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "referral" ("id" text not null, "tenant_id" text not null, "referrer_customer_id" text not null, "referred_customer_id" text null, "referral_code" text not null, "status" text check ("status" in ('pending', 'completed', 'expired', 'revoked')) not null default 'pending', "reward_type" text check ("reward_type" in ('points', 'discount', 'credit')) not null, "reward_value" integer not null, "reward_given" boolean not null default false, "expires_at" timestamptz null, "completed_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "referral_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_referral_referral_code_unique" ON "referral" ("referral_code") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_referral_deleted_at" ON "referral" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "wishlist" ("id" text not null, "tenant_id" text not null, "customer_id" text not null, "name" text not null default 'My Wishlist', "is_public" boolean not null default false, "is_default" boolean not null default false, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "wishlist_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_wishlist_deleted_at" ON "wishlist" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "wishlist_item" ("id" text not null, "wishlist_id" text not null, "product_id" text not null, "variant_id" text null, "added_price" numeric null, "notes" text null, "priority" integer not null default 0, "metadata" jsonb null, "raw_added_price" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "wishlist_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_wishlist_item_deleted_at" ON "wishlist_item" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "customer_segment" cascade;`);

    this.addSql(`drop table if exists "gift_card_ext" cascade;`);

    this.addSql(`drop table if exists "loyalty_points_ledger" cascade;`);

    this.addSql(`drop table if exists "loyalty_program" cascade;`);

    this.addSql(`drop table if exists "product_bundle" cascade;`);

    this.addSql(`drop table if exists "referral" cascade;`);

    this.addSql(`drop table if exists "wishlist" cascade;`);

    this.addSql(`drop table if exists "wishlist_item" cascade;`);
  }

}
