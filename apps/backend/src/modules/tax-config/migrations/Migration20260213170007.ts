import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260213170007 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "tax_rule" ("id" text not null, "tenant_id" text not null, "name" text not null, "description" text null, "country_code" text null, "region_code" text null, "city" text null, "postal_code_pattern" text null, "tax_rate" numeric not null default 0, "tax_type" text check ("tax_type" in ('sales', 'vat', 'gst', 'customs', 'withholding')) not null default 'sales', "applies_to" text check ("applies_to" in ('products', 'services', 'shipping', 'all')) not null default 'all', "category" text null, "priority" integer not null default 0, "status" text check ("status" in ('active', 'inactive')) not null default 'active', "valid_from" timestamptz null, "valid_to" timestamptz null, "metadata" jsonb null, "raw_tax_rate" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "tax_rule_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tax_rule_deleted_at" ON "tax_rule" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tax_rule_tenant_id" ON "tax_rule" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tax_rule_country_code" ON "tax_rule" ("country_code") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tax_rule_tax_type" ON "tax_rule" ("tax_type") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tax_rule_status" ON "tax_rule" ("status") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tax_rule_priority" ON "tax_rule" ("priority") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tax_rule_country_code_region_code_city" ON "tax_rule" ("country_code", "region_code", "city") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "tax_rule" cascade;`);
  }

}
