import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260220000003 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table if not exists "insurance_policy" (
      "id" text not null,
      "customer_id" text not null,
      "policy_number" text not null,
      "type" text check ("type" in ('product', 'travel', 'health', 'vehicle', 'home', 'life', 'other')) not null default 'product',
      "status" text check ("status" in ('active', 'expired', 'cancelled', 'pending', 'suspended')) not null default 'pending',
      "coverage_amount" numeric not null,
      "raw_coverage_amount" jsonb not null default '{"value":"0","precision":20}',
      "premium_amount" numeric not null,
      "raw_premium_amount" jsonb not null default '{"value":"0","precision":20}',
      "currency" text not null default 'usd',
      "coverage_details" jsonb null,
      "starts_at" timestamptz not null,
      "expires_at" timestamptz not null,
      "product_id" text null,
      "order_id" text null,
      "metadata" jsonb null,
      "created_at" timestamptz not null default now(),
      "updated_at" timestamptz not null default now(),
      "deleted_at" timestamptz null,
      constraint "insurance_policy_pkey" primary key ("id")
    );`);
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_insurance_policy_number" ON "insurance_policy" ("policy_number") WHERE deleted_at IS NULL;`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_insurance_policy_customer_id" ON "insurance_policy" ("customer_id");`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_insurance_policy_deleted_at" ON "insurance_policy" ("deleted_at") WHERE deleted_at IS NULL;`,
    );

    this.addSql(`create table if not exists "insurance_claim" (
      "id" text not null,
      "policy_id" text not null,
      "customer_id" text not null,
      "claim_number" text not null,
      "type" text check ("type" in ('damage', 'loss', 'theft', 'medical', 'liability', 'other')) not null default 'damage',
      "status" text check ("status" in ('submitted', 'under_review', 'approved', 'rejected', 'paid', 'closed')) not null default 'submitted',
      "claimed_amount" numeric not null,
      "raw_claimed_amount" jsonb not null default '{"value":"0","precision":20}',
      "approved_amount" numeric null,
      "raw_approved_amount" jsonb null,
      "description" text not null,
      "evidence" jsonb null,
      "incident_date" timestamptz not null,
      "resolved_at" timestamptz null,
      "notes" text null,
      "metadata" jsonb null,
      "created_at" timestamptz not null default now(),
      "updated_at" timestamptz not null default now(),
      "deleted_at" timestamptz null,
      constraint "insurance_claim_pkey" primary key ("id"),
      constraint "insurance_claim_policy_id_fkey" foreign key ("policy_id") references "insurance_policy" ("id") on delete cascade
    );`);
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_insurance_claim_number" ON "insurance_claim" ("claim_number") WHERE deleted_at IS NULL;`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_insurance_claim_deleted_at" ON "insurance_claim" ("deleted_at") WHERE deleted_at IS NULL;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "insurance_claim" cascade;`);
    this.addSql(`drop table if exists "insurance_policy" cascade;`);
  }
}
