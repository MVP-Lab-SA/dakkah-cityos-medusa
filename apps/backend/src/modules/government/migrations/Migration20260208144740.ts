import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208144740 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "service_request" drop constraint if exists "service_request_reference_number_unique";`);
    this.addSql(`alter table if exists "permit" drop constraint if exists "permit_permit_number_unique";`);
    this.addSql(`alter table if exists "municipal_license" drop constraint if exists "municipal_license_license_number_unique";`);
    this.addSql(`alter table if exists "fine" drop constraint if exists "fine_fine_number_unique";`);
    this.addSql(`create table if not exists "citizen_profile" ("id" text not null, "tenant_id" text not null, "customer_id" text null, "national_id" text null, "full_name" text not null, "date_of_birth" timestamptz null, "address" jsonb null, "phone" text null, "email" text null, "preferred_language" text not null default 'en', "registered_services" jsonb null, "total_requests" integer not null default 0, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "citizen_profile_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_citizen_profile_deleted_at" ON "citizen_profile" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "fine" ("id" text not null, "tenant_id" text not null, "citizen_id" text null, "fine_type" text check ("fine_type" in ('traffic', 'parking', 'building_code', 'environmental', 'noise', 'other')) not null, "fine_number" text not null, "description" text not null, "amount" numeric not null, "currency_code" text not null, "status" text check ("status" in ('issued', 'contested', 'paid', 'overdue', 'waived')) not null default 'issued', "issued_at" timestamptz not null, "due_date" timestamptz not null, "paid_at" timestamptz null, "payment_reference" text null, "location" jsonb null, "evidence" jsonb null, "contested_reason" text null, "metadata" jsonb null, "raw_amount" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fine_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_fine_fine_number_unique" ON "fine" ("fine_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_fine_deleted_at" ON "fine" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "municipal_license" ("id" text not null, "tenant_id" text not null, "holder_id" text not null, "license_type" text check ("license_type" in ('business', 'trade', 'professional', 'vehicle', 'pet', 'firearm', 'alcohol', 'food_handling')) not null, "license_number" text not null, "status" text check ("status" in ('active', 'expired', 'suspended', 'revoked')) not null default 'active', "issued_at" timestamptz not null, "expires_at" timestamptz null, "renewal_date" timestamptz null, "fee" numeric null, "currency_code" text null, "conditions" jsonb null, "issuing_authority" text null, "metadata" jsonb null, "raw_fee" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "municipal_license_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_municipal_license_license_number_unique" ON "municipal_license" ("license_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_municipal_license_deleted_at" ON "municipal_license" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "permit" ("id" text not null, "tenant_id" text not null, "applicant_id" text not null, "permit_type" text check ("permit_type" in ('building', 'business', 'event', 'parking', 'renovation', 'demolition', 'signage', 'food', 'other')) not null, "permit_number" text not null, "status" text check ("status" in ('draft', 'submitted', 'under_review', 'approved', 'denied', 'expired', 'revoked')) not null default 'draft', "description" text null, "property_address" jsonb null, "fee" numeric null, "currency_code" text null, "submitted_at" timestamptz null, "approved_at" timestamptz null, "approved_by" text null, "expires_at" timestamptz null, "conditions" jsonb null, "denial_reason" text null, "documents" jsonb null, "metadata" jsonb null, "raw_fee" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "permit_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_permit_permit_number_unique" ON "permit" ("permit_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_permit_deleted_at" ON "permit" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "service_request" ("id" text not null, "tenant_id" text not null, "citizen_id" text not null, "request_type" text check ("request_type" in ('maintenance', 'complaint', 'inquiry', 'permit', 'license', 'inspection', 'emergency')) not null, "category" text null, "title" text not null, "description" text not null, "location" jsonb null, "status" text check ("status" in ('submitted', 'acknowledged', 'in_progress', 'resolved', 'closed', 'rejected')) not null default 'submitted', "priority" text check ("priority" in ('low', 'medium', 'high', 'urgent')) not null default 'medium', "assigned_to" text null, "department" text null, "resolution" text null, "resolved_at" timestamptz null, "photos" jsonb null, "reference_number" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "service_request_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_service_request_reference_number_unique" ON "service_request" ("reference_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_request_deleted_at" ON "service_request" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "citizen_profile" cascade;`);

    this.addSql(`drop table if exists "fine" cascade;`);

    this.addSql(`drop table if exists "municipal_license" cascade;`);

    this.addSql(`drop table if exists "permit" cascade;`);

    this.addSql(`drop table if exists "service_request" cascade;`);
  }

}
