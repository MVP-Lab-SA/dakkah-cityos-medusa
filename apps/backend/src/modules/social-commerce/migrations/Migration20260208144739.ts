import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208144739 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "group_buy" ("id" text not null, "tenant_id" text not null, "product_id" text not null, "organizer_id" text null, "title" text not null, "description" text null, "status" text check ("status" in ('forming', 'active', 'succeeded', 'failed', 'cancelled')) not null default 'forming', "target_quantity" integer not null, "current_quantity" integer not null default 0, "original_price" numeric not null, "group_price" numeric not null, "currency_code" text not null, "min_participants" integer not null default 2, "max_participants" integer null, "starts_at" timestamptz not null, "ends_at" timestamptz not null, "metadata" jsonb null, "raw_original_price" jsonb not null, "raw_group_price" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "group_buy_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_group_buy_deleted_at" ON "group_buy" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "live_product" ("id" text not null, "tenant_id" text not null, "stream_id" text not null, "product_id" text not null, "variant_id" text null, "featured_at" timestamptz null, "flash_price" numeric null, "flash_quantity" integer null, "flash_sold" integer not null default 0, "currency_code" text not null, "display_order" integer not null default 0, "is_active" boolean not null default true, "metadata" jsonb null, "raw_flash_price" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "live_product_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_live_product_deleted_at" ON "live_product" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "live_stream" ("id" text not null, "tenant_id" text not null, "host_id" text not null, "title" text not null, "description" text null, "status" text check ("status" in ('scheduled', 'live', 'ended', 'cancelled')) not null default 'scheduled', "stream_url" text null, "platform" text check ("platform" in ('internal', 'instagram', 'tiktok', 'youtube', 'facebook')) not null default 'internal', "scheduled_at" timestamptz null, "started_at" timestamptz null, "ended_at" timestamptz null, "viewer_count" integer not null default 0, "peak_viewers" integer not null default 0, "total_sales" numeric not null default 0, "total_orders" integer not null default 0, "thumbnail_url" text null, "recording_url" text null, "metadata" jsonb null, "raw_total_sales" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "live_stream_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_live_stream_deleted_at" ON "live_stream" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "social_post" ("id" text not null, "tenant_id" text not null, "author_id" text not null, "content" text null, "post_type" text check ("post_type" in ('product_review', 'outfit', 'unboxing', 'tutorial', 'recommendation')) not null, "product_ids" jsonb null, "images" jsonb null, "video_url" text null, "status" text check ("status" in ('draft', 'published', 'hidden', 'flagged')) not null default 'draft', "like_count" integer not null default 0, "comment_count" integer not null default 0, "share_count" integer not null default 0, "is_shoppable" boolean not null default false, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "social_post_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_social_post_deleted_at" ON "social_post" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "social_share" ("id" text not null, "tenant_id" text not null, "product_id" text not null, "sharer_id" text not null, "platform" text check ("platform" in ('whatsapp', 'instagram', 'facebook', 'twitter', 'tiktok', 'email', 'copy_link')) not null, "share_url" text null, "click_count" integer not null default 0, "conversion_count" integer not null default 0, "revenue_generated" numeric not null default 0, "shared_at" timestamptz not null, "metadata" jsonb null, "raw_revenue_generated" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "social_share_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_social_share_deleted_at" ON "social_share" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "group_buy" cascade;`);

    this.addSql(`drop table if exists "live_product" cascade;`);

    this.addSql(`drop table if exists "live_stream" cascade;`);

    this.addSql(`drop table if exists "social_post" cascade;`);

    this.addSql(`drop table if exists "social_share" cascade;`);
  }

}
