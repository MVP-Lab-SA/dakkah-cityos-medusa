import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208150007 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "listing_category" drop constraint if exists "listing_category_handle_unique";`);
    this.addSql(`create table if not exists "classified_listing" ("id" text not null, "tenant_id" text not null, "seller_id" text not null, "title" text not null, "description" text not null, "category_id" text null, "subcategory_id" text null, "listing_type" text check ("listing_type" in ('sell', 'buy', 'trade', 'free', 'wanted')) not null, "condition" text check ("condition" in ('new', 'like_new', 'good', 'fair', 'poor')) not null default 'good', "price" numeric null, "currency_code" text not null, "is_negotiable" boolean not null default true, "location_city" text null, "location_state" text null, "location_country" text null, "latitude" integer null, "longitude" integer null, "status" text check ("status" in ('draft', 'active', 'sold', 'expired', 'flagged', 'removed')) not null default 'draft', "view_count" integer not null default 0, "favorite_count" integer not null default 0, "expires_at" timestamptz null, "promoted_until" timestamptz null, "metadata" jsonb null, "raw_price" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "classified_listing_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_classified_listing_deleted_at" ON "classified_listing" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "listing_category" ("id" text not null, "tenant_id" text not null, "name" text not null, "handle" text not null, "parent_id" text null, "description" text null, "icon" text null, "display_order" integer not null default 0, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "listing_category_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_listing_category_handle_unique" ON "listing_category" ("handle") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_listing_category_deleted_at" ON "listing_category" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "listing_flag" ("id" text not null, "tenant_id" text not null, "listing_id" text not null, "reporter_id" text not null, "reason" text check ("reason" in ('spam', 'inappropriate', 'scam', 'prohibited', 'duplicate', 'other')) not null, "description" text null, "status" text check ("status" in ('pending', 'reviewed', 'actioned', 'dismissed')) not null default 'pending', "reviewed_by" text null, "reviewed_at" timestamptz null, "action_taken" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "listing_flag_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_listing_flag_deleted_at" ON "listing_flag" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "listing_image" ("id" text not null, "listing_id" text not null, "url" text not null, "alt_text" text null, "display_order" integer not null default 0, "is_primary" boolean not null default false, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "listing_image_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_listing_image_deleted_at" ON "listing_image" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "listing_offer" ("id" text not null, "tenant_id" text not null, "listing_id" text not null, "buyer_id" text not null, "amount" numeric not null, "currency_code" text not null, "message" text null, "status" text check ("status" in ('pending', 'accepted', 'rejected', 'withdrawn', 'expired')) not null default 'pending', "counter_amount" numeric null, "responded_at" timestamptz null, "expires_at" timestamptz null, "metadata" jsonb null, "raw_amount" jsonb not null, "raw_counter_amount" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "listing_offer_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_listing_offer_deleted_at" ON "listing_offer" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "classified_listing" cascade;`);

    this.addSql(`drop table if exists "listing_category" cascade;`);

    this.addSql(`drop table if exists "listing_flag" cascade;`);

    this.addSql(`drop table if exists "listing_image" cascade;`);

    this.addSql(`drop table if exists "listing_offer" cascade;`);
  }

}
