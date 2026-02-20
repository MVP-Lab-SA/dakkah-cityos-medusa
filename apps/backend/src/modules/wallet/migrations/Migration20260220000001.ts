import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260220000001 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table if not exists "wallet" (
      "id" text not null,
      "customer_id" text not null,
      "currency" text not null default 'usd',
      "balance" numeric not null default 0,
      "raw_balance" jsonb not null default '{"value":"0","precision":20}',
      "version" integer not null default 1,
      "status" text check ("status" in ('active', 'frozen', 'closed')) not null default 'active',
      "freeze_reason" text null,
      "frozen_at" timestamptz null,
      "metadata" jsonb null,
      "created_at" timestamptz not null default now(),
      "updated_at" timestamptz not null default now(),
      "deleted_at" timestamptz null,
      constraint "wallet_pkey" primary key ("id")
    );`);
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_wallet_customer_currency" ON "wallet" ("customer_id", "currency") WHERE deleted_at IS NULL;`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_wallet_deleted_at" ON "wallet" ("deleted_at") WHERE deleted_at IS NULL;`,
    );

    this.addSql(`create table if not exists "wallet_transaction" (
      "id" text not null,
      "wallet_id" text not null,
      "type" text check ("type" in ('credit', 'debit', 'refund', 'adjustment', 'hold', 'release')) not null,
      "amount" numeric not null,
      "raw_amount" jsonb not null default '{"value":"0","precision":20}',
      "balance_after" numeric not null,
      "raw_balance_after" jsonb not null default '{"value":"0","precision":20}',
      "description" text null,
      "reference_id" text null,
      "reference_type" text null,
      "metadata" jsonb null,
      "created_at" timestamptz not null default now(),
      "updated_at" timestamptz not null default now(),
      "deleted_at" timestamptz null,
      constraint "wallet_transaction_pkey" primary key ("id"),
      constraint "wallet_transaction_wallet_id_fkey" foreign key ("wallet_id") references "wallet" ("id") on delete cascade
    );`);
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_wallet_transaction_wallet_id" ON "wallet_transaction" ("wallet_id");`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_wallet_transaction_deleted_at" ON "wallet_transaction" ("deleted_at") WHERE deleted_at IS NULL;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "wallet_transaction" cascade;`);
    this.addSql(`drop table if exists "wallet" cascade;`);
  }
}
