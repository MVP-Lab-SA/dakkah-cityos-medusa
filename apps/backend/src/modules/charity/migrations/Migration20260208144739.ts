import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208144739 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "charity_org" ("id" text not null, "tenant_id" text not null, "name" text not null, "description" text null, "registration_number" text null, "category" text check ("category" in ('education', 'health', 'environment', 'poverty', 'disaster', 'animal', 'arts', 'community', 'other')) not null, "website" text null, "email" text null, "phone" text null, "address" jsonb null, "logo_url" text null, "is_verified" boolean not null default false, "verified_at" timestamptz null, "tax_deductible" boolean not null default false, "total_raised" numeric not null default 0, "currency_code" text null, "is_active" boolean not null default true, "metadata" jsonb null, "raw_total_raised" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "charity_org_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_charity_org_deleted_at" ON "charity_org" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "donation" ("id" text not null, "tenant_id" text not null, "campaign_id" text null, "charity_id" text not null, "donor_id" text null, "amount" numeric not null, "currency_code" text not null, "donation_type" text check ("donation_type" in ('one_time', 'monthly', 'annual')) not null, "status" text check ("status" in ('pending', 'completed', 'failed', 'refunded')) not null default 'pending', "is_anonymous" boolean not null default false, "donor_name" text null, "donor_email" text null, "message" text null, "payment_reference" text null, "tax_receipt_id" text null, "recurring_id" text null, "completed_at" timestamptz null, "metadata" jsonb null, "raw_amount" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "donation_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_donation_deleted_at" ON "donation" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "donation_campaign" ("id" text not null, "tenant_id" text not null, "charity_id" text not null, "title" text not null, "description" text null, "goal_amount" numeric null, "raised_amount" numeric not null default 0, "currency_code" text not null, "donor_count" integer not null default 0, "status" text check ("status" in ('draft', 'active', 'completed', 'cancelled')) not null default 'draft', "campaign_type" text check ("campaign_type" in ('one_time', 'recurring', 'emergency', 'matching')) not null, "starts_at" timestamptz null, "ends_at" timestamptz null, "images" jsonb null, "updates" jsonb null, "is_featured" boolean not null default false, "metadata" jsonb null, "raw_goal_amount" jsonb null, "raw_raised_amount" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "donation_campaign_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_donation_campaign_deleted_at" ON "donation_campaign" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "impact_report" ("id" text not null, "tenant_id" text not null, "charity_id" text not null, "campaign_id" text null, "title" text not null, "content" text not null, "report_period_start" timestamptz not null, "report_period_end" timestamptz not null, "metrics" jsonb null, "images" jsonb null, "is_published" boolean not null default false, "published_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "impact_report_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_impact_report_deleted_at" ON "impact_report" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "charity_org" cascade;`);

    this.addSql(`drop table if exists "donation" cascade;`);

    this.addSql(`drop table if exists "donation_campaign" cascade;`);

    this.addSql(`drop table if exists "impact_report" cascade;`);
  }

}
