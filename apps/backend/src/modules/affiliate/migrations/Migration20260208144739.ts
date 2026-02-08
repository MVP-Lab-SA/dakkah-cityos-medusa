import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208144739 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "referral_link" drop constraint if exists "referral_link_code_unique";`);
    this.addSql(`create table if not exists "affiliate" ("id" text not null, "tenant_id" text not null, "customer_id" text null, "name" text not null, "email" text not null, "affiliate_type" text check ("affiliate_type" in ('standard', 'influencer', 'partner', 'ambassador')) not null, "status" text check ("status" in ('pending', 'approved', 'active', 'suspended', 'terminated')) not null default 'pending', "commission_rate" integer not null, "commission_type" text check ("commission_type" in ('percentage', 'flat')) not null default 'percentage', "payout_method" text check ("payout_method" in ('bank_transfer', 'paypal', 'store_credit')) not null default 'bank_transfer', "payout_minimum" numeric not null default 5000, "total_earnings" numeric not null default 0, "total_paid" numeric not null default 0, "total_clicks" integer not null default 0, "total_conversions" integer not null default 0, "bio" text null, "social_links" jsonb null, "metadata" jsonb null, "raw_payout_minimum" jsonb not null default '{"value":"5000","precision":20}', "raw_total_earnings" jsonb not null default '{"value":"0","precision":20}', "raw_total_paid" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "affiliate_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_affiliate_deleted_at" ON "affiliate" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "affiliate_commission" ("id" text not null, "tenant_id" text not null, "affiliate_id" text not null, "order_id" text not null, "click_id" text null, "order_amount" numeric not null, "commission_amount" numeric not null, "currency_code" text not null, "status" text check ("status" in ('pending', 'approved', 'paid', 'rejected')) not null default 'pending', "approved_at" timestamptz null, "paid_at" timestamptz null, "payout_id" text null, "metadata" jsonb null, "raw_order_amount" jsonb not null, "raw_commission_amount" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "affiliate_commission_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_affiliate_commission_deleted_at" ON "affiliate_commission" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "click_tracking" ("id" text not null, "tenant_id" text not null, "link_id" text not null, "affiliate_id" text not null, "ip_address" text null, "user_agent" text null, "referrer" text null, "landed_at" timestamptz not null, "converted" boolean not null default false, "conversion_order_id" text null, "conversion_amount" numeric null, "metadata" jsonb null, "raw_conversion_amount" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "click_tracking_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_click_tracking_deleted_at" ON "click_tracking" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "influencer_campaign" ("id" text not null, "tenant_id" text not null, "name" text not null, "description" text null, "affiliate_id" text not null, "status" text check ("status" in ('draft', 'active', 'paused', 'completed')) not null default 'draft', "campaign_type" text check ("campaign_type" in ('sponsored_post', 'review', 'unboxing', 'tutorial', 'giveaway')) not null, "budget" numeric null, "currency_code" text not null, "starts_at" timestamptz null, "ends_at" timestamptz null, "deliverables" jsonb null, "performance_metrics" jsonb null, "metadata" jsonb null, "raw_budget" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "influencer_campaign_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_influencer_campaign_deleted_at" ON "influencer_campaign" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "referral_link" ("id" text not null, "tenant_id" text not null, "affiliate_id" text not null, "code" text not null, "target_url" text not null, "campaign_name" text null, "is_active" boolean not null default true, "total_clicks" integer not null default 0, "total_conversions" integer not null default 0, "total_revenue" numeric not null default 0, "metadata" jsonb null, "raw_total_revenue" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "referral_link_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_referral_link_code_unique" ON "referral_link" ("code") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_referral_link_deleted_at" ON "referral_link" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "affiliate" cascade;`);

    this.addSql(`drop table if exists "affiliate_commission" cascade;`);

    this.addSql(`drop table if exists "click_tracking" cascade;`);

    this.addSql(`drop table if exists "influencer_campaign" cascade;`);

    this.addSql(`drop table if exists "referral_link" cascade;`);
  }

}
