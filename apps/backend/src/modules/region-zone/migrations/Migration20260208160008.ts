import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208160008 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "region_zone_mapping" ("id" text not null, "residency_zone" text check ("residency_zone" in ('GCC', 'EU', 'MENA', 'APAC', 'AMERICAS', 'GLOBAL')) not null, "medusa_region_id" text not null, "country_codes" jsonb null, "policies_override" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "region_zone_mapping_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_region_zone_mapping_deleted_at" ON "region_zone_mapping" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_region_zone_mapping_residency_zone" ON "region_zone_mapping" ("residency_zone") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_region_zone_mapping_medusa_region_id" ON "region_zone_mapping" ("medusa_region_id") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "region_zone_mapping" cascade;`);
  }

}
