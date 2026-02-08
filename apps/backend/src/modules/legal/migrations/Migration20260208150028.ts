import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208150028 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "retainer_agreement" drop constraint if exists "retainer_agreement_agreement_number_unique";`);
    this.addSql(`alter table if exists "legal_case" drop constraint if exists "legal_case_case_number_unique";`);
    this.addSql(`create table if not exists "attorney_profile" ("id" text not null, "tenant_id" text not null, "user_id" text null, "name" text not null, "bar_number" text null, "specializations" jsonb null, "practice_areas" jsonb null, "bio" text null, "education" jsonb null, "experience_years" integer null, "hourly_rate" numeric null, "currency_code" text null, "is_accepting_cases" boolean not null default true, "rating" integer null, "total_cases" integer not null default 0, "photo_url" text null, "languages" jsonb null, "metadata" jsonb null, "raw_hourly_rate" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "attorney_profile_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_attorney_profile_deleted_at" ON "attorney_profile" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "legal_case" ("id" text not null, "tenant_id" text not null, "attorney_id" text not null, "client_id" text not null, "case_number" text not null, "title" text not null, "description" text null, "case_type" text check ("case_type" in ('civil', 'criminal', 'corporate', 'family', 'real_estate', 'immigration', 'ip', 'tax', 'labor', 'other')) not null, "status" text check ("status" in ('consultation', 'retained', 'active', 'discovery', 'trial', 'settled', 'closed', 'appeal')) not null default 'consultation', "priority" text check ("priority" in ('low', 'medium', 'high', 'urgent')) not null default 'medium', "filing_date" timestamptz null, "court_name" text null, "opposing_party" text null, "documents" jsonb null, "notes" text null, "estimated_cost" numeric null, "actual_cost" numeric null, "currency_code" text null, "outcome" text null, "closed_at" timestamptz null, "metadata" jsonb null, "raw_estimated_cost" jsonb null, "raw_actual_cost" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "legal_case_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_legal_case_case_number_unique" ON "legal_case" ("case_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_legal_case_deleted_at" ON "legal_case" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "legal_consultation" ("id" text not null, "tenant_id" text not null, "attorney_id" text not null, "client_id" text not null, "case_id" text null, "consultation_type" text check ("consultation_type" in ('initial', 'follow_up', 'strategy', 'settlement', 'mediation')) not null, "status" text check ("status" in ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')) not null default 'scheduled', "scheduled_at" timestamptz not null, "duration_minutes" integer not null default 60, "is_virtual" boolean not null default false, "virtual_link" text null, "fee" numeric null, "currency_code" text null, "notes" text null, "action_items" jsonb null, "completed_at" timestamptz null, "metadata" jsonb null, "raw_fee" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "legal_consultation_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_legal_consultation_deleted_at" ON "legal_consultation" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "retainer_agreement" ("id" text not null, "tenant_id" text not null, "attorney_id" text not null, "client_id" text not null, "case_id" text null, "agreement_number" text not null, "status" text check ("status" in ('draft', 'active', 'expired', 'terminated')) not null default 'draft', "retainer_amount" numeric not null, "currency_code" text not null, "billing_cycle" text check ("billing_cycle" in ('monthly', 'quarterly', 'annually')) not null, "hours_included" integer null, "hourly_overage_rate" numeric null, "start_date" timestamptz not null, "end_date" timestamptz null, "auto_renew" boolean not null default false, "balance_remaining" numeric not null default 0, "total_billed" numeric not null default 0, "terms" jsonb null, "signed_at" timestamptz null, "metadata" jsonb null, "raw_retainer_amount" jsonb not null, "raw_hourly_overage_rate" jsonb null, "raw_balance_remaining" jsonb not null default '{"value":"0","precision":20}', "raw_total_billed" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "retainer_agreement_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_retainer_agreement_agreement_number_unique" ON "retainer_agreement" ("agreement_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_retainer_agreement_deleted_at" ON "retainer_agreement" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "attorney_profile" cascade;`);

    this.addSql(`drop table if exists "legal_case" cascade;`);

    this.addSql(`drop table if exists "legal_consultation" cascade;`);

    this.addSql(`drop table if exists "retainer_agreement" cascade;`);
  }

}
