import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260208160005 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "audit_log" ("id" text not null, "tenant_id" text not null, "action" text not null, "resource_type" text not null, "resource_id" text not null, "actor_id" text null, "actor_role" text null, "actor_email" text null, "node_id" text null, "changes" jsonb null, "previous_values" jsonb null, "new_values" jsonb null, "ip_address" text null, "user_agent" text null, "data_classification" text check ("data_classification" in ('public', 'internal', 'confidential', 'restricted')) not null default 'internal', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "audit_log_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_audit_log_deleted_at" ON "audit_log" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_audit_log_tenant_id" ON "audit_log" ("tenant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_audit_log_resource_type_resource_id" ON "audit_log" ("resource_type", "resource_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_audit_log_actor_id" ON "audit_log" ("actor_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_audit_log_action" ON "audit_log" ("action") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_audit_log_tenant_id_resource_type" ON "audit_log" ("tenant_id", "resource_type") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_audit_log_data_classification" ON "audit_log" ("data_classification") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "audit_log" cascade;`);
  }

}
