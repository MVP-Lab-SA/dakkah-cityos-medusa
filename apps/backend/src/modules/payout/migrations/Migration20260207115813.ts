import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260207115813 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "payout" drop constraint if exists "payout_payout_number_unique";`);
    this.addSql(`create table if not exists "payout" ("id" text not null, "tenant_id" text not null, "store_id" text null, "vendor_id" text not null, "payout_number" text not null, "gross_amount" numeric not null, "commission_amount" numeric not null, "platform_fee_amount" numeric not null default 0, "adjustment_amount" numeric not null default 0, "net_amount" numeric not null, "period_start" timestamptz not null, "period_end" timestamptz not null, "transaction_count" integer not null default 0, "status" text check ("status" in ('pending', 'processing', 'completed', 'failed', 'cancelled', 'on_hold')) not null default 'pending', "payment_method" text check ("payment_method" in ('stripe_connect', 'bank_transfer', 'paypal', 'manual', 'check')) not null, "stripe_transfer_id" text null, "stripe_payout_id" text null, "stripe_failure_code" text null, "stripe_failure_message" text null, "bank_reference_number" text null, "processing_started_at" timestamptz null, "processing_completed_at" timestamptz null, "processing_failed_at" timestamptz null, "retry_count" integer not null default 0, "last_retry_at" timestamptz null, "notes" text null, "failure_reason" text null, "requires_approval" boolean not null default false, "approved_by" text null, "approved_at" timestamptz null, "metadata" jsonb null, "scheduled_for" timestamptz null, "raw_gross_amount" jsonb not null, "raw_commission_amount" jsonb not null, "raw_platform_fee_amount" jsonb not null default '{"value":"0","precision":20}', "raw_adjustment_amount" jsonb not null default '{"value":"0","precision":20}', "raw_net_amount" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "payout_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_payout_payout_number_unique" ON "payout" ("payout_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_payout_deleted_at" ON "payout" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "payout_transaction_link" ("id" text not null, "payout_id" text not null, "commission_transaction_id" text not null, "amount" numeric not null, "raw_amount" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "payout_transaction_link_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_payout_transaction_link_deleted_at" ON "payout_transaction_link" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "payout" cascade;`);

    this.addSql(`drop table if exists "payout_transaction_link" cascade;`);
  }

}
