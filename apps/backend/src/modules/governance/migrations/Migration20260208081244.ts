import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208081244 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "governance_authority" ("id" text not null, "tenant_id" text null, "name" text not null, "slug" text not null, "code" text null, "type" text check ("type" in ('region', 'country', 'authority')) not null, "jurisdiction_level" integer not null default 0, "parent_authority_id" text null, "country_id" text null, "region_id" text null, "residency_zone" text check ("residency_zone" in ('GCC', 'EU', 'MENA', 'APAC', 'AMERICAS', 'GLOBAL')) null, "policies" jsonb null, "status" text check ("status" in ('active', 'inactive')) not null default 'active', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "governance_authority_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_governance_authority_deleted_at" ON "governance_authority" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_governance_authority_tenant_id" ON "governance_authority" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_governance_authority_slug" ON "governance_authority" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_governance_authority_type" ON "governance_authority" ("type") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_governance_authority_parent_authority_id" ON "governance_authority" ("parent_authority_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_governance_authority_country_id" ON "governance_authority" ("country_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_governance_authority_region_id" ON "governance_authority" ("region_id") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "governance_authority" cascade;`);
  }

}
