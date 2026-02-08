import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208144740 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "parking_session" ("id" text not null, "tenant_id" text not null, "zone_id" text not null, "customer_id" text null, "vehicle_plate" text null, "spot_number" text null, "status" text check ("status" in ('active', 'completed', 'expired', 'cancelled')) not null default 'active', "started_at" timestamptz not null, "ended_at" timestamptz null, "duration_minutes" integer null, "amount" numeric null, "currency_code" text not null, "payment_status" text check ("payment_status" in ('pending', 'paid', 'failed')) not null default 'pending', "payment_reference" text null, "is_ev_charging" boolean not null default false, "metadata" jsonb null, "raw_amount" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "parking_session_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_parking_session_deleted_at" ON "parking_session" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "parking_zone" ("id" text not null, "tenant_id" text not null, "name" text not null, "description" text null, "zone_type" text check ("zone_type" in ('street', 'garage', 'lot', 'valet', 'airport', 'reserved')) not null, "address" jsonb null, "latitude" integer null, "longitude" integer null, "total_spots" integer not null, "available_spots" integer not null, "hourly_rate" numeric null, "daily_rate" numeric null, "monthly_rate" numeric null, "currency_code" text not null, "operating_hours" jsonb null, "is_active" boolean not null default true, "has_ev_charging" boolean not null default false, "has_disabled_spots" boolean not null default false, "metadata" jsonb null, "raw_hourly_rate" jsonb null, "raw_daily_rate" jsonb null, "raw_monthly_rate" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "parking_zone_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_parking_zone_deleted_at" ON "parking_zone" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "ride_request" ("id" text not null, "tenant_id" text not null, "customer_id" text not null, "pickup_location" jsonb not null, "dropoff_location" jsonb not null, "ride_type" text check ("ride_type" in ('standard', 'premium', 'shared', 'accessible')) not null, "status" text check ("status" in ('requested', 'matched', 'driver_en_route', 'in_progress', 'completed', 'cancelled')) not null default 'requested', "driver_id" text null, "vehicle_id" text null, "estimated_fare" numeric null, "actual_fare" numeric null, "currency_code" text not null, "distance_km" integer null, "duration_minutes" integer null, "requested_at" timestamptz not null, "picked_up_at" timestamptz null, "dropped_off_at" timestamptz null, "rating" integer null, "metadata" jsonb null, "raw_estimated_fare" jsonb null, "raw_actual_fare" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "ride_request_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ride_request_deleted_at" ON "ride_request" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "shuttle_route" ("id" text not null, "tenant_id" text not null, "name" text not null, "description" text null, "route_type" text check ("route_type" in ('airport', 'hotel', 'campus', 'event', 'city')) not null, "stops" jsonb not null, "schedule" jsonb null, "vehicle_type" text null, "capacity" integer null, "price" numeric null, "currency_code" text null, "is_active" boolean not null default true, "metadata" jsonb null, "raw_price" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "shuttle_route_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_shuttle_route_deleted_at" ON "shuttle_route" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "parking_session" cascade;`);

    this.addSql(`drop table if exists "parking_zone" cascade;`);

    this.addSql(`drop table if exists "ride_request" cascade;`);

    this.addSql(`drop table if exists "shuttle_route" cascade;`);
  }

}
