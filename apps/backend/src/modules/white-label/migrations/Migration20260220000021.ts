import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260220000021 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "white_label_config" (
        "id"               TEXT NOT NULL PRIMARY KEY,
        "tenant_id"        TEXT NOT NULL,
        "brand_name"       TEXT NOT NULL DEFAULT '',
        "logo_url"         TEXT,
        "primary_color"    TEXT,
        "secondary_color"  TEXT,
        "custom_domain"    TEXT,
        "status"           TEXT NOT NULL DEFAULT 'pending',
        "metadata"         JSONB,
        "created_at"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at"       TIMESTAMPTZ
      );
    `);

    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_white_label_config_tenant_id" ON "white_label_config" ("tenant_id") WHERE deleted_at IS NULL;`,
    );
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_white_label_config_custom_domain" ON "white_label_config" ("custom_domain") WHERE custom_domain IS NOT NULL AND deleted_at IS NULL;`,
    );

    this.addSql(`
      CREATE TABLE IF NOT EXISTS "white_label_theme" (
        "id"              TEXT NOT NULL PRIMARY KEY,
        "white_label_id"  TEXT NOT NULL REFERENCES "white_label_config"("id") ON DELETE CASCADE,
        "theme_data"      JSONB,
        "font_family"     TEXT,
        "favicon_url"     TEXT,
        "is_published"    BOOLEAN NOT NULL DEFAULT FALSE,
        "metadata"        JSONB,
        "created_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at"      TIMESTAMPTZ
      );
    `);

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_white_label_theme_config_id" ON "white_label_theme" ("white_label_id");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "white_label_theme";`);
    this.addSql(`DROP TABLE IF EXISTS "white_label_config";`);
  }
}
