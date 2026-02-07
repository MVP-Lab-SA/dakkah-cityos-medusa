import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260207115759 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "subscription_plan" drop constraint if exists "subscription_plan_handle_unique";`);
    this.addSql(`alter table if exists "subscription_discount" drop constraint if exists "subscription_discount_code_unique";`);
    this.addSql(`create table if not exists "billing_cycle" ("id" text not null, "subscription_id" text not null, "period_start" timestamptz not null, "period_end" timestamptz not null, "billing_date" timestamptz not null, "status" text check ("status" in ('upcoming', 'processing', 'completed', 'failed', 'skipped')) not null default 'upcoming', "order_id" text null, "payment_collection_id" text null, "subtotal" numeric not null, "tax_total" numeric not null default 0, "total" numeric not null, "attempt_count" integer not null default 0, "last_attempt_at" timestamptz null, "next_attempt_at" timestamptz null, "completed_at" timestamptz null, "failed_at" timestamptz null, "failure_reason" text null, "failure_code" text null, "tenant_id" text not null, "metadata" jsonb null, "raw_subtotal" jsonb not null, "raw_tax_total" jsonb not null default '{"value":"0","precision":20}', "raw_total" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "billing_cycle_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_billing_cycle_deleted_at" ON "billing_cycle" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_billing_cycle_subscription_id_period_start" ON "billing_cycle" ("subscription_id", "period_start") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_billing_cycle_tenant_id_status" ON "billing_cycle" ("tenant_id", "status") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_billing_cycle_billing_date_status" ON "billing_cycle" ("billing_date", "status") WHERE deleted_at IS NULL AND status = 'upcoming';`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_billing_cycle_next_attempt_at" ON "billing_cycle" ("next_attempt_at") WHERE deleted_at IS NULL AND status = 'failed';`);

    this.addSql(`create table if not exists "subscription" ("id" text not null, "customer_id" text not null, "status" text check ("status" in ('draft', 'active', 'paused', 'past_due', 'canceled', 'expired')) not null default 'draft', "start_date" timestamptz null, "end_date" timestamptz null, "current_period_start" timestamptz null, "current_period_end" timestamptz null, "trial_start" timestamptz null, "trial_end" timestamptz null, "canceled_at" timestamptz null, "billing_interval" text check ("billing_interval" in ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')) not null, "billing_interval_count" integer not null default 1, "billing_anchor_day" integer null, "payment_collection_method" text check ("payment_collection_method" in ('charge_automatically', 'send_invoice')) not null default 'charge_automatically', "payment_provider_id" text null, "payment_method_id" text null, "currency_code" text not null, "subtotal" numeric not null, "tax_total" numeric not null default 0, "total" numeric not null, "max_retry_attempts" integer not null default 3, "retry_count" integer not null default 0, "last_retry_at" timestamptz null, "next_retry_at" timestamptz null, "tenant_id" text not null, "store_id" text null, "metadata" jsonb null, "raw_subtotal" jsonb not null, "raw_tax_total" jsonb not null default '{"value":"0","precision":20}', "raw_total" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "subscription_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_deleted_at" ON "subscription" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_customer_id" ON "subscription" ("customer_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_tenant_id_status" ON "subscription" ("tenant_id", "status") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_status_next_retry_at" ON "subscription" ("status", "next_retry_at") WHERE deleted_at IS NULL AND status = 'past_due';`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_current_period_end" ON "subscription" ("current_period_end") WHERE deleted_at IS NULL AND status = 'active';`);

    this.addSql(`create table if not exists "subscription_discount" ("id" text not null, "tenant_id" text null, "code" text not null, "name" text not null, "discount_type" text check ("discount_type" in ('percentage', 'fixed', 'trial_extension')) not null, "discount_value" numeric not null, "duration" text check ("duration" in ('once', 'repeating', 'forever')) not null default 'once', "duration_in_months" integer null, "applicable_plans" jsonb null, "max_redemptions" integer null, "current_redemptions" integer not null default 0, "max_redemptions_per_customer" integer not null default 1, "starts_at" timestamptz null, "ends_at" timestamptz null, "is_active" boolean not null default true, "stripe_coupon_id" text null, "metadata" jsonb null, "raw_discount_value" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "subscription_discount_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_subscription_discount_code_unique" ON "subscription_discount" ("code") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_discount_deleted_at" ON "subscription_discount" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_discount_tenant_id" ON "subscription_discount" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_discount_code" ON "subscription_discount" ("code") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_discount_is_active" ON "subscription_discount" ("is_active") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "subscription_event" ("id" text not null, "subscription_id" text not null, "tenant_id" text null, "event_type" text check ("event_type" in ('created', 'activated', 'trial_started', 'trial_ended', 'paused', 'resumed', 'canceled', 'expired', 'renewed', 'upgraded', 'downgraded', 'payment_succeeded', 'payment_failed', 'payment_refunded', 'items_added', 'items_removed', 'items_updated')) not null, "event_data" jsonb null, "triggered_by" text check ("triggered_by" in ('customer', 'admin', 'system', 'webhook')) not null default 'system', "triggered_by_id" text null, "occurred_at" timestamptz not null, "billing_cycle_id" text null, "order_id" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "subscription_event_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_event_deleted_at" ON "subscription_event" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_event_subscription_id" ON "subscription_event" ("subscription_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_event_tenant_id" ON "subscription_event" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_event_event_type" ON "subscription_event" ("event_type") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_event_occurred_at" ON "subscription_event" ("occurred_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "subscription_item" ("id" text not null, "subscription_id" text not null, "product_id" text not null, "variant_id" text not null, "product_title" text not null, "variant_title" text null, "quantity" integer not null default 1, "unit_price" numeric not null, "subtotal" numeric not null, "tax_total" numeric not null default 0, "total" numeric not null, "billing_interval" text check ("billing_interval" in ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')) null, "billing_interval_count" integer null, "tenant_id" text not null, "metadata" jsonb null, "raw_unit_price" jsonb not null, "raw_subtotal" jsonb not null, "raw_tax_total" jsonb not null default '{"value":"0","precision":20}', "raw_total" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "subscription_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_item_deleted_at" ON "subscription_item" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_item_subscription_id" ON "subscription_item" ("subscription_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_item_tenant_id_product_id" ON "subscription_item" ("tenant_id", "product_id") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "subscription_pause" ("id" text not null, "subscription_id" text not null, "paused_at" timestamptz not null, "resume_at" timestamptz null, "resumed_at" timestamptz null, "reason" text null, "pause_type" text check ("pause_type" in ('customer_request', 'payment_issue', 'admin_action', 'scheduled')) not null default 'customer_request', "extends_billing_period" boolean not null default true, "days_paused" integer not null default 0, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "subscription_pause_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_pause_deleted_at" ON "subscription_pause" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_pause_subscription_id" ON "subscription_pause" ("subscription_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_pause_paused_at" ON "subscription_pause" ("paused_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "subscription_plan" ("id" text not null, "tenant_id" text null, "name" text not null, "handle" text not null, "description" text null, "status" text check ("status" in ('draft', 'active', 'archived')) not null default 'draft', "billing_interval" text check ("billing_interval" in ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')) not null default 'monthly', "billing_interval_count" integer not null default 1, "currency_code" text not null default 'usd', "price" numeric not null, "compare_at_price" numeric null, "trial_period_days" integer not null default 0, "features" jsonb null, "limits" jsonb null, "included_products" jsonb null, "sort_order" integer not null default 0, "stripe_price_id" text null, "stripe_product_id" text null, "metadata" jsonb null, "raw_price" jsonb not null, "raw_compare_at_price" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "subscription_plan_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_subscription_plan_handle_unique" ON "subscription_plan" ("handle") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_plan_deleted_at" ON "subscription_plan" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_plan_tenant_id" ON "subscription_plan" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_plan_status" ON "subscription_plan" ("status") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_subscription_plan_handle" ON "subscription_plan" ("handle") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "billing_cycle" cascade;`);

    this.addSql(`drop table if exists "subscription" cascade;`);

    this.addSql(`drop table if exists "subscription_discount" cascade;`);

    this.addSql(`drop table if exists "subscription_event" cascade;`);

    this.addSql(`drop table if exists "subscription_item" cascade;`);

    this.addSql(`drop table if exists "subscription_pause" cascade;`);

    this.addSql(`drop table if exists "subscription_plan" cascade;`);
  }

}
