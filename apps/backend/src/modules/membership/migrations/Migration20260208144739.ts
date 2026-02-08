import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208144739 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "membership" drop constraint if exists "membership_membership_number_unique";`);
    this.addSql(`create table if not exists "membership" ("id" text not null, "tenant_id" text not null, "customer_id" text not null, "tier_id" text not null, "membership_number" text not null, "status" text check ("status" in ('active', 'expired', 'suspended', 'cancelled')) not null default 'active', "joined_at" timestamptz not null, "expires_at" timestamptz null, "renewed_at" timestamptz null, "total_points" integer not null default 0, "lifetime_points" integer not null default 0, "total_spent" numeric not null default 0, "auto_renew" boolean not null default true, "metadata" jsonb null, "raw_total_spent" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "membership_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_membership_membership_number_unique" ON "membership" ("membership_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_membership_deleted_at" ON "membership" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "membership_tier" ("id" text not null, "tenant_id" text not null, "name" text not null, "description" text null, "tier_level" integer not null, "min_points" integer not null default 0, "annual_fee" numeric null, "currency_code" text null, "benefits" jsonb null, "perks" jsonb null, "upgrade_threshold" integer null, "downgrade_threshold" integer null, "color_code" text null, "icon_url" text null, "is_active" boolean not null default true, "metadata" jsonb null, "raw_annual_fee" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "membership_tier_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_membership_tier_deleted_at" ON "membership_tier" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "points_ledger" ("id" text not null, "tenant_id" text not null, "membership_id" text not null, "transaction_type" text check ("transaction_type" in ('earn', 'redeem', 'expire', 'adjust', 'bonus', 'transfer')) not null, "points" integer not null, "balance_after" integer not null, "source" text check ("source" in ('purchase', 'review', 'referral', 'promotion', 'manual', 'birthday', 'sign_up')) not null, "reference_type" text null, "reference_id" text null, "description" text null, "expires_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "points_ledger_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_points_ledger_deleted_at" ON "points_ledger" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "redemption" ("id" text not null, "tenant_id" text not null, "membership_id" text not null, "reward_id" text not null, "points_spent" integer not null, "status" text check ("status" in ('pending', 'fulfilled', 'cancelled', 'expired')) not null default 'pending', "redemption_code" text null, "fulfilled_at" timestamptz null, "expires_at" timestamptz null, "order_id" text null, "notes" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "redemption_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_redemption_deleted_at" ON "redemption" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "reward" ("id" text not null, "tenant_id" text not null, "name" text not null, "description" text null, "reward_type" text check ("reward_type" in ('discount', 'product', 'service', 'experience', 'cashback', 'upgrade')) not null, "points_required" integer not null, "value" numeric null, "currency_code" text null, "available_quantity" integer null, "redeemed_count" integer not null default 0, "min_tier_level" integer not null default 0, "is_active" boolean not null default true, "valid_from" timestamptz null, "valid_until" timestamptz null, "image_url" text null, "metadata" jsonb null, "raw_value" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "reward_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reward_deleted_at" ON "reward" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "membership" cascade;`);

    this.addSql(`drop table if exists "membership_tier" cascade;`);

    this.addSql(`drop table if exists "points_ledger" cascade;`);

    this.addSql(`drop table if exists "redemption" cascade;`);

    this.addSql(`drop table if exists "reward" cascade;`);
  }

}
