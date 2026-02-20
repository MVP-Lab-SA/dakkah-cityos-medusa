import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260220000002 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table if not exists "trade_in_request" (
      "id" text not null,
      "customer_id" text not null,
      "product_id" text null,
      "product_title" text not null,
      "condition" text check ("condition" in ('mint', 'good', 'fair', 'poor', 'damaged')) not null default 'good',
      "description" text null,
      "images" jsonb null,
      "status" text check ("status" in ('pending', 'under_review', 'offer_ready', 'accepted', 'rejected', 'completed', 'cancelled')) not null default 'pending',
      "customer_expected_value" numeric null,
      "raw_customer_expected_value" jsonb null,
      "metadata" jsonb null,
      "created_at" timestamptz not null default now(),
      "updated_at" timestamptz not null default now(),
      "deleted_at" timestamptz null,
      constraint "trade_in_request_pkey" primary key ("id")
    );`);
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_trade_in_request_customer_id" ON "trade_in_request" ("customer_id");`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_trade_in_request_deleted_at" ON "trade_in_request" ("deleted_at") WHERE deleted_at IS NULL;`,
    );

    this.addSql(`create table if not exists "trade_in_offer" (
      "id" text not null,
      "trade_in_request_id" text not null,
      "offered_value" numeric not null,
      "raw_offered_value" jsonb not null default '{"value":"0","precision":20}',
      "expires_at" timestamptz not null,
      "status" text check ("status" in ('pending', 'accepted', 'rejected', 'expired')) not null default 'pending',
      "notes" text null,
      "created_at" timestamptz not null default now(),
      "updated_at" timestamptz not null default now(),
      "deleted_at" timestamptz null,
      constraint "trade_in_offer_pkey" primary key ("id"),
      constraint "trade_in_offer_request_id_fkey" foreign key ("trade_in_request_id") references "trade_in_request" ("id") on delete cascade
    );`);
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_trade_in_offer_deleted_at" ON "trade_in_offer" ("deleted_at") WHERE deleted_at IS NULL;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "trade_in_offer" cascade;`);
    this.addSql(`drop table if exists "trade_in_request" cascade;`);
  }
}
