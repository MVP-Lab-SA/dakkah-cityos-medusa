import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208150017 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "part_catalog" ("id" text not null, "tenant_id" text not null, "name" text not null, "part_number" text not null, "oem_number" text null, "description" text null, "category" text null, "compatible_makes" jsonb null, "compatible_models" jsonb null, "compatible_years" jsonb null, "price" numeric not null, "currency_code" text not null, "stock_quantity" integer not null default 0, "condition" text check ("condition" in ('new', 'refurbished', 'used')) not null default 'new', "weight_kg" integer null, "dimensions" jsonb null, "supplier" text null, "is_active" boolean not null default true, "metadata" jsonb null, "raw_price" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "part_catalog_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_part_catalog_deleted_at" ON "part_catalog" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "test_drive" ("id" text not null, "tenant_id" text not null, "listing_id" text not null, "customer_id" text not null, "dealer_id" text null, "scheduled_at" timestamptz not null, "duration_minutes" integer not null default 30, "status" text check ("status" in ('requested', 'confirmed', 'completed', 'cancelled', 'no_show')) not null default 'requested', "location" text null, "license_verified" boolean not null default false, "feedback" text null, "interest_level" text check ("interest_level" in ('not_interested', 'considering', 'ready_to_buy')) null, "confirmed_at" timestamptz null, "completed_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "test_drive_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_test_drive_deleted_at" ON "test_drive" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "trade_in" ("id" text not null, "tenant_id" text not null, "customer_id" text not null, "listing_id" text null, "make" text not null, "model_name" text not null, "year" integer not null, "mileage_km" integer not null, "condition" text check ("condition" in ('excellent', 'good', 'fair', 'poor')) not null, "vin" text null, "description" text null, "photos" jsonb null, "estimated_value" numeric null, "offered_value" numeric null, "accepted_value" numeric null, "currency_code" text not null, "status" text check ("status" in ('submitted', 'appraising', 'offered', 'accepted', 'rejected', 'completed')) not null default 'submitted', "appraised_by" text null, "appraised_at" timestamptz null, "metadata" jsonb null, "raw_estimated_value" jsonb null, "raw_offered_value" jsonb null, "raw_accepted_value" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "trade_in_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_trade_in_deleted_at" ON "trade_in" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "vehicle_listing" ("id" text not null, "tenant_id" text not null, "seller_id" text not null, "listing_type" text check ("listing_type" in ('sale', 'lease', 'auction')) not null, "title" text not null, "make" text not null, "model_name" text not null, "year" integer not null, "mileage_km" integer null, "fuel_type" text check ("fuel_type" in ('petrol', 'diesel', 'electric', 'hybrid', 'hydrogen')) null, "transmission" text check ("transmission" in ('automatic', 'manual', 'cvt')) null, "body_type" text check ("body_type" in ('sedan', 'suv', 'hatchback', 'truck', 'van', 'coupe', 'convertible', 'wagon')) null, "color" text null, "vin" text null, "condition" text check ("condition" in ('new', 'certified_pre_owned', 'used', 'salvage')) not null default 'used', "price" numeric not null, "currency_code" text not null, "description" text null, "features" jsonb null, "images" jsonb null, "location_city" text null, "location_country" text null, "status" text check ("status" in ('draft', 'active', 'reserved', 'sold', 'withdrawn')) not null default 'draft', "view_count" integer not null default 0, "metadata" jsonb null, "raw_price" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vehicle_listing_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vehicle_listing_deleted_at" ON "vehicle_listing" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "vehicle_service" ("id" text not null, "tenant_id" text not null, "vehicle_listing_id" text null, "customer_id" text not null, "service_type" text check ("service_type" in ('maintenance', 'repair', 'inspection', 'detailing', 'tire', 'oil_change', 'other')) not null, "status" text check ("status" in ('scheduled', 'in_progress', 'completed', 'cancelled')) not null default 'scheduled', "description" text null, "scheduled_at" timestamptz not null, "completed_at" timestamptz null, "estimated_cost" numeric null, "actual_cost" numeric null, "currency_code" text not null, "service_center" text null, "technician" text null, "parts_used" jsonb null, "notes" text null, "metadata" jsonb null, "raw_estimated_cost" jsonb null, "raw_actual_cost" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vehicle_service_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vehicle_service_deleted_at" ON "vehicle_service" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "part_catalog" cascade;`);

    this.addSql(`drop table if exists "test_drive" cascade;`);

    this.addSql(`drop table if exists "trade_in" cascade;`);

    this.addSql(`drop table if exists "vehicle_listing" cascade;`);

    this.addSql(`drop table if exists "vehicle_service" cascade;`);
  }

}
