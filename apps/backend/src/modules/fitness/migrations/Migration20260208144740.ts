import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208144740 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "class_booking" ("id" text not null, "tenant_id" text not null, "schedule_id" text not null, "customer_id" text not null, "status" text check ("status" in ('booked', 'checked_in', 'completed', 'cancelled', 'no_show')) not null default 'booked', "booked_at" timestamptz not null, "checked_in_at" timestamptz null, "cancelled_at" timestamptz null, "cancellation_reason" text null, "waitlist_position" integer null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "class_booking_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_class_booking_deleted_at" ON "class_booking" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "class_schedule" ("id" text not null, "tenant_id" text not null, "facility_id" text null, "class_name" text not null, "description" text null, "class_type" text check ("class_type" in ('yoga', 'pilates', 'hiit', 'spinning', 'boxing', 'dance', 'swimming', 'crossfit', 'meditation', 'other')) not null, "instructor_id" text null, "day_of_week" text check ("day_of_week" in ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')) not null, "start_time" text not null, "end_time" text not null, "duration_minutes" integer not null, "max_capacity" integer not null, "current_enrollment" integer not null default 0, "room" text null, "difficulty" text check ("difficulty" in ('beginner', 'intermediate', 'advanced', 'all_levels')) not null default 'all_levels', "is_recurring" boolean not null default true, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "class_schedule_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_class_schedule_deleted_at" ON "class_schedule" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "gym_membership" ("id" text not null, "tenant_id" text not null, "customer_id" text not null, "facility_id" text null, "membership_type" text check ("membership_type" in ('basic', 'premium', 'vip', 'student', 'corporate', 'family')) not null, "status" text check ("status" in ('active', 'frozen', 'expired', 'cancelled')) not null default 'active', "start_date" timestamptz not null, "end_date" timestamptz null, "monthly_fee" numeric not null, "currency_code" text not null, "auto_renew" boolean not null default true, "freeze_count" integer not null default 0, "max_freezes" integer not null default 2, "access_hours" jsonb null, "includes" jsonb null, "metadata" jsonb null, "raw_monthly_fee" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "gym_membership_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_gym_membership_deleted_at" ON "gym_membership" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "trainer_profile" ("id" text not null, "tenant_id" text not null, "user_id" text null, "name" text not null, "specializations" jsonb null, "certifications" jsonb null, "bio" text null, "experience_years" integer null, "hourly_rate" numeric null, "currency_code" text null, "is_accepting_clients" boolean not null default true, "rating" integer null, "total_sessions" integer not null default 0, "photo_url" text null, "availability" jsonb null, "metadata" jsonb null, "raw_hourly_rate" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "trainer_profile_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_trainer_profile_deleted_at" ON "trainer_profile" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "wellness_plan" ("id" text not null, "tenant_id" text not null, "customer_id" text not null, "trainer_id" text null, "title" text not null, "plan_type" text check ("plan_type" in ('fitness', 'nutrition', 'weight_loss', 'muscle_gain', 'flexibility', 'rehabilitation', 'holistic')) not null, "status" text check ("status" in ('active', 'completed', 'paused', 'cancelled')) not null default 'active', "goals" jsonb null, "duration_weeks" integer null, "workout_schedule" jsonb null, "nutrition_guidelines" jsonb null, "progress_notes" jsonb null, "start_date" timestamptz not null, "end_date" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "wellness_plan_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_wellness_plan_deleted_at" ON "wellness_plan" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "class_booking" cascade;`);

    this.addSql(`drop table if exists "class_schedule" cascade;`);

    this.addSql(`drop table if exists "gym_membership" cascade;`);

    this.addSql(`drop table if exists "trainer_profile" cascade;`);

    this.addSql(`drop table if exists "wellness_plan" cascade;`);
  }

}
