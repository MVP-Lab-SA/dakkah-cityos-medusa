import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208150011 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "travel_reservation" drop constraint if exists "travel_reservation_confirmation_number_unique";`);
    this.addSql(`create table if not exists "amenity" ("id" text not null, "tenant_id" text not null, "name" text not null, "category" text check ("category" in ('room', 'property', 'dining', 'wellness', 'business', 'entertainment')) not null, "description" text null, "icon" text null, "is_free" boolean not null default true, "price" numeric null, "currency_code" text null, "metadata" jsonb null, "raw_price" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "amenity_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_amenity_deleted_at" ON "amenity" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "guest_profile" ("id" text not null, "tenant_id" text not null, "customer_id" text not null, "preferences" jsonb null, "loyalty_tier" text null, "total_stays" integer not null default 0, "total_nights" integer not null default 0, "total_spent" numeric not null default 0, "nationality" text null, "passport_number" text null, "dietary_requirements" text null, "special_needs" text null, "metadata" jsonb null, "raw_total_spent" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "guest_profile_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_guest_profile_deleted_at" ON "guest_profile" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "rate_plan" ("id" text not null, "tenant_id" text not null, "property_id" text not null, "room_type_id" text not null, "name" text not null, "description" text null, "rate_type" text check ("rate_type" in ('standard', 'promotional', 'corporate', 'package', 'seasonal')) not null, "price" numeric not null, "currency_code" text not null, "valid_from" timestamptz not null, "valid_to" timestamptz not null, "min_stay" integer not null default 1, "max_stay" integer null, "cancellation_policy" text check ("cancellation_policy" in ('free', 'moderate', 'strict', 'non_refundable')) not null default 'moderate', "includes_breakfast" boolean not null default false, "is_active" boolean not null default true, "metadata" jsonb null, "raw_price" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rate_plan_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rate_plan_deleted_at" ON "rate_plan" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "room" ("id" text not null, "tenant_id" text not null, "property_id" text not null, "room_type_id" text not null, "room_number" text not null, "floor" text null, "status" text check ("status" in ('available', 'occupied', 'maintenance', 'out_of_order')) not null default 'available', "is_smoking" boolean not null default false, "is_accessible" boolean not null default false, "notes" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "room_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_room_deleted_at" ON "room" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "room_type" ("id" text not null, "tenant_id" text not null, "property_id" text not null, "name" text not null, "description" text null, "base_price" numeric not null, "currency_code" text not null, "max_occupancy" integer not null, "bed_configuration" jsonb null, "room_size_sqm" integer null, "amenities" jsonb null, "images" jsonb null, "total_rooms" integer not null default 0, "is_active" boolean not null default true, "metadata" jsonb null, "raw_base_price" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "room_type_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_room_type_deleted_at" ON "room_type" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "travel_property" ("id" text not null, "tenant_id" text not null, "vendor_id" text null, "name" text not null, "description" text null, "property_type" text check ("property_type" in ('hotel', 'resort', 'hostel', 'apartment', 'villa', 'guesthouse', 'motel', 'boutique')) not null, "star_rating" integer null, "address_line1" text not null, "address_line2" text null, "city" text not null, "state" text null, "country_code" text not null, "postal_code" text null, "latitude" integer null, "longitude" integer null, "check_in_time" text not null default '15:00', "check_out_time" text not null default '11:00', "phone" text null, "email" text null, "website" text null, "amenities" jsonb null, "policies" jsonb null, "images" jsonb null, "is_active" boolean not null default true, "avg_rating" integer null, "total_reviews" integer not null default 0, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "travel_property_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_travel_property_deleted_at" ON "travel_property" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "travel_reservation" ("id" text not null, "tenant_id" text not null, "property_id" text not null, "room_type_id" text not null, "room_id" text null, "guest_id" text not null, "order_id" text null, "confirmation_number" text not null, "check_in_date" timestamptz not null, "check_out_date" timestamptz not null, "nights" integer not null, "adults" integer not null default 1, "children" integer not null default 0, "status" text check ("status" in ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show')) not null default 'pending', "total_price" numeric not null, "currency_code" text not null, "special_requests" text null, "cancelled_at" timestamptz null, "cancellation_reason" text null, "metadata" jsonb null, "raw_total_price" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "travel_reservation_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_travel_reservation_confirmation_number_unique" ON "travel_reservation" ("confirmation_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_travel_reservation_deleted_at" ON "travel_reservation" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "amenity" cascade;`);

    this.addSql(`drop table if exists "guest_profile" cascade;`);

    this.addSql(`drop table if exists "rate_plan" cascade;`);

    this.addSql(`drop table if exists "room" cascade;`);

    this.addSql(`drop table if exists "room_type" cascade;`);

    this.addSql(`drop table if exists "travel_property" cascade;`);

    this.addSql(`drop table if exists "travel_reservation" cascade;`);
  }

}
