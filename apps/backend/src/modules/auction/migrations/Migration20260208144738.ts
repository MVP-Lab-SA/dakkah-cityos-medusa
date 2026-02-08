import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208144738 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "auction_escrow" ("id" text not null, "tenant_id" text not null, "auction_id" text not null, "customer_id" text not null, "amount" numeric not null, "currency_code" text not null, "status" text check ("status" in ('held', 'released', 'refunded')) not null default 'held', "payment_reference" text null, "held_at" timestamptz not null, "released_at" timestamptz null, "metadata" jsonb null, "raw_amount" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "auction_escrow_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_auction_escrow_deleted_at" ON "auction_escrow" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "auction_listing" ("id" text not null, "tenant_id" text not null, "product_id" text not null, "title" text not null, "description" text null, "auction_type" text check ("auction_type" in ('english', 'dutch', 'sealed', 'reserve')) not null, "status" text check ("status" in ('draft', 'scheduled', 'active', 'ended', 'cancelled')) not null default 'draft', "starting_price" numeric not null, "reserve_price" numeric null, "buy_now_price" numeric null, "current_price" numeric null, "currency_code" text not null, "bid_increment" numeric not null, "starts_at" timestamptz not null, "ends_at" timestamptz not null, "auto_extend" boolean not null default true, "extend_minutes" integer not null default 5, "winner_customer_id" text null, "winning_bid_id" text null, "total_bids" integer not null default 0, "metadata" jsonb null, "raw_starting_price" jsonb not null, "raw_reserve_price" jsonb null, "raw_buy_now_price" jsonb null, "raw_current_price" jsonb null, "raw_bid_increment" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "auction_listing_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_auction_listing_deleted_at" ON "auction_listing" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "auction_result" ("id" text not null, "tenant_id" text not null, "auction_id" text not null, "winner_customer_id" text not null, "winning_bid_id" text not null, "final_price" numeric not null, "currency_code" text not null, "order_id" text null, "payment_status" text check ("payment_status" in ('pending', 'paid', 'failed', 'refunded')) not null default 'pending', "settled_at" timestamptz null, "metadata" jsonb null, "raw_final_price" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "auction_result_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_auction_result_deleted_at" ON "auction_result" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "auto_bid_rule" ("id" text not null, "tenant_id" text not null, "auction_id" text not null, "customer_id" text not null, "max_amount" numeric not null, "increment_amount" numeric null, "is_active" boolean not null default true, "total_bids_placed" integer not null default 0, "metadata" jsonb null, "raw_max_amount" jsonb not null, "raw_increment_amount" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "auto_bid_rule_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_auto_bid_rule_deleted_at" ON "auto_bid_rule" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "bid" ("id" text not null, "tenant_id" text not null, "auction_id" text not null, "customer_id" text not null, "amount" numeric not null, "is_auto_bid" boolean not null default false, "max_auto_bid" numeric null, "status" text check ("status" in ('active', 'outbid', 'winning', 'won', 'cancelled')) not null default 'active', "placed_at" timestamptz not null, "metadata" jsonb null, "raw_amount" jsonb not null, "raw_max_auto_bid" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "bid_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_bid_deleted_at" ON "bid" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "auction_escrow" cascade;`);

    this.addSql(`drop table if exists "auction_listing" cascade;`);

    this.addSql(`drop table if exists "auction_result" cascade;`);

    this.addSql(`drop table if exists "auto_bid_rule" cascade;`);

    this.addSql(`drop table if exists "bid" cascade;`);
  }

}
