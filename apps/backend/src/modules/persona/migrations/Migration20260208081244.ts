import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208081244 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "persona" drop constraint if exists "persona_tenant_id_slug_unique";`);
    this.addSql(`create table if not exists "persona" ("id" text not null, "tenant_id" text not null, "name" text not null, "slug" text not null, "category" text check ("category" in ('consumer', 'creator', 'business', 'cityops', 'platform')) not null, "axes" jsonb null, "constraints" jsonb null, "allowed_workflows" jsonb null, "allowed_tools" jsonb null, "allowed_surfaces" jsonb null, "feature_overrides" jsonb null, "priority" integer not null default 0, "status" text check ("status" in ('active', 'inactive')) not null default 'active', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "persona_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_persona_deleted_at" ON "persona" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_persona_tenant_id" ON "persona" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_persona_tenant_id_slug_unique" ON "persona" ("tenant_id", "slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_persona_category" ON "persona" ("category") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_persona_status" ON "persona" ("status") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "persona_assignment" ("id" text not null, "tenant_id" text not null, "persona_id" text not null, "user_id" text null, "scope" text check ("scope" in ('session', 'surface', 'membership', 'user-default', 'tenant-default')) not null, "scope_reference" text null, "priority" integer not null default 0, "status" text check ("status" in ('active', 'inactive')) not null default 'active', "starts_at" timestamptz null, "ends_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "persona_assignment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_persona_assignment_deleted_at" ON "persona_assignment" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_persona_assignment_tenant_id" ON "persona_assignment" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_persona_assignment_user_id" ON "persona_assignment" ("user_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_persona_assignment_persona_id" ON "persona_assignment" ("persona_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_persona_assignment_scope" ON "persona_assignment" ("scope") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_persona_assignment_tenant_id_user_id_scope" ON "persona_assignment" ("tenant_id", "user_id", "scope") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "persona" cascade;`);

    this.addSql(`drop table if exists "persona_assignment" cascade;`);
  }

}
