import { Migration } from '@mikro-orm/migrations';

export class Migration20260110005200 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "cityos_store" ("id" text not null, "tenant_id" text not null, "handle" text not null, "name" text not null, "sales_channel_id" text not null, "default_region_id" text null, "supported_currency_codes" jsonb null, "storefront_url" text null, "subdomain" text null, "custom_domain" text null, "theme_config" jsonb null, "logo_url" text null, "favicon_url" text null, "brand_colors" jsonb null, "store_type" text check ("store_type" in (\'retail\', \'marketplace\', \'b2b\', \'subscription\', \'hybrid\')) not null default \'retail\', "status" text check ("status" in (\'active\', \'inactive\', \'maintenance\', \'coming_soon\')) not null default \'inactive\', "seo_title" text null, "seo_description" text null, "seo_keywords" jsonb null, "cms_site_id" text null, "settings" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cityos_store_pkey" primary key ("id"));');
    this.addSql('create unique index "cityos_store_handle_unique" on "cityos_store" ("handle");');
    this.addSql('create unique index "cityos_store_subdomain_unique" on "cityos_store" ("subdomain") where "subdomain" is not null;');
    this.addSql('create unique index "cityos_store_custom_domain_unique" on "cityos_store" ("custom_domain") where "custom_domain" is not null;');
    this.addSql('create index "cityos_store_tenant_id_index" on "cityos_store" ("tenant_id");');
    this.addSql('create index "cityos_store_sales_channel_id_index" on "cityos_store" ("sales_channel_id");');
    this.addSql('create index "cityos_store_status_index" on "cityos_store" ("status");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "cityos_store" cascade;');
  }

}
