import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260213170009 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "cms_page" ("id" text not null, "tenant_id" text not null, "title" text not null, "slug" text not null, "locale" text not null default 'en', "status" text check ("status" in ('draft', 'published', 'archived')) not null default 'draft', "template" text null, "layout" jsonb null, "seo_title" text null, "seo_description" text null, "seo_image" text null, "country_code" text null, "region_zone" text null, "node_id" text null, "published_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cms_page_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_page_deleted_at" ON "cms_page" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_page_tenant_id" ON "cms_page" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_page_slug" ON "cms_page" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_page_locale" ON "cms_page" ("locale") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_page_status" ON "cms_page" ("status") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_page_country_code" ON "cms_page" ("country_code") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_page_region_zone" ON "cms_page" ("region_zone") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_page_node_id" ON "cms_page" ("node_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cms_page_tenant_id_slug_locale_unique" ON "cms_page" ("tenant_id", "slug", "locale") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "cms_navigation" ("id" text not null, "tenant_id" text not null, "locale" text not null default 'en', "location" text check ("location" in ('header', 'footer', 'sidebar', 'mobile')) not null, "items" jsonb not null, "status" text check ("status" in ('active', 'draft')) not null default 'active', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cms_navigation_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_navigation_deleted_at" ON "cms_navigation" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_navigation_tenant_id" ON "cms_navigation" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_navigation_locale" ON "cms_navigation" ("locale") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_navigation_location" ON "cms_navigation" ("location") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cms_navigation_tenant_id_locale_location_unique" ON "cms_navigation" ("tenant_id", "locale", "location") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "cms_page" cascade;`);

    this.addSql(`drop table if exists "cms_navigation" cascade;`);
  }

}
