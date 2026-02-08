import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208150022 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "ad_account" ("id" text not null, "tenant_id" text not null, "advertiser_id" text not null, "account_name" text not null, "balance" numeric not null default 0, "currency_code" text not null, "total_spent" numeric not null default 0, "total_deposited" numeric not null default 0, "status" text check ("status" in ('active', 'suspended', 'closed')) not null default 'active', "auto_recharge" boolean not null default false, "auto_recharge_amount" numeric null, "auto_recharge_threshold" numeric null, "metadata" jsonb null, "raw_balance" jsonb not null default '{"value":"0","precision":20}', "raw_total_spent" jsonb not null default '{"value":"0","precision":20}', "raw_total_deposited" jsonb not null default '{"value":"0","precision":20}', "raw_auto_recharge_amount" jsonb null, "raw_auto_recharge_threshold" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "ad_account_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ad_account_deleted_at" ON "ad_account" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "ad_campaign" ("id" text not null, "tenant_id" text not null, "advertiser_id" text not null, "name" text not null, "description" text null, "campaign_type" text check ("campaign_type" in ('sponsored_listing', 'banner', 'search', 'social', 'email')) not null, "status" text check ("status" in ('draft', 'pending_review', 'active', 'paused', 'completed', 'rejected')) not null default 'draft', "budget" numeric not null, "spent" numeric not null default 0, "currency_code" text not null, "daily_budget" numeric null, "bid_type" text check ("bid_type" in ('cpc', 'cpm', 'cpa', 'flat')) not null default 'cpc', "bid_amount" numeric null, "targeting" jsonb null, "starts_at" timestamptz null, "ends_at" timestamptz null, "total_impressions" integer not null default 0, "total_clicks" integer not null default 0, "total_conversions" integer not null default 0, "metadata" jsonb null, "raw_budget" jsonb not null, "raw_spent" jsonb not null default '{"value":"0","precision":20}', "raw_daily_budget" jsonb null, "raw_bid_amount" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "ad_campaign_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ad_campaign_deleted_at" ON "ad_campaign" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "ad_creative" ("id" text not null, "tenant_id" text not null, "campaign_id" text not null, "placement_id" text null, "creative_type" text check ("creative_type" in ('image', 'video', 'text', 'html', 'product_card')) not null, "title" text null, "body_text" text null, "image_url" text null, "video_url" text null, "click_url" text not null, "cta_text" text null, "product_ids" jsonb null, "is_approved" boolean not null default false, "approved_by" text null, "approved_at" timestamptz null, "rejection_reason" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "ad_creative_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ad_creative_deleted_at" ON "ad_creative" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "ad_placement" ("id" text not null, "tenant_id" text not null, "name" text not null, "placement_type" text check ("placement_type" in ('homepage_banner', 'category_page', 'search_results', 'product_page', 'sidebar', 'footer', 'email', 'push')) not null, "dimensions" jsonb null, "max_ads" integer not null default 1, "price_per_day" numeric null, "currency_code" text null, "is_active" boolean not null default true, "metadata" jsonb null, "raw_price_per_day" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "ad_placement_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ad_placement_deleted_at" ON "ad_placement" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "impression_log" ("id" text not null, "tenant_id" text not null, "campaign_id" text not null, "creative_id" text not null, "placement_id" text null, "viewer_id" text null, "impression_type" text check ("impression_type" in ('view', 'click', 'conversion')) not null, "ip_address" text null, "user_agent" text null, "referrer" text null, "revenue" numeric null, "currency_code" text null, "occurred_at" timestamptz not null, "metadata" jsonb null, "raw_revenue" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "impression_log_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_impression_log_deleted_at" ON "impression_log" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "ad_account" cascade;`);

    this.addSql(`drop table if exists "ad_campaign" cascade;`);

    this.addSql(`drop table if exists "ad_creative" cascade;`);

    this.addSql(`drop table if exists "ad_placement" cascade;`);

    this.addSql(`drop table if exists "impression_log" cascade;`);
  }

}
