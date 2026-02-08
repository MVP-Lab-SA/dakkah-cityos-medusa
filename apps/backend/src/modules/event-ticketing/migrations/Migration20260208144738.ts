import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208144738 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "ticket" drop constraint if exists "ticket_barcode_unique";`);
    this.addSql(`create table if not exists "check_in" ("id" text not null, "tenant_id" text not null, "event_id" text not null, "ticket_id" text not null, "checked_in_by" text null, "checked_in_at" timestamptz not null, "check_in_method" text check ("check_in_method" in ('scan', 'manual', 'online')) not null default 'scan', "device_id" text null, "notes" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "check_in_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_check_in_deleted_at" ON "check_in" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "event" ("id" text not null, "tenant_id" text not null, "vendor_id" text null, "title" text not null, "description" text null, "event_type" text check ("event_type" in ('concert', 'conference', 'workshop', 'sports', 'festival', 'webinar', 'meetup', 'other')) not null, "status" text check ("status" in ('draft', 'published', 'live', 'completed', 'cancelled')) not null default 'draft', "venue_id" text null, "address" jsonb null, "latitude" integer null, "longitude" integer null, "starts_at" timestamptz not null, "ends_at" timestamptz not null, "timezone" text not null default 'UTC', "is_online" boolean not null default false, "online_url" text null, "max_capacity" integer null, "current_attendees" integer not null default 0, "image_url" text null, "organizer_name" text null, "organizer_email" text null, "tags" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "event_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_event_deleted_at" ON "event" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "seat_map" ("id" text not null, "tenant_id" text not null, "venue_id" text not null, "event_id" text null, "name" text not null, "layout" jsonb not null, "total_seats" integer not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "seat_map_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_seat_map_deleted_at" ON "seat_map" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "ticket" ("id" text not null, "tenant_id" text not null, "event_id" text not null, "ticket_type_id" text not null, "order_id" text null, "customer_id" text not null, "attendee_name" text null, "attendee_email" text null, "barcode" text not null, "qr_data" text null, "status" text check ("status" in ('valid', 'used', 'cancelled', 'refunded', 'transferred')) not null default 'valid', "seat_info" jsonb null, "checked_in_at" timestamptz null, "transferred_to" text null, "transferred_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "ticket_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_ticket_barcode_unique" ON "ticket" ("barcode") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ticket_deleted_at" ON "ticket" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "ticket_type" ("id" text not null, "tenant_id" text not null, "event_id" text not null, "name" text not null, "description" text null, "price" numeric not null, "currency_code" text not null, "quantity_total" integer not null, "quantity_sold" integer not null default 0, "quantity_reserved" integer not null default 0, "max_per_order" integer not null default 10, "sale_starts_at" timestamptz null, "sale_ends_at" timestamptz null, "is_active" boolean not null default true, "includes" jsonb null, "metadata" jsonb null, "raw_price" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "ticket_type_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ticket_type_deleted_at" ON "ticket_type" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "venue" ("id" text not null, "tenant_id" text not null, "name" text not null, "description" text null, "address_line1" text not null, "address_line2" text null, "city" text not null, "state" text null, "postal_code" text not null, "country_code" text not null, "latitude" integer null, "longitude" integer null, "capacity" integer null, "venue_type" text check ("venue_type" in ('indoor', 'outdoor', 'hybrid', 'virtual')) not null, "amenities" jsonb null, "contact_phone" text null, "contact_email" text null, "image_url" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "venue_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_venue_deleted_at" ON "venue" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "check_in" cascade;`);

    this.addSql(`drop table if exists "event" cascade;`);

    this.addSql(`drop table if exists "seat_map" cascade;`);

    this.addSql(`drop table if exists "ticket" cascade;`);

    this.addSql(`drop table if exists "ticket_type" cascade;`);

    this.addSql(`drop table if exists "venue" cascade;`);
  }

}
