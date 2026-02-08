import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208152416 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "cityos_store" drop constraint if exists "cityos_store_custom_domain_unique";`);
    this.addSql(`alter table if exists "cityos_store" drop constraint if exists "cityos_store_subdomain_unique";`);
    this.addSql(`alter table if exists "cityos_store" drop constraint if exists "cityos_store_handle_unique";`);
    this.addSql(`create table if not exists "cityos_store" ("id" text not null, "tenant_id" text not null, "handle" text not null, "name" text not null, "sales_channel_id" text not null, "default_region_id" text null, "supported_currency_codes" jsonb null, "storefront_url" text null, "subdomain" text null, "custom_domain" text null, "theme_config" jsonb null, "logo_url" text null, "favicon_url" text null, "brand_colors" jsonb null, "store_type" text check ("store_type" in ('retail', 'marketplace', 'b2b', 'subscription', 'hybrid')) not null default 'retail', "status" text check ("status" in ('active', 'inactive', 'maintenance', 'coming_soon')) not null default 'inactive', "seo_title" text null, "seo_description" text null, "seo_keywords" jsonb null, "cms_site_id" text null, "settings" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cityos_store_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cityos_store_handle_unique" ON "cityos_store" ("handle") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cityos_store_subdomain_unique" ON "cityos_store" ("subdomain") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cityos_store_custom_domain_unique" ON "cityos_store" ("custom_domain") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cityos_store_deleted_at" ON "cityos_store" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "cityos_store" cascade;`);
  }

}
