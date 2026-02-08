import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208144739 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "backer" ("id" text not null, "tenant_id" text not null, "campaign_id" text not null, "customer_id" text not null, "total_pledged" numeric not null default 0, "currency_code" text not null, "pledge_count" integer not null default 1, "is_repeat_backer" boolean not null default false, "first_backed_at" timestamptz not null, "metadata" jsonb null, "raw_total_pledged" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "backer_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_backer_deleted_at" ON "backer" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "campaign_update" ("id" text not null, "tenant_id" text not null, "campaign_id" text not null, "title" text not null, "content" text not null, "update_type" text check ("update_type" in ('general', 'milestone', 'stretch_goal', 'shipping', 'delay')) not null, "is_public" boolean not null default true, "media_urls" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "campaign_update_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_campaign_update_deleted_at" ON "campaign_update" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "crowdfund_campaign" ("id" text not null, "tenant_id" text not null, "creator_id" text not null, "title" text not null, "description" text not null, "short_description" text null, "campaign_type" text check ("campaign_type" in ('reward', 'equity', 'donation', 'debt')) not null, "status" text check ("status" in ('draft', 'pending_review', 'active', 'funded', 'failed', 'cancelled')) not null default 'draft', "goal_amount" numeric not null, "raised_amount" numeric not null default 0, "currency_code" text not null, "backer_count" integer not null default 0, "starts_at" timestamptz null, "ends_at" timestamptz not null, "is_flexible_funding" boolean not null default false, "category" text null, "images" jsonb null, "video_url" text null, "risks_and_challenges" text null, "metadata" jsonb null, "raw_goal_amount" jsonb not null, "raw_raised_amount" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "crowdfund_campaign_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_crowdfund_campaign_deleted_at" ON "crowdfund_campaign" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "pledge" ("id" text not null, "tenant_id" text not null, "campaign_id" text not null, "backer_id" text not null, "reward_tier_id" text null, "amount" numeric not null, "currency_code" text not null, "status" text check ("status" in ('pending', 'confirmed', 'fulfilled', 'refunded', 'cancelled')) not null default 'pending', "payment_reference" text null, "anonymous" boolean not null default false, "message" text null, "fulfilled_at" timestamptz null, "refunded_at" timestamptz null, "metadata" jsonb null, "raw_amount" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "pledge_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_pledge_deleted_at" ON "pledge" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "reward_tier" ("id" text not null, "tenant_id" text not null, "campaign_id" text not null, "title" text not null, "description" text null, "pledge_amount" numeric not null, "currency_code" text not null, "quantity_available" integer null, "quantity_claimed" integer not null default 0, "estimated_delivery" timestamptz null, "includes" jsonb null, "shipping_type" text check ("shipping_type" in ('none', 'domestic', 'international')) not null default 'none', "image_url" text null, "is_active" boolean not null default true, "metadata" jsonb null, "raw_pledge_amount" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "reward_tier_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reward_tier_deleted_at" ON "reward_tier" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "backer" cascade;`);

    this.addSql(`drop table if exists "campaign_update" cascade;`);

    this.addSql(`drop table if exists "crowdfund_campaign" cascade;`);

    this.addSql(`drop table if exists "pledge" cascade;`);

    this.addSql(`drop table if exists "reward_tier" cascade;`);
  }

}
