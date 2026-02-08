import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208150018 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "prescription" drop constraint if exists "prescription_prescription_number_unique";`);
    this.addSql(`alter table if exists "lab_order" drop constraint if exists "lab_order_order_number_unique";`);
    this.addSql(`alter table if exists "insurance_claim" drop constraint if exists "insurance_claim_claim_number_unique";`);
    this.addSql(`create table if not exists "healthcare_appointment" ("id" text not null, "tenant_id" text not null, "practitioner_id" text not null, "patient_id" text not null, "appointment_type" text check ("appointment_type" in ('consultation', 'follow_up', 'procedure', 'lab_work', 'vaccination', 'screening')) not null, "status" text check ("status" in ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')) not null default 'scheduled', "scheduled_at" timestamptz not null, "duration_minutes" integer not null default 30, "is_virtual" boolean not null default false, "virtual_link" text null, "reason" text null, "notes" text null, "diagnosis_codes" jsonb null, "prescription_ids" jsonb null, "fee" numeric null, "currency_code" text null, "insurance_claim_id" text null, "confirmed_at" timestamptz null, "completed_at" timestamptz null, "cancelled_at" timestamptz null, "metadata" jsonb null, "raw_fee" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "healthcare_appointment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_healthcare_appointment_deleted_at" ON "healthcare_appointment" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "insurance_claim" ("id" text not null, "tenant_id" text not null, "patient_id" text not null, "appointment_id" text null, "claim_number" text not null, "insurance_provider" text not null, "policy_number" text not null, "claim_amount" numeric not null, "approved_amount" numeric null, "currency_code" text not null, "status" text check ("status" in ('submitted', 'under_review', 'approved', 'partially_approved', 'denied', 'paid')) not null default 'submitted', "diagnosis_codes" jsonb null, "procedure_codes" jsonb null, "submitted_at" timestamptz not null, "reviewed_at" timestamptz null, "denial_reason" text null, "paid_at" timestamptz null, "metadata" jsonb null, "raw_claim_amount" jsonb not null, "raw_approved_amount" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "insurance_claim_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_insurance_claim_claim_number_unique" ON "insurance_claim" ("claim_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_insurance_claim_deleted_at" ON "insurance_claim" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "lab_order" ("id" text not null, "tenant_id" text not null, "practitioner_id" text null, "patient_id" text not null, "order_number" text not null, "tests" jsonb not null, "status" text check ("status" in ('ordered', 'sample_collected', 'processing', 'results_ready', 'reviewed', 'cancelled')) not null default 'ordered', "priority" text check ("priority" in ('routine', 'urgent', 'stat')) not null default 'routine', "fasting_required" boolean not null default false, "sample_type" text null, "collected_at" timestamptz null, "results" jsonb null, "results_reviewed_by" text null, "results_reviewed_at" timestamptz null, "lab_name" text null, "notes" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "lab_order_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_lab_order_order_number_unique" ON "lab_order" ("order_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_lab_order_deleted_at" ON "lab_order" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "medical_record" ("id" text not null, "tenant_id" text not null, "patient_id" text not null, "record_type" text check ("record_type" in ('consultation', 'diagnosis', 'procedure', 'lab_result', 'imaging', 'vaccination', 'allergy', 'medication')) not null, "practitioner_id" text null, "appointment_id" text null, "title" text not null, "description" text null, "data" jsonb null, "attachments" jsonb null, "is_confidential" boolean not null default false, "access_level" text check ("access_level" in ('patient', 'practitioner', 'specialist', 'admin')) not null default 'practitioner', "recorded_at" timestamptz not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "medical_record_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_medical_record_deleted_at" ON "medical_record" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "pharmacy_product" ("id" text not null, "tenant_id" text not null, "product_id" text null, "name" text not null, "generic_name" text null, "manufacturer" text null, "dosage_form" text check ("dosage_form" in ('tablet', 'capsule', 'liquid', 'injection', 'topical', 'inhaler', 'patch', 'other')) not null, "strength" text null, "requires_prescription" boolean not null default false, "controlled_substance_schedule" text null, "storage_instructions" text null, "side_effects" jsonb null, "contraindications" jsonb null, "price" numeric not null, "currency_code" text not null, "stock_quantity" integer not null default 0, "expiry_date" timestamptz null, "is_active" boolean not null default true, "metadata" jsonb null, "raw_price" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "pharmacy_product_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_pharmacy_product_deleted_at" ON "pharmacy_product" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "practitioner" ("id" text not null, "tenant_id" text not null, "user_id" text null, "name" text not null, "title" text null, "specialization" text not null, "license_number" text null, "license_verified" boolean not null default false, "bio" text null, "education" jsonb null, "experience_years" integer null, "languages" jsonb null, "consultation_fee" numeric null, "currency_code" text null, "consultation_duration_minutes" integer not null default 30, "is_accepting_patients" boolean not null default true, "rating" integer null, "total_reviews" integer not null default 0, "photo_url" text null, "availability" jsonb null, "metadata" jsonb null, "raw_consultation_fee" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "practitioner_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_practitioner_deleted_at" ON "practitioner" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "prescription" ("id" text not null, "tenant_id" text not null, "practitioner_id" text not null, "patient_id" text not null, "appointment_id" text null, "prescription_number" text not null, "status" text check ("status" in ('issued', 'dispensed', 'partially_dispensed', 'expired', 'cancelled')) not null default 'issued', "medications" jsonb not null, "diagnosis" text null, "notes" text null, "issued_at" timestamptz not null, "valid_until" timestamptz null, "dispensed_at" timestamptz null, "dispensed_by" text null, "pharmacy_id" text null, "is_refillable" boolean not null default false, "refill_count" integer not null default 0, "max_refills" integer not null default 0, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "prescription_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_prescription_prescription_number_unique" ON "prescription" ("prescription_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_prescription_deleted_at" ON "prescription" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "healthcare_appointment" cascade;`);

    this.addSql(`drop table if exists "insurance_claim" cascade;`);

    this.addSql(`drop table if exists "lab_order" cascade;`);

    this.addSql(`drop table if exists "medical_record" cascade;`);

    this.addSql(`drop table if exists "pharmacy_product" cascade;`);

    this.addSql(`drop table if exists "practitioner" cascade;`);

    this.addSql(`drop table if exists "prescription" cascade;`);
  }

}
