import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208150019 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "certificate" drop constraint if exists "certificate_certificate_number_unique";`);
    this.addSql(`create table if not exists "assignment" ("id" text not null, "tenant_id" text not null, "course_id" text not null, "lesson_id" text null, "student_id" text not null, "title" text not null, "instructions" text null, "submission_url" text null, "submission_text" text null, "submitted_at" timestamptz null, "status" text check ("status" in ('pending', 'submitted', 'grading', 'graded', 'resubmit_requested')) not null default 'pending', "grade" integer null, "max_grade" integer not null default 100, "feedback" text null, "graded_by" text null, "graded_at" timestamptz null, "due_date" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "assignment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_assignment_deleted_at" ON "assignment" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "certificate" ("id" text not null, "tenant_id" text not null, "enrollment_id" text not null, "course_id" text not null, "student_id" text not null, "certificate_number" text not null, "title" text not null, "issued_at" timestamptz not null, "expires_at" timestamptz null, "credential_url" text null, "verification_code" text null, "skills" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "certificate_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_certificate_certificate_number_unique" ON "certificate" ("certificate_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_certificate_deleted_at" ON "certificate" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "course" ("id" text not null, "tenant_id" text not null, "instructor_id" text null, "title" text not null, "description" text null, "short_description" text null, "category" text null, "subcategory" text null, "level" text check ("level" in ('beginner', 'intermediate', 'advanced', 'all_levels')) not null default 'all_levels', "format" text check ("format" in ('self_paced', 'live', 'hybrid', 'in_person')) not null, "language" text not null default 'en', "price" numeric null, "currency_code" text null, "duration_hours" integer null, "total_lessons" integer not null default 0, "total_enrollments" integer not null default 0, "avg_rating" integer null, "total_reviews" integer not null default 0, "thumbnail_url" text null, "preview_video_url" text null, "syllabus" jsonb null, "prerequisites" jsonb null, "tags" jsonb null, "status" text check ("status" in ('draft', 'published', 'archived')) not null default 'draft', "is_free" boolean not null default false, "certificate_offered" boolean not null default false, "metadata" jsonb null, "raw_price" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "course_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_course_deleted_at" ON "course" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "enrollment" ("id" text not null, "tenant_id" text not null, "course_id" text not null, "student_id" text not null, "order_id" text null, "status" text check ("status" in ('enrolled', 'in_progress', 'completed', 'dropped', 'expired')) not null default 'enrolled', "progress_pct" integer not null default 0, "lessons_completed" integer not null default 0, "enrolled_at" timestamptz not null, "started_at" timestamptz null, "completed_at" timestamptz null, "expires_at" timestamptz null, "certificate_id" text null, "last_accessed_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "enrollment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_enrollment_deleted_at" ON "enrollment" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "lesson" ("id" text not null, "tenant_id" text not null, "course_id" text not null, "title" text not null, "description" text null, "content_type" text check ("content_type" in ('video', 'text', 'quiz', 'assignment', 'live_session', 'download')) not null, "content_url" text null, "content_body" text null, "duration_minutes" integer null, "display_order" integer not null default 0, "is_free_preview" boolean not null default false, "is_mandatory" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "lesson_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_lesson_deleted_at" ON "lesson" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "quiz" ("id" text not null, "tenant_id" text not null, "course_id" text not null, "lesson_id" text null, "title" text not null, "description" text null, "quiz_type" text check ("quiz_type" in ('multiple_choice', 'true_false', 'short_answer', 'mixed')) not null, "questions" jsonb not null, "passing_score" integer not null default 70, "time_limit_minutes" integer null, "max_attempts" integer not null default 3, "is_randomized" boolean not null default false, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "quiz_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_quiz_deleted_at" ON "quiz" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "assignment" cascade;`);

    this.addSql(`drop table if exists "certificate" cascade;`);

    this.addSql(`drop table if exists "course" cascade;`);

    this.addSql(`drop table if exists "enrollment" cascade;`);

    this.addSql(`drop table if exists "lesson" cascade;`);

    this.addSql(`drop table if exists "quiz" cascade;`);
  }

}
