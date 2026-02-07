import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260207115756 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "booking" drop constraint if exists "booking_booking_number_unique";`);
    this.addSql(`create table if not exists "availability" ("id" text not null, "tenant_id" text null, "owner_type" text check ("owner_type" in ('provider', 'service', 'resource')) not null, "owner_id" text not null, "schedule_type" text check ("schedule_type" in ('weekly_recurring', 'custom')) not null default 'weekly_recurring', "weekly_schedule" jsonb null, "timezone" text not null default 'UTC', "effective_from" timestamptz null, "effective_to" timestamptz null, "slot_duration_minutes" integer not null default 30, "slot_increment_minutes" integer not null default 30, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "availability_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_availability_deleted_at" ON "availability" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_availability_tenant_id" ON "availability" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_availability_owner_type_owner_id" ON "availability" ("owner_type", "owner_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_availability_is_active" ON "availability" ("is_active") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "availability_exception" ("id" text not null, "availability_id" text not null, "tenant_id" text null, "exception_type" text check ("exception_type" in ('time_off', 'holiday', 'special_hours', 'blocked')) not null, "start_date" timestamptz not null, "end_date" timestamptz not null, "all_day" boolean not null default false, "special_hours" jsonb null, "title" text null, "reason" text null, "is_recurring" boolean not null default false, "recurrence_rule" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "availability_exception_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_availability_exception_deleted_at" ON "availability_exception" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_availability_exception_availability_id" ON "availability_exception" ("availability_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_availability_exception_tenant_id" ON "availability_exception" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_availability_exception_start_date_end_date" ON "availability_exception" ("start_date", "end_date") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_availability_exception_exception_type" ON "availability_exception" ("exception_type") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "booking" ("id" text not null, "booking_number" text not null, "tenant_id" text null, "customer_id" text null, "customer_name" text not null, "customer_email" text not null, "customer_phone" text null, "service_product_id" text not null, "provider_id" text null, "order_id" text null, "line_item_id" text null, "start_time" timestamptz not null, "end_time" timestamptz not null, "timezone" text not null default 'UTC', "status" text check ("status" in ('pending', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled')) not null default 'pending', "attendee_count" integer not null default 1, "location_type" text check ("location_type" in ('in_person', 'virtual', 'customer_location')) not null default 'in_person', "location_address" jsonb null, "virtual_meeting_url" text null, "virtual_meeting_id" text null, "currency_code" text not null default 'usd', "subtotal" numeric not null default 0, "discount_total" numeric not null default 0, "tax_total" numeric not null default 0, "total" numeric not null default 0, "payment_status" text check ("payment_status" in ('unpaid', 'deposit_paid', 'paid', 'refunded', 'partially_refunded')) not null default 'unpaid', "deposit_amount" numeric null, "deposit_paid_at" timestamptz null, "cancelled_at" timestamptz null, "cancelled_by" text check ("cancelled_by" in ('customer', 'provider', 'admin', 'system')) null, "cancellation_reason" text null, "cancellation_fee" numeric null, "rescheduled_from_id" text null, "rescheduled_to_id" text null, "reschedule_count" integer not null default 0, "customer_notes" text null, "internal_notes" text null, "provider_notes" text null, "confirmed_at" timestamptz null, "confirmation_sent_at" timestamptz null, "checked_in_at" timestamptz null, "completed_at" timestamptz null, "metadata" jsonb null, "raw_subtotal" jsonb not null default '{"value":"0","precision":20}', "raw_discount_total" jsonb not null default '{"value":"0","precision":20}', "raw_tax_total" jsonb not null default '{"value":"0","precision":20}', "raw_total" jsonb not null default '{"value":"0","precision":20}', "raw_deposit_amount" jsonb null, "raw_cancellation_fee" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "booking_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_booking_booking_number_unique" ON "booking" ("booking_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_deleted_at" ON "booking" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_tenant_id" ON "booking" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_customer_id" ON "booking" ("customer_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_service_product_id" ON "booking" ("service_product_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_provider_id" ON "booking" ("provider_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_start_time_end_time" ON "booking" ("start_time", "end_time") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_status" ON "booking" ("status") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_booking_number" ON "booking" ("booking_number") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "booking_item" ("id" text not null, "booking_id" text not null, "service_product_id" text not null, "title" text not null, "description" text null, "duration_minutes" integer not null, "quantity" integer not null default 1, "unit_price" numeric not null, "subtotal" numeric not null, "discount_amount" numeric not null default 0, "tax_amount" numeric not null default 0, "total" numeric not null, "provider_id" text null, "metadata" jsonb null, "raw_unit_price" jsonb not null, "raw_subtotal" jsonb not null, "raw_discount_amount" jsonb not null default '{"value":"0","precision":20}', "raw_tax_amount" jsonb not null default '{"value":"0","precision":20}', "raw_total" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "booking_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_item_deleted_at" ON "booking_item" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_item_booking_id" ON "booking_item" ("booking_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_item_service_product_id" ON "booking_item" ("service_product_id") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "booking_reminder" ("id" text not null, "booking_id" text not null, "tenant_id" text null, "reminder_type" text check ("reminder_type" in ('email', 'sms', 'push')) not null default 'email', "send_before_minutes" integer not null default 1440, "scheduled_for" timestamptz not null, "status" text check ("status" in ('scheduled', 'sent', 'failed', 'cancelled')) not null default 'scheduled', "sent_at" timestamptz null, "delivered_at" timestamptz null, "opened_at" timestamptz null, "error_message" text null, "retry_count" integer not null default 0, "recipient_email" text null, "recipient_phone" text null, "subject" text null, "message" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "booking_reminder_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_reminder_deleted_at" ON "booking_reminder" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_reminder_booking_id" ON "booking_reminder" ("booking_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_reminder_tenant_id" ON "booking_reminder" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_reminder_status_scheduled_for" ON "booking_reminder" ("status", "scheduled_for") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "service_product" ("id" text not null, "product_id" text not null, "tenant_id" text null, "service_type" text check ("service_type" in ('appointment', 'class', 'rental', 'consultation', 'event', 'custom')) not null default 'appointment', "duration_minutes" integer not null default 60, "buffer_before_minutes" integer not null default 0, "buffer_after_minutes" integer not null default 0, "max_capacity" integer not null default 1, "min_capacity" integer not null default 1, "min_advance_booking_hours" integer not null default 24, "max_advance_booking_days" integer not null default 60, "cancellation_policy_hours" integer not null default 24, "location_type" text check ("location_type" in ('in_person', 'virtual', 'customer_location', 'flexible')) not null default 'in_person', "location_address" jsonb null, "virtual_meeting_url" text null, "virtual_meeting_provider" text check ("virtual_meeting_provider" in ('zoom', 'google_meet', 'teams', 'custom')) null, "pricing_type" text check ("pricing_type" in ('fixed', 'per_person', 'per_hour', 'custom')) not null default 'fixed', "required_resources" jsonb null, "assigned_providers" jsonb null, "inherits_provider_availability" boolean not null default true, "custom_availability_id" text null, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "service_product_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_product_deleted_at" ON "service_product" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_product_product_id" ON "service_product" ("product_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_product_tenant_id" ON "service_product" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_product_service_type" ON "service_product" ("service_type") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_product_is_active" ON "service_product" ("is_active") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "service_provider" ("id" text not null, "tenant_id" text null, "user_id" text null, "name" text not null, "email" text null, "phone" text null, "bio" text null, "avatar_url" text null, "title" text null, "specializations" jsonb null, "certifications" jsonb null, "service_ids" jsonb null, "max_daily_bookings" integer null, "max_weekly_bookings" integer null, "status" text check ("status" in ('active', 'inactive', 'on_leave', 'terminated')) not null default 'active', "timezone" text not null default 'UTC', "calendar_color" text null, "external_calendar_id" text null, "external_calendar_provider" text check ("external_calendar_provider" in ('google', 'outlook', 'ical')) null, "average_rating" numeric null, "total_reviews" integer not null default 0, "total_bookings" integer not null default 0, "metadata" jsonb null, "raw_average_rating" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "service_provider_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_provider_deleted_at" ON "service_provider" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_provider_tenant_id" ON "service_provider" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_provider_user_id" ON "service_provider" ("user_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_provider_status" ON "service_provider" ("status") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "availability" cascade;`);

    this.addSql(`drop table if exists "availability_exception" cascade;`);

    this.addSql(`drop table if exists "booking" cascade;`);

    this.addSql(`drop table if exists "booking_item" cascade;`);

    this.addSql(`drop table if exists "booking_reminder" cascade;`);

    this.addSql(`drop table if exists "service_product" cascade;`);

    this.addSql(`drop table if exists "service_provider" cascade;`);
  }

}
