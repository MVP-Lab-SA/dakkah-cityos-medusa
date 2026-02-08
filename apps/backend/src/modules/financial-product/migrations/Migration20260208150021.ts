import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208150021 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "loan_application" drop constraint if exists "loan_application_application_number_unique";`);
    this.addSql(`alter table if exists "insurance_policy" drop constraint if exists "insurance_policy_policy_number_unique";`);
    this.addSql(`create table if not exists "insurance_policy" ("id" text not null, "tenant_id" text not null, "product_id" text not null, "holder_id" text not null, "policy_number" text not null, "status" text check ("status" in ('pending', 'active', 'lapsed', 'cancelled', 'expired', 'claimed')) not null default 'pending', "premium_amount" numeric not null, "currency_code" text not null, "payment_frequency" text check ("payment_frequency" in ('monthly', 'quarterly', 'annually')) not null, "coverage_amount" numeric not null, "deductible" numeric null, "start_date" timestamptz not null, "end_date" timestamptz not null, "beneficiaries" jsonb null, "documents" jsonb null, "auto_renew" boolean not null default true, "last_payment_at" timestamptz null, "next_payment_at" timestamptz null, "metadata" jsonb null, "raw_premium_amount" jsonb not null, "raw_coverage_amount" jsonb not null, "raw_deductible" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "insurance_policy_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_insurance_policy_policy_number_unique" ON "insurance_policy" ("policy_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_insurance_policy_deleted_at" ON "insurance_policy" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "insurance_product" ("id" text not null, "tenant_id" text not null, "name" text not null, "description" text null, "insurance_type" text check ("insurance_type" in ('health', 'life', 'auto', 'home', 'travel', 'business', 'pet', 'device')) not null, "coverage_details" jsonb null, "min_premium" numeric null, "max_premium" numeric null, "currency_code" text not null, "deductible_options" jsonb null, "term_options" jsonb null, "claim_process" text null, "exclusions" jsonb null, "is_active" boolean not null default true, "metadata" jsonb null, "raw_min_premium" jsonb null, "raw_max_premium" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "insurance_product_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_insurance_product_deleted_at" ON "insurance_product" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "investment_plan" ("id" text not null, "tenant_id" text not null, "name" text not null, "description" text null, "plan_type" text check ("plan_type" in ('savings', 'fixed_deposit', 'mutual_fund', 'gold', 'crypto', 'real_estate')) not null, "min_investment" numeric not null, "currency_code" text not null, "expected_return_pct" integer null, "risk_level" text check ("risk_level" in ('low', 'moderate', 'high', 'very_high')) not null, "lock_in_months" integer null, "is_shariah_compliant" boolean not null default false, "features" jsonb null, "terms" jsonb null, "is_active" boolean not null default true, "metadata" jsonb null, "raw_min_investment" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "investment_plan_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_investment_plan_deleted_at" ON "investment_plan" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "loan_application" ("id" text not null, "tenant_id" text not null, "loan_product_id" text not null, "applicant_id" text not null, "application_number" text not null, "requested_amount" numeric not null, "approved_amount" numeric null, "currency_code" text not null, "term_months" integer not null, "interest_rate" integer null, "monthly_payment" numeric null, "status" text check ("status" in ('draft', 'submitted', 'under_review', 'approved', 'disbursed', 'rejected', 'cancelled')) not null default 'draft', "purpose" text null, "income_details" jsonb null, "documents" jsonb null, "credit_score" integer null, "submitted_at" timestamptz null, "approved_at" timestamptz null, "approved_by" text null, "disbursed_at" timestamptz null, "rejection_reason" text null, "metadata" jsonb null, "raw_requested_amount" jsonb not null, "raw_approved_amount" jsonb null, "raw_monthly_payment" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "loan_application_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_loan_application_application_number_unique" ON "loan_application" ("application_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_loan_application_deleted_at" ON "loan_application" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "loan_product" ("id" text not null, "tenant_id" text not null, "name" text not null, "description" text null, "loan_type" text check ("loan_type" in ('personal', 'business', 'mortgage', 'auto', 'education', 'micro')) not null, "min_amount" numeric not null, "max_amount" numeric not null, "currency_code" text not null, "interest_rate_min" integer not null, "interest_rate_max" integer not null, "interest_type" text check ("interest_type" in ('fixed', 'variable', 'reducing_balance')) not null, "min_term_months" integer not null, "max_term_months" integer not null, "processing_fee_pct" integer null, "requirements" jsonb null, "is_active" boolean not null default true, "metadata" jsonb null, "raw_min_amount" jsonb not null, "raw_max_amount" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "loan_product_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_loan_product_deleted_at" ON "loan_product" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "insurance_policy" cascade;`);

    this.addSql(`drop table if exists "insurance_product" cascade;`);

    this.addSql(`drop table if exists "investment_plan" cascade;`);

    this.addSql(`drop table if exists "loan_application" cascade;`);

    this.addSql(`drop table if exists "loan_product" cascade;`);
  }

}
