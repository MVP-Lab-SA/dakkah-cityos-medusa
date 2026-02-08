import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208150024 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "utility_bill" drop constraint if exists "utility_bill_bill_number_unique";`);
    this.addSql(`create table if not exists "meter_reading" ("id" text not null, "tenant_id" text not null, "account_id" text not null, "reading_value" integer not null, "reading_date" timestamptz not null, "reading_type" text check ("reading_type" in ('manual', 'smart_meter', 'estimated')) not null, "previous_reading" integer null, "consumption" integer null, "unit" text null, "submitted_by" text null, "is_verified" boolean not null default false, "photo_url" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "meter_reading_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_meter_reading_deleted_at" ON "meter_reading" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "usage_record" ("id" text not null, "tenant_id" text not null, "account_id" text not null, "period_start" timestamptz not null, "period_end" timestamptz not null, "usage_value" integer not null, "unit" text not null, "usage_type" text check ("usage_type" in ('consumption', 'peak', 'off_peak', 'reactive')) not null, "cost" numeric null, "currency_code" text null, "tier" text null, "metadata" jsonb null, "raw_cost" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "usage_record_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_usage_record_deleted_at" ON "usage_record" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "utility_account" ("id" text not null, "tenant_id" text not null, "customer_id" text not null, "utility_type" text check ("utility_type" in ('electricity', 'water', 'gas', 'internet', 'phone', 'cable', 'waste')) not null, "provider_name" text not null, "account_number" text not null, "meter_number" text null, "address" jsonb null, "status" text check ("status" in ('active', 'suspended', 'closed')) not null default 'active', "auto_pay" boolean not null default false, "payment_method_id" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "utility_account_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_utility_account_deleted_at" ON "utility_account" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "utility_bill" ("id" text not null, "tenant_id" text not null, "account_id" text not null, "bill_number" text not null, "billing_period_start" timestamptz not null, "billing_period_end" timestamptz not null, "due_date" timestamptz not null, "amount" numeric not null, "currency_code" text not null, "consumption" integer null, "consumption_unit" text null, "status" text check ("status" in ('generated', 'sent', 'paid', 'overdue', 'disputed')) not null default 'generated', "paid_at" timestamptz null, "payment_reference" text null, "late_fee" numeric null, "metadata" jsonb null, "raw_amount" jsonb not null, "raw_late_fee" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "utility_bill_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_utility_bill_bill_number_unique" ON "utility_bill" ("bill_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_utility_bill_deleted_at" ON "utility_bill" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "meter_reading" cascade;`);

    this.addSql(`drop table if exists "usage_record" cascade;`);

    this.addSql(`drop table if exists "utility_account" cascade;`);

    this.addSql(`drop table if exists "utility_bill" cascade;`);
  }

}
