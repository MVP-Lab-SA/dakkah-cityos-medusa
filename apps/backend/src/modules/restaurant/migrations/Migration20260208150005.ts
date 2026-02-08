import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208150005 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "restaurant" drop constraint if exists "restaurant_handle_unique";`);
    this.addSql(`create table if not exists "kitchen_order" ("id" text not null, "tenant_id" text not null, "restaurant_id" text not null, "order_id" text not null, "station" text null, "status" text check ("status" in ('received', 'preparing', 'ready', 'picked_up', 'cancelled')) not null default 'received', "priority" text check ("priority" in ('normal', 'rush', 'scheduled')) not null default 'normal', "items" jsonb not null, "notes" text null, "estimated_prep_time" integer null, "actual_prep_time" integer null, "started_at" timestamptz null, "completed_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "kitchen_order_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_kitchen_order_deleted_at" ON "kitchen_order" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "menu" ("id" text not null, "tenant_id" text not null, "restaurant_id" text not null, "name" text not null, "description" text null, "menu_type" text check ("menu_type" in ('regular', 'breakfast', 'lunch', 'dinner', 'drinks', 'dessert', 'special')) not null, "is_active" boolean not null default true, "display_order" integer not null default 0, "available_from" text null, "available_until" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "menu_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_menu_deleted_at" ON "menu" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "menu_item" ("id" text not null, "tenant_id" text not null, "menu_id" text not null, "product_id" text null, "name" text not null, "description" text null, "price" numeric not null, "currency_code" text not null, "category" text null, "image_url" text null, "is_available" boolean not null default true, "is_featured" boolean not null default false, "calories" integer null, "allergens" jsonb null, "dietary_tags" jsonb null, "prep_time_minutes" integer null, "display_order" integer not null default 0, "metadata" jsonb null, "raw_price" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "menu_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_menu_item_deleted_at" ON "menu_item" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "modifier" ("id" text not null, "tenant_id" text not null, "group_id" text not null, "name" text not null, "price_adjustment" numeric not null default 0, "currency_code" text not null, "is_available" boolean not null default true, "is_default" boolean not null default false, "calories" integer null, "display_order" integer not null default 0, "metadata" jsonb null, "raw_price_adjustment" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "modifier_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_modifier_deleted_at" ON "modifier" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "modifier_group" ("id" text not null, "tenant_id" text not null, "restaurant_id" text not null, "name" text not null, "description" text null, "selection_type" text check ("selection_type" in ('single', 'multiple')) not null, "min_selections" integer not null default 0, "max_selections" integer null, "is_required" boolean not null default false, "display_order" integer not null default 0, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "modifier_group_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_modifier_group_deleted_at" ON "modifier_group" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "restaurant" ("id" text not null, "tenant_id" text not null, "vendor_id" text null, "name" text not null, "handle" text not null, "description" text null, "cuisine_types" jsonb not null, "address_line1" text not null, "address_line2" text null, "city" text not null, "state" text null, "postal_code" text not null, "country_code" text not null, "latitude" integer null, "longitude" integer null, "phone" text null, "email" text null, "operating_hours" jsonb not null, "is_active" boolean not null default true, "is_accepting_orders" boolean not null default true, "avg_prep_time_minutes" integer not null default 30, "delivery_radius_km" integer null, "min_order_amount" numeric null, "delivery_fee" numeric null, "rating" integer null, "total_reviews" integer not null default 0, "logo_url" text null, "banner_url" text null, "metadata" jsonb null, "raw_min_order_amount" jsonb null, "raw_delivery_fee" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "restaurant_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_restaurant_handle_unique" ON "restaurant" ("handle") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_restaurant_deleted_at" ON "restaurant" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "table_reservation" ("id" text not null, "tenant_id" text not null, "restaurant_id" text not null, "customer_id" text null, "customer_name" text not null, "customer_phone" text not null, "customer_email" text null, "party_size" integer not null, "reservation_date" timestamptz not null, "time_slot" text not null, "duration_minutes" integer not null default 90, "status" text check ("status" in ('pending', 'confirmed', 'seated', 'completed', 'no_show', 'cancelled')) not null default 'pending', "special_requests" text null, "table_number" text null, "confirmed_at" timestamptz null, "cancelled_at" timestamptz null, "cancellation_reason" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "table_reservation_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_table_reservation_deleted_at" ON "table_reservation" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "kitchen_order" cascade;`);

    this.addSql(`drop table if exists "menu" cascade;`);

    this.addSql(`drop table if exists "menu_item" cascade;`);

    this.addSql(`drop table if exists "modifier" cascade;`);

    this.addSql(`drop table if exists "modifier_group" cascade;`);

    this.addSql(`drop table if exists "restaurant" cascade;`);

    this.addSql(`drop table if exists "table_reservation" cascade;`);
  }

}
