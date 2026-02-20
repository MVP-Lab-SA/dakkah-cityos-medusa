import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260220000004 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table if not exists "translation" (
      "id" text not null,
      "locale" text not null,
      "namespace" text not null default 'common',
      "key" text not null,
      "value" text not null,
      "metadata" jsonb null,
      "created_at" timestamptz not null default now(),
      "updated_at" timestamptz not null default now(),
      "deleted_at" timestamptz null,
      constraint "translation_pkey" primary key ("id")
    );`);
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_translation_locale_namespace_key" ON "translation" ("locale", "namespace", "key") WHERE deleted_at IS NULL;`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_translation_locale" ON "translation" ("locale");`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_translation_deleted_at" ON "translation" ("deleted_at") WHERE deleted_at IS NULL;`,
    );

    this.addSql(`create table if not exists "locale_config" (
      "id" text not null,
      "locale" text not null,
      "name" text not null,
      "is_default" boolean not null default false,
      "is_active" boolean not null default true,
      "direction" text check ("direction" in ('ltr', 'rtl')) not null default 'ltr',
      "currency" text not null default 'usd',
      "date_format" text null,
      "metadata" jsonb null,
      "created_at" timestamptz not null default now(),
      "updated_at" timestamptz not null default now(),
      "deleted_at" timestamptz null,
      constraint "locale_config_pkey" primary key ("id")
    );`);
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_locale_config_locale" ON "locale_config" ("locale") WHERE deleted_at IS NULL;`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_locale_config_deleted_at" ON "locale_config" ("deleted_at") WHERE deleted_at IS NULL;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "locale_config" cascade;`);
    this.addSql(`drop table if exists "translation" cascade;`);
  }
}
