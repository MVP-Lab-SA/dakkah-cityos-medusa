import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260213170002 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "loyalty_account" ("id" text not null, "program_id" text not null, "customer_id" text not null, "tenant_id" text not null, "points_balance" integer not null default 0, "lifetime_points" integer not null default 0, "tier" text null, "tier_expires_at" timestamptz null, "status" text check ("status" in ('active', 'suspended', 'closed')) not null default 'active', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "loyalty_account_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_loyalty_account_deleted_at" ON "loyalty_account" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_loyalty_account_tenant_id" ON "loyalty_account" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_loyalty_account_program_id" ON "loyalty_account" ("program_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_loyalty_account_customer_id" ON "loyalty_account" ("customer_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_loyalty_account_tier" ON "loyalty_account" ("tier") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_loyalty_account_status" ON "loyalty_account" ("status") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "point_transaction" ("id" text not null, "account_id" text not null, "tenant_id" text not null, "type" text check ("type" in ('earn', 'redeem', 'expire', 'adjust', 'transfer')) not null, "points" integer not null, "balance_after" integer not null, "reference_type" text null, "reference_id" text null, "description" text null, "expires_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "point_transaction_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_point_transaction_deleted_at" ON "point_transaction" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_point_transaction_tenant_id" ON "point_transaction" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_point_transaction_account_id" ON "point_transaction" ("account_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_point_transaction_type" ON "point_transaction" ("type") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_point_transaction_reference_type_reference_id" ON "point_transaction" ("reference_type", "reference_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_point_transaction_expires_at" ON "point_transaction" ("expires_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "loyalty_account" cascade;`);

    this.addSql(`drop table if exists "point_transaction" cascade;`);
  }

}
