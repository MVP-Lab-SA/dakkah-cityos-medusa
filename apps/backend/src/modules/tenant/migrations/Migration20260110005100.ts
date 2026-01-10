import { Migration } from '@mikro-orm/migrations';

export class Migration20260110005100 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "tenant" ("id" text not null, "country_id" text not null, "scope_type" text check ("scope_type" in (\'theme\', \'city\')) not null, "scope_id" text not null, "category_id" text not null, "subcategory_id" text null, "handle" text not null, "name" text not null, "subdomain" text null, "custom_domain" text null, "status" text check ("status" in (\'active\', \'suspended\', \'trial\', \'inactive\')) not null default \'trial\', "subscription_tier" text check ("subscription_tier" in (\'basic\', \'pro\', \'enterprise\', \'custom\')) not null default \'basic\', "billing_email" text not null, "billing_address" jsonb null, "trial_starts_at" timestamptz null, "trial_ends_at" timestamptz null, "logo_url" text null, "brand_colors" jsonb null, "settings" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "tenant_pkey" primary key ("id"));');
    this.addSql('create unique index "tenant_handle_unique" on "tenant" ("handle");');
    this.addSql('create unique index "tenant_subdomain_unique" on "tenant" ("subdomain") where "subdomain" is not null;');
    this.addSql('create unique index "tenant_custom_domain_unique" on "tenant" ("custom_domain") where "custom_domain" is not null;');
    this.addSql('create index "tenant_country_id_index" on "tenant" ("country_id");');
    this.addSql('create index "tenant_scope_id_index" on "tenant" ("scope_id");');
    this.addSql('create index "tenant_category_id_index" on "tenant" ("category_id");');
    this.addSql('create index "tenant_status_index" on "tenant" ("status");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "tenant" cascade;');
  }

}
