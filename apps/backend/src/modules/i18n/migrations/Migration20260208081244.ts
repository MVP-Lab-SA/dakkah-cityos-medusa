import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208081244 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "translation" drop constraint if exists "translation_tenant_id_locale_namespace_key_unique";`);
    this.addSql(`create table if not exists "translation" ("id" text not null, "tenant_id" text not null, "locale" text not null, "namespace" text not null default 'common', "key" text not null, "value" text not null, "context" text null, "status" text check ("status" in ('draft', 'published', 'archived')) not null default 'published', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "translation_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_translation_deleted_at" ON "translation" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_translation_tenant_id_locale_namespace_key_unique" ON "translation" ("tenant_id", "locale", "namespace", "key") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_translation_tenant_id_locale" ON "translation" ("tenant_id", "locale") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_translation_namespace" ON "translation" ("namespace") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "translation" cascade;`);
  }

}
