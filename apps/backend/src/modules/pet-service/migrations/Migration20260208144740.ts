import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208144740 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "grooming_booking" ("id" text not null, "tenant_id" text not null, "pet_id" text not null, "owner_id" text not null, "provider_id" text null, "service_type" text check ("service_type" in ('bath', 'haircut', 'nail_trim', 'teeth_cleaning', 'full_grooming', 'deshedding')) not null, "status" text check ("status" in ('scheduled', 'in_progress', 'completed', 'cancelled')) not null default 'scheduled', "scheduled_at" timestamptz not null, "duration_minutes" integer not null default 60, "price" numeric null, "currency_code" text null, "special_instructions" text null, "completed_at" timestamptz null, "notes" text null, "metadata" jsonb null, "raw_price" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "grooming_booking_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_grooming_booking_deleted_at" ON "grooming_booking" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "pet_product" ("id" text not null, "tenant_id" text not null, "product_id" text null, "name" text not null, "category" text check ("category" in ('food', 'treats', 'toys', 'accessories', 'health', 'grooming', 'housing')) not null, "species_tags" jsonb null, "breed_specific" text null, "age_group" text check ("age_group" in ('puppy_kitten', 'adult', 'senior', 'all_ages')) not null default 'all_ages', "weight_range" jsonb null, "ingredients" jsonb null, "nutritional_info" jsonb null, "is_prescription_required" boolean not null default false, "price" numeric not null, "currency_code" text not null, "is_active" boolean not null default true, "metadata" jsonb null, "raw_price" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "pet_product_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_pet_product_deleted_at" ON "pet_product" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "pet_profile" ("id" text not null, "tenant_id" text not null, "owner_id" text not null, "name" text not null, "species" text check ("species" in ('dog', 'cat', 'bird', 'fish', 'reptile', 'rabbit', 'hamster', 'other')) not null, "breed" text null, "date_of_birth" timestamptz null, "weight_kg" integer null, "color" text null, "gender" text check ("gender" in ('male', 'female', 'unknown')) not null default 'unknown', "is_neutered" boolean not null default false, "microchip_id" text null, "medical_notes" text null, "allergies" jsonb null, "vaccinations" jsonb null, "photo_url" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "pet_profile_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_pet_profile_deleted_at" ON "pet_profile" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "vet_appointment" ("id" text not null, "tenant_id" text not null, "pet_id" text not null, "owner_id" text not null, "vet_id" text null, "clinic_name" text null, "appointment_type" text check ("appointment_type" in ('checkup', 'vaccination', 'emergency', 'surgery', 'dental', 'follow_up')) not null, "status" text check ("status" in ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')) not null default 'scheduled', "scheduled_at" timestamptz not null, "duration_minutes" integer not null default 30, "reason" text null, "diagnosis" text null, "treatment" text null, "prescriptions" jsonb null, "cost" numeric null, "currency_code" text null, "follow_up_date" timestamptz null, "metadata" jsonb null, "raw_cost" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vet_appointment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vet_appointment_deleted_at" ON "vet_appointment" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "grooming_booking" cascade;`);

    this.addSql(`drop table if exists "pet_product" cascade;`);

    this.addSql(`drop table if exists "pet_profile" cascade;`);

    this.addSql(`drop table if exists "vet_appointment" cascade;`);
  }

}
