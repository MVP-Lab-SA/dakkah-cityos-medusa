import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208081244 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "node" drop constraint if exists "node_tenant_id_slug_unique";`);
    this.addSql(`create table if not exists "node" ("id" text not null, "tenant_id" text not null, "name" text not null, "slug" text not null, "code" text null, "type" text check ("type" in ('CITY', 'DISTRICT', 'ZONE', 'FACILITY', 'ASSET')) not null, "depth" integer not null, "parent_id" text null, "breadcrumbs" jsonb null, "location" jsonb null, "status" text check ("status" in ('active', 'inactive', 'maintenance')) not null default 'active', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "node_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_node_deleted_at" ON "node" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_node_tenant_id" ON "node" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_node_tenant_id_type" ON "node" ("tenant_id", "type") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_node_tenant_id_slug_unique" ON "node" ("tenant_id", "slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_node_parent_id" ON "node" ("parent_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_node_type_depth" ON "node" ("type", "depth") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "node" cascade;`);
  }

}
