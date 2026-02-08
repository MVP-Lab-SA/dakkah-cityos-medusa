import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208144739 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "agent_profile" ("id" text not null, "tenant_id" text not null, "user_id" text null, "name" text not null, "email" text not null, "phone" text null, "license_number" text null, "agency_name" text null, "specializations" jsonb null, "bio" text null, "photo_url" text null, "total_listings" integer not null default 0, "total_sales" integer not null default 0, "avg_rating" integer null, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "agent_profile_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_agent_profile_deleted_at" ON "agent_profile" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "lease_agreement" ("id" text not null, "tenant_id" text not null, "listing_id" text not null, "landlord_id" text not null, "tenant_customer_id" text not null, "status" text check ("status" in ('draft', 'active', 'expired', 'terminated', 'renewed')) not null default 'draft', "start_date" timestamptz not null, "end_date" timestamptz not null, "monthly_rent" numeric not null, "currency_code" text not null, "deposit_amount" numeric null, "deposit_status" text check ("deposit_status" in ('held', 'partially_returned', 'returned')) null, "payment_day" integer not null default 1, "terms" jsonb null, "signed_at" timestamptz null, "terminated_at" timestamptz null, "termination_reason" text null, "metadata" jsonb null, "raw_monthly_rent" jsonb not null, "raw_deposit_amount" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "lease_agreement_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_lease_agreement_deleted_at" ON "lease_agreement" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "property_document" ("id" text not null, "tenant_id" text not null, "listing_id" text null, "lease_id" text null, "document_type" text check ("document_type" in ('title_deed', 'floor_plan', 'inspection', 'contract', 'insurance', 'tax', 'utility', 'other')) not null, "title" text not null, "file_url" text not null, "file_type" text null, "uploaded_by" text null, "is_verified" boolean not null default false, "verified_by" text null, "expires_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "property_document_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_property_document_deleted_at" ON "property_document" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "property_listing" ("id" text not null, "tenant_id" text not null, "agent_id" text null, "title" text not null, "description" text null, "listing_type" text check ("listing_type" in ('sale', 'rent', 'lease', 'auction')) not null, "property_type" text check ("property_type" in ('apartment', 'house', 'villa', 'land', 'commercial', 'office', 'warehouse', 'studio')) not null, "status" text check ("status" in ('draft', 'active', 'under_offer', 'sold', 'rented', 'expired', 'withdrawn')) not null default 'draft', "price" numeric not null, "currency_code" text not null, "price_period" text check ("price_period" in ('total', 'monthly', 'yearly', 'weekly')) null, "address_line1" text not null, "address_line2" text null, "city" text not null, "state" text null, "postal_code" text not null, "country_code" text not null, "latitude" integer null, "longitude" integer null, "bedrooms" integer null, "bathrooms" integer null, "area_sqm" integer null, "year_built" integer null, "features" jsonb null, "images" jsonb null, "virtual_tour_url" text null, "floor_plan_url" text null, "view_count" integer not null default 0, "favorite_count" integer not null default 0, "metadata" jsonb null, "raw_price" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "property_listing_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_property_listing_deleted_at" ON "property_listing" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "property_valuation" ("id" text not null, "tenant_id" text not null, "listing_id" text not null, "valuator_id" text null, "valuation_type" text check ("valuation_type" in ('market', 'assessed', 'insurance', 'investment')) not null, "estimated_value" numeric not null, "currency_code" text not null, "valuation_date" timestamptz not null, "methodology" text null, "comparables" jsonb null, "notes" text null, "valid_until" timestamptz null, "metadata" jsonb null, "raw_estimated_value" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "property_valuation_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_property_valuation_deleted_at" ON "property_valuation" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "viewing_appointment" ("id" text not null, "tenant_id" text not null, "listing_id" text not null, "agent_id" text null, "client_id" text not null, "scheduled_at" timestamptz not null, "duration_minutes" integer not null default 30, "status" text check ("status" in ('requested', 'confirmed', 'completed', 'cancelled', 'no_show')) not null default 'requested', "viewing_type" text check ("viewing_type" in ('in_person', 'virtual')) not null default 'in_person', "notes" text null, "feedback" text null, "interest_level" text check ("interest_level" in ('not_interested', 'somewhat', 'very_interested', 'making_offer')) null, "confirmed_at" timestamptz null, "cancelled_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "viewing_appointment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_viewing_appointment_deleted_at" ON "viewing_appointment" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "agent_profile" cascade;`);

    this.addSql(`drop table if exists "lease_agreement" cascade;`);

    this.addSql(`drop table if exists "property_document" cascade;`);

    this.addSql(`drop table if exists "property_listing" cascade;`);

    this.addSql(`drop table if exists "property_valuation" cascade;`);

    this.addSql(`drop table if exists "viewing_appointment" cascade;`);
  }

}
