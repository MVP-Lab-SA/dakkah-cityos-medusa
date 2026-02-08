import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208144739 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "freelance_contract" ("id" text not null, "tenant_id" text not null, "client_id" text not null, "freelancer_id" text not null, "gig_id" text null, "proposal_id" text null, "title" text not null, "description" text null, "contract_type" text check ("contract_type" in ('fixed', 'hourly', 'retainer')) not null, "total_amount" numeric not null, "currency_code" text not null, "status" text check ("status" in ('draft', 'active', 'paused', 'completed', 'cancelled', 'disputed')) not null default 'draft', "starts_at" timestamptz null, "ends_at" timestamptz null, "terms" jsonb null, "metadata" jsonb null, "raw_total_amount" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "freelance_contract_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_freelance_contract_deleted_at" ON "freelance_contract" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "freelance_dispute" ("id" text not null, "tenant_id" text not null, "contract_id" text not null, "filed_by" text not null, "filed_against" text not null, "reason" text check ("reason" in ('non_delivery', 'quality', 'payment', 'scope_creep', 'communication', 'other')) not null, "description" text not null, "evidence_urls" jsonb null, "status" text check ("status" in ('filed', 'mediation', 'escalated', 'resolved', 'closed')) not null default 'filed', "resolution" text null, "resolved_by" text null, "resolved_at" timestamptz null, "refund_amount" numeric null, "metadata" jsonb null, "raw_refund_amount" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "freelance_dispute_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_freelance_dispute_deleted_at" ON "freelance_dispute" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "gig_listing" ("id" text not null, "tenant_id" text not null, "freelancer_id" text not null, "title" text not null, "description" text not null, "category" text null, "subcategory" text null, "listing_type" text check ("listing_type" in ('fixed_price', 'hourly', 'milestone')) not null, "price" numeric null, "hourly_rate" numeric null, "currency_code" text not null, "delivery_time_days" integer null, "revisions_included" integer not null default 1, "status" text check ("status" in ('draft', 'active', 'paused', 'completed', 'suspended')) not null default 'draft', "skill_tags" jsonb null, "portfolio_urls" jsonb null, "total_orders" integer not null default 0, "avg_rating" integer null, "metadata" jsonb null, "raw_price" jsonb null, "raw_hourly_rate" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "gig_listing_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_gig_listing_deleted_at" ON "gig_listing" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "milestone" ("id" text not null, "tenant_id" text not null, "contract_id" text not null, "title" text not null, "description" text null, "amount" numeric not null, "currency_code" text not null, "due_date" timestamptz null, "status" text check ("status" in ('pending', 'in_progress', 'submitted', 'revision_requested', 'approved', 'paid')) not null default 'pending', "deliverables" jsonb null, "submitted_at" timestamptz null, "approved_at" timestamptz null, "paid_at" timestamptz null, "revision_notes" text null, "metadata" jsonb null, "raw_amount" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "milestone_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_milestone_deleted_at" ON "milestone" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "proposal" ("id" text not null, "tenant_id" text not null, "gig_id" text null, "client_id" text not null, "freelancer_id" text not null, "title" text not null, "description" text not null, "proposed_price" numeric not null, "currency_code" text not null, "estimated_duration_days" integer not null, "milestones" jsonb null, "status" text check ("status" in ('submitted', 'shortlisted', 'accepted', 'rejected', 'withdrawn')) not null default 'submitted', "cover_letter" text null, "attachments" jsonb null, "submitted_at" timestamptz not null, "responded_at" timestamptz null, "metadata" jsonb null, "raw_proposed_price" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "proposal_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_proposal_deleted_at" ON "proposal" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "time_log" ("id" text not null, "tenant_id" text not null, "contract_id" text not null, "freelancer_id" text not null, "description" text null, "started_at" timestamptz not null, "ended_at" timestamptz null, "duration_minutes" integer null, "hourly_rate" numeric null, "total_amount" numeric null, "currency_code" text not null, "is_billable" boolean not null default true, "is_approved" boolean not null default false, "approved_by" text null, "screenshot_url" text null, "metadata" jsonb null, "raw_hourly_rate" jsonb null, "raw_total_amount" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "time_log_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_time_log_deleted_at" ON "time_log" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "freelance_contract" cascade;`);

    this.addSql(`drop table if exists "freelance_dispute" cascade;`);

    this.addSql(`drop table if exists "gig_listing" cascade;`);

    this.addSql(`drop table if exists "milestone" cascade;`);

    this.addSql(`drop table if exists "proposal" cascade;`);

    this.addSql(`drop table if exists "time_log" cascade;`);
  }

}
